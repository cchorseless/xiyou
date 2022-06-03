import { globalData } from "./GameCache";
import { GameDebugger } from "./GameDebugger";
import { GameEnum } from "./GameEnum";
import { GameFunc } from "./GameFunc";
import { GameSetting } from "./GameSetting";
import { BotHelper } from "./helper/BotHelper";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { SingletonClass } from "./helper/SingletonHelper";
import { TimerHelper } from "./helper/TimerHelper";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { modifier_property } from "./npc/modifier/modifier_property";
import { modifier_task_npc } from "./npc/modifier/modifier_task";
import { EnemyUnitComponent } from "./rules/Components/Enemy/EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./rules/Components/Enemy/EnemyUnitEntityRoot";
import { RoundPrizeUnitEntityRoot } from "./rules/Components/Round/RoundPrizeUnitEntityRoot";
import { GameRequest } from "./service/GameRequest";

export class GameEvent extends SingletonClass {
    public init(): void {
        this.addEvent();
    }

    public addEvent() {
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.NpcSpawnedEvent, this.OnNPCSpawned);
        // EventHelper.addGameEvent(GameEnum.Event.GameEvent.ServerSpawnEvent, this.onServerSpawnEvent, this);
        // EventHelper.addGameEvent(GameEnum.Event.GameEvent.DotaOnHeroFinishSpawnEvent, this.onHeroFinishSpawn, this);
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.game_rules_state_change, this.OnGameRulesStateChange);
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.EntityKilledEvent, this.OnEntityKilled);
        // EventHelper.addGameEvent(GameEnum.Event.GameEvent.DotaPlayerUsedAbilityEvent, this.OnAbilityUsed, this);
        // EventHelper.addGameEvent(EventInfo.ServerSpawnEvent, this.onServerSpawnEvent, this);
        /**JS 请求LUA 事件 */
        EventHelper.addCustomEvent(this, "JS_TO_LUA_EVENT", this.onJS_TO_LUA_EVENT);
    }

    public OnNPCSpawned(event: NpcSpawnedEvent) {
        let spawnedUnit = EntIndexToHScript(event.entindex) as BaseNpc_Plus;
        if (spawnedUnit == null) return;
        let sUnitName = spawnedUnit.GetUnitName();
        if (sUnitName == GameEnum.Unit.UnitNames.npc_dota_thinker) {
            return;
        }
        if (EntityHelper.checkIsFirstSpawn(spawnedUnit)) {
            modifier_property.apply(spawnedUnit, spawnedUnit);
            spawnedUnit.SetPhysicalArmorBaseValue(0);
            spawnedUnit.SetBaseMagicalResistanceValue(0);
            if (spawnedUnit.InitActivityModifier) {
                spawnedUnit.InitActivityModifier();
            }
            if (spawnedUnit.onSpawned) {
                spawnedUnit.onSpawned(event);
            }
            spawnedUnit.runSpawnedHandler();
            // --技能添加事件
            // let abilityCount = spawnedUnit.GetAbilityCount();
            // for (let index = 0; index < abilityCount; index++) {
            //     let ability = spawnedUnit.GetAbilityByIndex(index)
            //     if (ability) {
            //         let d = { entityIndex: spawnedUnit.entindex(), abilityIndex: ability.entindex() };
            //         EventHelper.FireEvent(GameEnum.Event.CustomEvent.custom_unit_ability_added, d)
            //     }
            // }
            // // --自定义增加技能func
            // local addAbilityFunc = spawnedUnit.AddAbility
            // if addAbilityFunc then
            // spawnedUnit.AddAbility = function (unit, pszAbilityName)
            //     let ability = addAbilityFunc(unit, pszAbilityName)
            // if ability then
            // unit: RemoveModifierByName(ability: GetIntrinsicModifierName() or "")
            // FireGameEvent("custom_unit_ability_added", { entityIndex = unit: entindex(), abilityIndex = ability: entindex() })
            // end
            // return ability
        }
    }

    public OnGameRulesStateChange(): void {
        const nNewState = GameRules.State_Get();
        LogHelper.print("OnGameRulesStateChange", nNewState);
        switch (nNewState) {
            case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
                GameDebugger.addDebuggerData(GameEnum.Debugger.globalData.DOTA_GAMERULES_STATE_INIT, GetSystemTimeMS() / 1000);
                break;
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
                GameDebugger.addDebuggerData(GameEnum.Debugger.globalData.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD, GetSystemTimeMS() / 1000);
                break;
            // -- 游戏初始化
            case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                GameDebugger.addDebuggerData(GameEnum.Debugger.globalData.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP, GetSystemTimeMS() / 1000);
                GameDebugger.GetInstance().debugger_OnPlayerDisconnect();
                break;
            // 	-- 选择英雄,可以获取玩家数量
            case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
                this.StartGameMode_HERO_SELECTION();
                break;
            // 	-- 策略时间 创建初始英雄，调用初始英雄脚本
            case DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME:
                break;
            // 	队伍阵容调整阶段
            case DOTA_GameState.DOTA_GAMERULES_STATE_TEAM_SHOWCASE:
                this.StartGameMode_TEAM_SHOWCASE();
                break;
            // 	地图加载阶段
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD:
                break;
            // 	-- 准备阶段(进游戏，刷怪前)
            case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
                this.StartPreGame();
                break;
            // -- 游戏准备开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                break;
            //  --游戏正式开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME:
                this.startGame();
                break;
        }
    }
    public StartGameMode_HERO_SELECTION() {
        // 初始化系统
        // let playercount = PlayerResource.NumTeamPlayers();
        // if (playercount < 5) {
        //     BotHelper.addBot(5 - playercount)
        //     playercount = 5
        // }
        // System_Avalon.Init(playercount);
        // System_Task.Init();
        // System_PlayerData.Init();
    }
    public StartGameMode_TEAM_SHOWCASE() {}
    public StartPreGame() {
        // // 创建NPC
        // let config = KVHelper.KvServerConfig.npc_position_config;
        // let excludearr = [GameEnum.Unit.UnitNames.unit_red_tp,
        // GameEnum.Unit.UnitNames.unit_blue_tp] as string[];
        // for (let i in config) {
        //     let info = config[i as '1001'];
        //     if (excludearr.indexOf(info.unitname!) > -1) { continue }
        //     let v = Vector()
        //     v.x = tonumber(info.position_x);
        //     v.y = tonumber(info.position_y);
        //     v.z = tonumber(info.position_z);
        //     CreateUnitByNameAsync(info.unitname, v, true, null, null, tonumber(info.teamid) || 2, (unit: BaseNpc_Plus) => {
        //         if (tonumber(info.isground) == 1) {
        //             unit.SetAbsOrigin(GetGroundPosition(v, unit))
        //         }
        //         unit.SetAbsAngles(
        //             tonumber(info.angles_x),
        //             tonumber(info.angles_y),
        //             tonumber(info.angles_z));
        //         // 任务道具计数
        //         modifier_task_npc.apply(unit, unit);
        //     });
        // }
        // // 系统启动
        // System_Avalon.Start()
    }
    /**
     * 英雄创建完成事件
     * @param event
     */
    public onHeroFinishSpawn(event: DotaOnHeroFinishSpawnEvent) {}

    /**游戏正式开始 */
    public startGame() {}

    public OnEntityKilled(events: EntityKilledEvent) {
        let hUnit = EntIndexToHScript(events.entindex_killed) as BaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot) {
            return;
        }
        if (hUnit.ETRoot.AsValid<EnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
            let enemyUnit = hUnit.ETRoot.As<EnemyUnitEntityRoot>();
            enemyUnit.GetPlayer().EnemyManagerComp().killEnemy(enemyUnit);
        } else if (hUnit.ETRoot.AsValid<RoundPrizeUnitEntityRoot>("RoundPrizeUnitEntityRoot")) {
            let enemyUnit = hUnit.ETRoot.As<RoundPrizeUnitEntityRoot>();
            enemyUnit.KillPrizeComp()?.OnKillByEntity(events.entindex_attacker);
        }
    }

    public OnAbilityUsed(event: DotaPlayerUsedAbilityEvent) {}

    /**
     * JS 请求 LUA 事件
     *
     *
     * */
    public onJS_TO_LUA_EVENT(entindex: EntityIndex, event: JS_TO_LUA_DATA) {
        if (event.protocol == null) {
            return;
        }
        let allCB = globalData.allCustomProtocolEvent[event.protocol];
        if (allCB && allCB.length > 0) {
            allCB.forEach((cbinfo) => {
                let [status, nextCall] = xpcall(
                    cbinfo.cb,
                    (msg: any) => {
                        return "\n" + LogHelper.traceFunc(msg) + "\n";
                    },
                    cbinfo.context,
                    event
                );
                if (!status) {
                    LogHelper.error(`===============protocol error : ${event.protocol} ===================`);
                    LogHelper.error(nextCall);
                    GameRequest.GetInstance().SendErrorLog(nextCall);
                    return;
                }
                if (event.hasCB) {
                    let player = PlayerResource.GetPlayer(event.PlayerID);
                    if (player) {
                        delete event["hasCB"];
                        delete event["PlayerID"];
                        // 处理复杂数据类型，数据类型
                        if (event.data != null) {
                        }
                        CustomGameEventManager.Send_ServerToPlayer<JS_TO_LUA_DATA>(player, event.protocol, event);
                    }
                }
            });
        }
    }
}
