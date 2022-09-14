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

    public OnAbilityUsed(event: DotaPlayerUsedAbilityEvent) { }

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
