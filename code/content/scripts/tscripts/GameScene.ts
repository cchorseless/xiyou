/**
 * 解决循环引用折中方案，出现循环应用，这里添加引用后，再引用该模块。
 * 弃用，采用缓存类的形式
 */

import { Assert_Sounds } from "./assert/Assert_Sounds";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { LogHelper } from "./helper/LogHelper";
import { NetTablesHelper } from "./helper/NetTablesHelper";
import { ability_propertytool } from "./npc/propertystat/ability_propertytool";
import { Enum_MODIFIER_EVENT, EventDataType, IBuffEventData, modifier_event } from "./npc/propertystat/modifier_event";
import { modifier_property } from "./npc/propertystat/modifier_property";
import { BuildingSystemComponent } from "./rules/System/BuildingSystemComponent";
import { ChessControlSystemComponent } from "./rules/System/ChessControlSystemComponent";
import { CombinationSystemComponent } from "./rules/System/CombinationSystemComponent";
import { DrawSystemComponent } from "./rules/System/DrawSystemComponent";
import { EnemySystemComponent } from "./rules/System/EnemySystemComponent";
import { GameServiceSystemComponent } from "./rules/System/GameServiceSystemComponent";
import { MapSystemComponent } from "./rules/System/MapSystemComponent";
import { PublicBagSystemComponent } from "./rules/System/PublicBagSystemComponent";
import { RoundSystemComponent } from "./rules/System/RoundSystemComponent";
import { WearableSystemComponent } from "./rules/System/WearableSystemComponent";
import { GameEnum } from "./shared/GameEnum";
import { ET } from "./shared/lib/Entity";

/**
 * 避免循环加载导入模块，尽量避免用.文件路径更改需要批量替换
 * @param s 文件路径
 */
// function requirePlus<T>(s: string) {
//     s = string.gsub(s, "/", ".")[0];
//     let nameList = s.split('.')
//     return require(s)[nameList[nameList.length - 1]] as T
// }

// import { item_towerchange_custom } from "./npc/items/avalon/item_towerchange_custom";
// export const _item_towerchange_custom = () => {
//     return requirePlus<typeof item_towerchange_custom>("npc/items/avalon/item_towerchange_custom")
// };

export class GameScene {

    static get Scene() {
        return ET.GameSceneRoot.GetInstance();
    }
    static GetPlayer(playerid: PlayerID | number) {
        return GPlayerEntityRoot.GetOneInstance(playerid as PlayerID)
    }
    private static _WaitSyncEntity: { obj: ET.Entity, ignoreChild: boolean }[] = [];
    public static SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        if (GPlayerEntityRoot.IsAllLogin) {
            NetTablesHelper.SetETEntity(obj, ignoreChild);
        }
        else {
            for (let i = 0, len = this._WaitSyncEntity.length; i < len; i++) {
                if (this._WaitSyncEntity[i].obj === obj) {
                    this._WaitSyncEntity[i].ignoreChild = ignoreChild;
                    return;
                }
            }
            this._WaitSyncEntity.push({ obj: obj, ignoreChild: ignoreChild });
        }
    }

    static init() {
        this.addEvent();
        GPlayerEntityRoot.Init()
        this.Scene.AddComponent(GameServiceSystemComponent);
        this.Scene.AddComponent(MapSystemComponent);
        this.Scene.AddComponent(DrawSystemComponent);
        this.Scene.AddComponent(ChessControlSystemComponent);
        this.Scene.AddComponent(RoundSystemComponent);
        this.Scene.AddComponent(EnemySystemComponent);
        this.Scene.AddComponent(BuildingSystemComponent);
        this.Scene.AddComponent(CombinationSystemComponent);
        this.Scene.AddComponent(WearableSystemComponent);
        this.Scene.AddComponent(PublicBagSystemComponent);
    }

    static StartGame() {
        GRoundSystem.GetInstance().StartGame();
        GDrawSystem.GetInstance().StartGame();
        GPlayerEntityRoot.StartGame();
    }


    /**本局是否結束 */
    static bGameEnd = false;
    static bVictory = false

    static Victory() {
        if (this.bGameEnd == true) return;
        GPlayerEntityRoot.GetAllPlayeridByTeam().forEach((iPlayerID) => {
            let _hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID);
            if (_hHero && _hHero.IsAlive()) {
                // this.UpdatePlayerEndData(hHero)
            }
        });
        this.bGameEnd = true;
        this.bVictory = true;
        EmitAnnouncerSound(Assert_Sounds.Announcer.end_02);
        EmitGlobalSound(Assert_Sounds.Game.Victory);
        GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_GOODGUYS);
    }
    static Defeat() {
        if (this.bGameEnd == true) return;
        GPlayerEntityRoot.GetAllPlayeridByTeam().forEach((iPlayerID) => {
            let _hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID);
            if (_hHero && _hHero.IsAlive()) {
                // this.UpdatePlayerEndData(hHero)
                if (!IsInToolsMode()) {
                    _hHero.ForceKill(false);
                }
            }
        });
        this.bGameEnd = true;
        this.bVictory = false;
        EmitAnnouncerSound(Assert_Sounds.Announcer.end_08);
        EmitGlobalSound(Assert_Sounds.Game.Defeat);
        GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_BADGUYS);
    }

    private static OnGameEnd() {

    }

    private static addEvent() {
        EventHelper.addGameEvent(GameEnum.GameEvent.game_rules_state_change, GHandler.create(this, this.onGameRulesStateChange));
        // EventHelper.addGameEvent(this, GameEnum.GameEvent.DotaOnHeroFinishSpawnEvent, this.onHeroFinishSpawn);
        EventHelper.addGameEvent(GameEnum.GameEvent.NpcSpawnedEvent, GHandler.create(this, this.OnNPCSpawned));
        EventHelper.addGameEvent(GameEnum.GameEvent.EntityKilledEvent, GHandler.create(this, this.OnEntityKilled));
        EventHelper.addGameEvent(GameEnum.GameEvent.EntityHurtEvent, GHandler.create(this, this.OnEntityHurt));
        /**JS 请求LUA 事件 */
        EventHelper.addCustomEvent("JS_TO_LUA_EVENT", GHandler.create(this, this.onJS_TO_LUA_EVENT));
        this.addItemEvent();
    }

    /**监听游戏item事件 */
    private static addItemEvent() {
        // 道具获取事件
        EventHelper.addGameEvent(GameEnum.GameEvent.DotaInventoryItemAddedEvent, GHandler.create(this, (event) => {
            // 17 表示 无效
            if (event.item_slot < DOTAScriptInventorySlot_t.DOTA_ITEM_TRANSIENT_ITEM) {
                (event as IBuffEventData).eventType = EventDataType.unitIsSelf + EventDataType.OtherCanBeAnyOne;
                let unit = EntIndexToHScript(event.inventory_parent_entindex) as IBaseNpc_Plus;
                (event as IBuffEventData).unit = unit;
                // 设置道具第一个拥有者
                let item = EntIndexToHScript(event.item_entindex) as IBaseItem_Plus;
                modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_GET);
                if (item.ETRoot && unit.ETRoot) {
                    let itemroot = item.ETRoot.As<IItemEntityRoot>();
                    let npcroot = unit.ETRoot.As<IBattleUnitEntityRoot>()
                    if (npcroot.InventoryComp()) {
                        npcroot.InventoryComp().addItemRoot(itemroot);
                    }
                }
            }
        }));
        // 道具缺失事件
        EventHelper.addGameEvent(GameEnum.GameEvent.DotaHeroInventoryItemChangeEvent, GHandler.create(this, (event: DotaHeroInventoryItemChangeEvent) => {
            let item = EntIndexToHScript(event.item_entindex) as IBaseItem_Plus;
            let state = item.GetItemState();
            let slot = item.GetItemSlot();
            (event as IBuffEventData).eventType = EventDataType.unitIsSelf + EventDataType.OtherCanBeAnyOne;
            let unit = EntIndexToHScript(event.hero_entindex) as IBaseNpc_Plus;
            (event as IBuffEventData).unit = unit;
            // 道具不在身上
            if (state == 0 && slot == -1) {
                modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_LOSE);
            }
            // 道具销毁|出售
            else if (state == 1 && slot == DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1) {
                modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_DESTROY);
                if (item.ETRoot) {
                    let itemroot = item.ETRoot.As<IItemEntityRoot>();
                    itemroot.Dispose();
                }
            }
        }));
        // 道具位置改变
        EventHelper.addProtocolEvent(GameEnum.CustomProtocol.req_ITEM_SLOT_CHANGE, GHandler.create(this, (event: JS_TO_LUA_DATA) => {
            let playerid = event.PlayerID;
            let hero = GPlayerEntityRoot.GetOneInstance(playerid).Hero!;
            if (hero != null) {
                // 检查位置是否改变
                let changeData = hero.ETRoot.As<ICourierEntityRoot>().CourierDataComp().CheckItemSlotChange();
                if (changeData) {
                    let _event: IBuffEventData = {};
                    (_event as IBuffEventData).eventType = EventDataType.unitIsSelf + EventDataType.OtherCanBeAnyOne;
                    (_event as IBuffEventData).unit = hero as IBaseNpc_Plus;
                    (_event as IBuffEventData).changeSlot = changeData[0];
                    (_event as IBuffEventData).state = changeData[1];
                    modifier_event.FireEvent(_event, Enum_MODIFIER_EVENT.ON_ITEM_SLOT_CHANGE);
                }
            }
        }));
        // 道具给人
        EventHelper.addProtocolEvent(GameEnum.CustomProtocol.req_ITEM_GIVE_NPC, GHandler.create(this, (event: JS_TO_LUA_DATA) => {
            let playerid = event.PlayerID;
            let itemslot = event.data.slot;
            let npcentindex = event.data.npc;
            let itementityid = event.data.itementityid;
            let hero = GPlayerEntityRoot.GetOneInstance(playerid).Hero!;
            if (hero == null || itemslot == null || npcentindex == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid args", playerid);
                return;
            }
            let itemEnity = EntIndexToHScript(itementityid) as IBaseItem_Plus;
            let npc = EntIndexToHScript(npcentindex) as IBaseNpc_Plus;
            if (!GameFunc.IsValid(itemEnity) || !GameFunc.IsValid(npc) || itemEnity.ETRoot == null || npc.ETRoot == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid item or npc", playerid);
                return;
            }
            let itemroot = itemEnity.ETRoot.As<IItemEntityRoot>();
            let npcroot = npc.ETRoot.As<IBattleUnitEntityRoot>()
            if (!itemroot.canGiveToNpc(npcroot)) {
                event.state = false;
                EventHelper.ErrorMessage("cant give to npc", playerid);
                return;
            }
            npcroot.InventoryComp().addItemRoot(itemroot);
            event.state = true;
        }));
        // 道具仍在地上
        EventHelper.addProtocolEvent(GameEnum.CustomProtocol.req_ITEM_DROP_POSITION, GHandler.create(this, (event: JS_TO_LUA_DATA) => {
            let playerid = event.PlayerID;
            let itemslot = event.data.slot;
            let itementityid = event.data.itementityid;
            let pos = event.data.pos;
            let hero = GPlayerEntityRoot.GetOneInstance(playerid).Hero!;
            if (hero == null || itemslot == null || pos == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid args", playerid);
                return;
            }
            let itemEnity = EntIndexToHScript(itementityid) as IBaseItem_Plus;
            if (!GameFunc.IsValid(itemEnity) || itemEnity.ETRoot == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid item ", playerid);
                return;
            }
            let itemroot = itemEnity.ETRoot.As<IItemEntityRoot>();
            if (itemroot.DomainParent == null) {
                event.state = false;
                EventHelper.ErrorMessage(" item DomainParent is null", playerid);
                return;
            }
            let posV = Vector(pos.x, pos.y, pos.z);
            itemroot.DomainParent.As<IBattleUnitEntityRoot>().InventoryComp().dropItemRoot(itemroot, posV);
            event.state = true;
        }));
    }
    private static async onGameRulesStateChange(e: any) {
        const nNewState = GameRules.State_Get();
        LogHelper.print("OnGameRulesStateChange", nNewState);
        switch (nNewState) {
            case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
                GPlayerEntityRoot.UploadGameRecord(GameEnum.EGameRecordKey.GameTime.GAMERULES_STATE_INIT, GetSystemTimeMS() / 1000);
                break;
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
                GPlayerEntityRoot.UploadGameRecord(GameEnum.EGameRecordKey.GameTime.GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD, GetSystemTimeMS() / 1000);
                break;
            // -- 游戏初始化
            case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                GPlayerEntityRoot.UploadGameRecord(GameEnum.EGameRecordKey.GameTime.GAMERULES_STATE_CUSTOM_GAME_SETUP, GetSystemTimeMS() / 1000);
                await GPlayerEntityRoot.LoginServer();
                // GameRules.SetCustomGameSetupRemainingTime(1)
                break;
            // 	-- 选择英雄,可以获取玩家数量
            case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
                break;
            // 	-- 策略时间 创建初始英雄，调用初始英雄脚本
            case DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME:
                break;
            // 	队伍阵容调整阶段
            case DOTA_GameState.DOTA_GAMERULES_STATE_TEAM_SHOWCASE:
                break;
            // 	地图加载阶段
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD:
                break;
            // 	-- 准备阶段(进游戏，刷怪前)
            case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
                GMapSystem.GetInstance().StartGame();
                break;
            // -- 游戏准备开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                break;
            //  --游戏正式开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME:
                break;
        }
    }




    static OnAllPlayerClientLoginFinish() {
        LogHelper.print("OnAllPlayerClientLoginFinish")
        while (this._WaitSyncEntity.length > 0) {
            let entity = this._WaitSyncEntity.shift();
            if (entity == null) {
                break;
            }
            NetTablesHelper.SetETEntity(entity.obj, entity.ignoreChild);
        }
        this._WaitSyncEntity.length = 0;
    }



    static OnNPCSpawned(event: NpcSpawnedEvent) {
        let spawnedUnit = EntIndexToHScript(event.entindex) as IBaseNpc_Plus;
        if (spawnedUnit == null) return;
        let sUnitName = spawnedUnit.GetUnitName();
        if (sUnitName == GameEnum.Unit.UnitNames.npc_dota_thinker) {
            return;
        }
        if (EntityHelper.checkIsFirstSpawn(spawnedUnit)) {
            if (!spawnedUnit.HasAbility(ability_propertytool.name)) {
                spawnedUnit.AddAbility(ability_propertytool.name);
            }
            modifier_property.applyOnly(spawnedUnit, spawnedUnit);
            // spawnedUnit.SetPhysicalArmorBaseValue(0);
            // spawnedUnit.SetBaseMagicalResistanceValue(0);
            // spawnedUnit.SetBaseDamageMax(0);
            // spawnedUnit.SetBaseDamageMin(0);
            // spawnedUnit.SetBaseHealthRegen(0);
            // spawnedUnit.SetMaximumGoldBounty(0);
            // spawnedUnit.SetMinimumGoldBounty(0);
            // spawnedUnit.SetDeathXP(0);
            if (spawnedUnit.InitActivityModifier) {
                spawnedUnit.InitActivityModifier();
            }
            if (spawnedUnit.onSpawned) {
                spawnedUnit.onSpawned(event);
            }
            spawnedUnit.runSpawnedHandler();
        }
    }
    static OnEntityKilled(events: EntityKilledEvent) {
        let hUnit = EntIndexToHScript(events.entindex_killed) as IBaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot) {
            return;
        }
        let root = hUnit.ETRoot as IBattleUnitEntityRoot;
        if (root.onKilled) {
            root.onKilled(events);
        }
    }

    static OnEntityHurt(events: EntityHurtEvent) {

    }
    static onJS_TO_LUA_EVENT(entindex: EntityIndex, event: JS_TO_LUA_DATA) {
        if (event.protocol == null) {
            return;
        }
        event.sendClientCB = () => {
            event.sendClientCB = null;
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
        }
        let allCB = GGameCache.allCustomProtocolEvent[event.protocol] || [];
        for (let i = 0, len = allCB.length; i < len; i++) {
            let cbinfo = allCB[i];
            if (cbinfo == null) {
                break;
            }
            if (event == null) {
                cbinfo.run();
            }
            else {
                cbinfo.runWith([event]);
            }
            if (cbinfo.once) {
                allCB.splice(i, 1);
                i--;
                len--;
            }
            if (!event.isawait && event.sendClientCB) {
                event.sendClientCB();
            }
        }
    }


}
declare global {
    /**
     * @ServerOnly
     */
    var GGameScene: typeof GameScene;
}
if (_G.GGameScene == undefined) {
    _G.GGameScene = GameScene;
}