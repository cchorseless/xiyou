/**
 * 解决循环引用折中方案，出现循环应用，这里添加引用后，再引用该模块。
 * 弃用，采用缓存类的形式
 */

import { GetRegClass, globalData } from "./GameCache";
import { GameEnum } from "./shared/GameEnum";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { LogHelper } from "./helper/LogHelper";
import { NetTablesHelper } from "./helper/NetTablesHelper";
import { BaseItem_Plus } from "./npc/entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { ability_propertytool } from "./npc/propertystat/ability_propertytool";
import { Enum_MODIFIER_EVENT, EventDataType, IBuffEventData, modifier_event } from "./npc/propertystat/modifier_event";
import { modifier_property } from "./npc/propertystat/modifier_property";
import { BuildingEntityRoot } from "./rules/Components/Building/BuildingEntityRoot";
import { CourierEntityRoot } from "./rules/Components/Courier/CourierEntityRoot";
import { EnemyUnitEntityRoot } from "./rules/Components/Enemy/EnemyUnitEntityRoot";
import { ItemEntityRoot } from "./rules/Components/Item/ItemEntityRoot";
import { BattleUnitEntityRoot } from "./rules/Components/BattleUnit/BattleUnitEntityRoot";
import { RoundPrizeUnitEntityRoot } from "./rules/Components/Round/RoundPrizeUnitEntityRoot";
import { ET } from "./rules/Entity/Entity";
import { BuildingSystemComponent } from "./rules/System/Building/BuildingSystemComponent";
import { ChessControlSystemComponent } from "./rules/System/ChessControl/ChessControlSystemComponent";
import { CombinationSystemComponent } from "./rules/System/Combination/CombinationSystem";
import { DrawSystemComponent } from "./rules/System/Draw/DrawSystemComponent";
import { EnemySystemComponent } from "./rules/System/Enemy/EnemySystemComponent";
import { GameStateSystemComponent } from "./rules/System/GameState/GameStateSystemComponent";
import { MapSystemComponent } from "./rules/System/Map/MapSystemComponent";
import { PlayerSystemComponent } from "./rules/System/Player/PlayerSystemComponent";
import { PublicBagSystemComponent } from "./rules/System/Public/PublicBagSystemComponent";
import { RoundSystemComponent } from "./rules/System/Round/RoundSystemComponent";
import { WearableSystemComponent } from "./rules/System/Wearable/WearableSystemComponent";
import { GameRequest } from "./service/GameRequest";
import { TServerZone } from "./service/serverzone/TServerZone";

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

export class GameEntityRoot extends ET.EntityRoot {

    private _WaitSyncEntity: { obj: ET.Entity, ignoreChild: boolean }[] = [];
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        if (this.PlayerSystem().IsAllLogin) {
            NetTablesHelper.SetShareETEntity(obj, ignoreChild);
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

    init() {
        this.addEvent();
        this.AddComponent(GetRegClass<typeof GameStateSystemComponent>("GameStateSystemComponent"));
        this.AddComponent(GetRegClass<typeof PlayerSystemComponent>("PlayerSystemComponent"));
        this.AddComponent(GetRegClass<typeof MapSystemComponent>("MapSystemComponent"));
        this.AddComponent(GetRegClass<typeof DrawSystemComponent>("DrawSystemComponent"));
        this.AddComponent(GetRegClass<typeof ChessControlSystemComponent>("ChessControlSystemComponent"));
        this.AddComponent(GetRegClass<typeof RoundSystemComponent>("RoundSystemComponent"));
        this.AddComponent(GetRegClass<typeof EnemySystemComponent>("EnemySystemComponent"));
        this.AddComponent(GetRegClass<typeof BuildingSystemComponent>("BuildingSystemComponent"));
        this.AddComponent(GetRegClass<typeof CombinationSystemComponent>("CombinationSystemComponent"));
        this.AddComponent(GetRegClass<typeof WearableSystemComponent>("WearableSystemComponent"));
        this.AddComponent(GetRegClass<typeof PublicBagSystemComponent>("PublicBagSystemComponent"));
    }

    public StartGame() {
        this.RoundSystem().StartGame();
        this.DrawSystem().StartGame();
    }

    TServerZone() {
        return this.GetComponentByName<TServerZone>("TServerZone");
    }
    GameStateSystem() {
        return this.GetComponentByName<GameStateSystemComponent>("GameStateSystemComponent");
    }
    PlayerSystem() {
        return this.GetComponentByName<PlayerSystemComponent>("PlayerSystemComponent");
    }
    MapSystem() {
        return this.GetComponentByName<MapSystemComponent>("MapSystemComponent");
    }
    RoundSystem() {
        return this.GetComponentByName<RoundSystemComponent>("RoundSystemComponent");
    }

    DrawSystem() {
        return this.GetComponentByName<DrawSystemComponent>("DrawSystemComponent");
    }

    CombinationSystem() {
        return this.GetComponentByName<CombinationSystemComponent>("CombinationSystemComponent");
    }
    BuildingSystem() {
        return this.GetComponentByName<BuildingSystemComponent>("BuildingSystemComponent");
    }
    ChessControlSystem() {
        return this.GetComponentByName<ChessControlSystemComponent>("ChessControlSystemComponent");
    }
    EnemySystem() {
        return this.GetComponentByName<EnemySystemComponent>("EnemySystemComponent");
    }

    WearableSystem() {
        return this.GetComponentByName<WearableSystemComponent>("WearableSystemComponent");
    }

    PublicBagSystem() {
        return this.GetComponentByName<PublicBagSystemComponent>("PublicBagSystemComponent");
    }


    private addEvent() {
        EventHelper.addGameEvent(this, GameEnum.GameEvent.game_rules_state_change, this.onGameRulesStateChange);
        // EventHelper.addGameEvent(this, GameEnum.GameEvent.DotaOnHeroFinishSpawnEvent, this.onHeroFinishSpawn);
        EventHelper.addGameEvent(this, GameEnum.GameEvent.NpcSpawnedEvent, this.OnNPCSpawned);
        EventHelper.addGameEvent(this, GameEnum.GameEvent.EntityKilledEvent, this.OnEntityKilled);
        EventHelper.addGameEvent(this, GameEnum.GameEvent.EntityHurtEvent, this.OnEntityHurt);
        /**JS 请求LUA 事件 */
        EventHelper.addCustomEvent(this, "JS_TO_LUA_EVENT", this.onJS_TO_LUA_EVENT);
        this.addItemEvent();
    }

    /**监听游戏item事件 */
    private addItemEvent() {
        // 道具获取事件
        EventHelper.addGameEvent(this, GameEnum.GameEvent.DotaInventoryItemAddedEvent, (event) => {
            // 17 表示 无效
            if (event.item_slot < DOTAScriptInventorySlot_t.DOTA_ITEM_TRANSIENT_ITEM) {
                (event as IBuffEventData).eventType = EventDataType.unitIsSelf + EventDataType.OtherCanBeAnyOne;
                let unit = EntIndexToHScript(event.inventory_parent_entindex) as BaseNpc_Plus;
                (event as IBuffEventData).unit = unit;
                // 设置道具第一个拥有者
                let item = EntIndexToHScript(event.item_entindex) as BaseItem_Plus;
                modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_GET);
                if (item.ETRoot && unit.ETRoot) {
                    let itemroot = item.ETRoot.As<ItemEntityRoot>();
                    let npcroot = unit.ETRoot.As<BattleUnitEntityRoot>()
                    if (npcroot.InventoryComp()) {
                        npcroot.InventoryComp().addItemRoot(itemroot);
                    }
                }
            }
        });
        // 道具缺失事件
        EventHelper.addGameEvent(this, GameEnum.GameEvent.DotaHeroInventoryItemChangeEvent, (event: DotaHeroInventoryItemChangeEvent) => {
            let item = EntIndexToHScript(event.item_entindex) as BaseItem_Plus;
            let state = item.GetItemState();
            let slot = item.GetItemSlot();
            (event as IBuffEventData).eventType = EventDataType.unitIsSelf + EventDataType.OtherCanBeAnyOne;
            let unit = EntIndexToHScript(event.hero_entindex) as BaseNpc_Plus;
            (event as IBuffEventData).unit = unit;
            // 道具不在身上
            if (state == 0 && slot == -1) {
                modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_LOSE);
            }
            // 道具销毁|出售
            else if (state == 1 && slot == DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1) {
                modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_DESTROY);
                if (item.ETRoot) {
                    let itemroot = item.ETRoot.As<ItemEntityRoot>();
                    itemroot.Dispose();
                }
            }
        });
        // 道具位置改变
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_ITEM_SLOT_CHANGE, (event: JS_TO_LUA_DATA) => {
            let playerid = event.PlayerID;
            let hero = this.PlayerSystem().GetPlayer(playerid).Hero!;
            if (hero != null) {
                // 检查位置是否改变
                let changeData = hero.ETRoot.As<CourierEntityRoot>().CourierDataComp().CheckItemSlotChange();
                if (changeData) {
                    let _event: IBuffEventData = {};
                    (_event as IBuffEventData).eventType = EventDataType.unitIsSelf + EventDataType.OtherCanBeAnyOne;
                    (_event as IBuffEventData).unit = hero as BaseNpc_Plus;
                    (_event as IBuffEventData).changeSlot = changeData[0];
                    (_event as IBuffEventData).state = changeData[1];
                    modifier_event.FireEvent(_event, Enum_MODIFIER_EVENT.ON_ITEM_SLOT_CHANGE);
                }
            }
        });
        // 道具给人
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_ITEM_GIVE_NPC, (event: JS_TO_LUA_DATA) => {
            let playerid = event.PlayerID;
            let itemslot = event.data.slot;
            let npcentindex = event.data.npc;
            let itementityid = event.data.itementityid;
            let hero = this.PlayerSystem().GetPlayer(playerid).Hero!;
            if (hero == null || itemslot == null || npcentindex == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid args", playerid);
                return;
            }
            let itemEnity = EntIndexToHScript(itementityid) as BaseItem_Plus;
            let npc = EntIndexToHScript(npcentindex) as BaseNpc_Plus;
            if (!GameFunc.IsValid(itemEnity) || !GameFunc.IsValid(npc) || itemEnity.ETRoot == null || npc.ETRoot == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid item or npc", playerid);
                return;
            }
            let itemroot = itemEnity.ETRoot.As<ItemEntityRoot>();
            let npcroot = npc.ETRoot.As<BattleUnitEntityRoot>()
            if (!itemroot.canGiveToNpc(npcroot)) {
                event.state = false;
                EventHelper.ErrorMessage("cant give to npc", playerid);
                return;
            }
            npcroot.InventoryComp().addItemRoot(itemroot);
            event.state = true;
        });
        // 道具仍在地上
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_ITEM_DROP_POSITION, (event: JS_TO_LUA_DATA) => {
            let playerid = event.PlayerID;
            let itemslot = event.data.slot;
            let itementityid = event.data.itementityid;
            let pos = event.data.pos;
            let hero = this.PlayerSystem().GetPlayer(playerid).Hero!;
            if (hero == null || itemslot == null || pos == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid args", playerid);
                return;
            }
            let itemEnity = EntIndexToHScript(itementityid) as BaseItem_Plus;
            if (!GameFunc.IsValid(itemEnity) || itemEnity.ETRoot == null) {
                event.state = false;
                EventHelper.ErrorMessage("not valid item ", playerid);
                return;
            }
            let itemroot = itemEnity.ETRoot.As<ItemEntityRoot>();
            if (itemroot.DomainParent == null) {
                event.state = false;
                EventHelper.ErrorMessage(" item DomainParent is null", playerid);
                return;
            }
            let posV = Vector(pos.x, pos.y, pos.z);
            itemroot.DomainParent.As<BattleUnitEntityRoot>().InventoryComp().dropItemRoot(itemroot, posV);
            event.state = true;
        });
    }
    private async onGameRulesStateChange(e: any) {
        const nNewState = GameRules.State_Get();
        LogHelper.print("OnGameRulesStateChange", nNewState);
        switch (nNewState) {
            case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
                this.PlayerSystem().UploadGameRecord(GameEnum.EGameRecordKey.GameTime.GAMERULES_STATE_INIT, GetSystemTimeMS() / 1000);
                break;
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
                this.PlayerSystem().UploadGameRecord(GameEnum.EGameRecordKey.GameTime.GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD, GetSystemTimeMS() / 1000);
                break;
            // -- 游戏初始化
            case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                this.PlayerSystem().UploadGameRecord(GameEnum.EGameRecordKey.GameTime.GAMERULES_STATE_CUSTOM_GAME_SETUP, GetSystemTimeMS() / 1000);
                await this.PlayerSystem().StartGame();
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
                this.MapSystem().StartGame();
                break;
            // -- 游戏准备开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                break;
            //  --游戏正式开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME:
                break;
        }
    }




    public OnAllPlayerClientLoginFinish() {
        while (this._WaitSyncEntity.length > 0) {
            let entity = this._WaitSyncEntity.shift();
            if (entity == null) {
                break;
            }
            NetTablesHelper.SetShareETEntity(entity.obj, entity.ignoreChild);
        }
        this._WaitSyncEntity.length = 0;
    }



    private OnNPCSpawned(event: NpcSpawnedEvent) {
        let spawnedUnit = EntIndexToHScript(event.entindex) as BaseNpc_Plus;
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
    private OnEntityKilled(events: EntityKilledEvent) {
        let hUnit = EntIndexToHScript(events.entindex_killed) as BaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot) {
            return;
        }
        let root = hUnit.ETRoot as BattleUnitEntityRoot;
        if (root.onKilled) {
            root.onKilled(events);
        }
    }

    private OnEntityHurt(events: EntityHurtEvent) {

    }
    private onJS_TO_LUA_EVENT(entindex: EntityIndex, event: JS_TO_LUA_DATA) {
        if (event.protocol == null) {
            return;
        }
        event.sendClientCB = () => {
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
                if (!event.isawait && event.sendClientCB) {
                    event.sendClientCB();
                }
            });
        }
    }

}
