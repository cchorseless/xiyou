import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { GameServiceConfig } from "../../../../scripts/tscripts/shared/GameServiceConfig";
import { NotificationConfig } from "../../../../scripts/tscripts/shared/NotificationConfig";
import { ET, ETEntitySystem } from "../../../../scripts/tscripts/shared/lib/Entity";
import { EventHelper } from "../../helper/EventHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";

@GReloadable
export class NotificationSystemComponent extends ET.SingletonComponent {
    onAwake() {
        this.addEvent();
    }

    NetTableListenerList: NetTableListenerID[] = [];

    addEvent() {
        /**物品位置变动 */
        EventHelper.addGameEvent(GameEnum.GameEvent.dota_inventory_changed, GHandler.create(this, (e) => {
            // 通知服务器
            let entityindex = Players.GetLocalPlayerPortraitUnit();
            NetHelper.SendToLua(GameProtocol.Protocol.req_ITEM_SLOT_CHANGE, entityindex);
        }));
        /**监听错误信息 */
        NetHelper.ListenOnLua(NotificationConfig.EProtocol.push_error_message,
            GHandler.create(this, (event) => {
                if (event.data != null) {
                    TipsHelper.showErrorMessage(event.data);
                }
            }));

        // 网络同步实体
        let nettable = NetHelper.GetETEntityNetTableName(Players.GetLocalPlayer())! as never;
        this.NetTableListenerList.push(
            CustomNetTables.SubscribeNetTableListener(nettable, (tableName, key, value) => {
                this.UpdateSyncEntity(tableName, key as string, value)
            }));
        let netcommon = GameServiceConfig.ENetTables.etentity as never;
        this.NetTableListenerList.push(
            CustomNetTables.SubscribeNetTableListener(netcommon, (tableName, key, value) => {
                this.UpdateSyncEntity(tableName, key as string, value)
            }));

    }

    onDestroy(): void {
        EventHelper.removeGameEventCaller(this);
        this.NetTableListenerList.forEach((event) => {
            CustomNetTables.UnsubscribeNetTableListener(event);
        })
    }

    LoadNetTableData() {
        let nettable = NetHelper.GetETEntityNetTableName(Players.GetLocalPlayer());
        let data_player = NetHelper.GetOneTable(nettable) as { key: string, value: IEntityJson }[];
        let allLoadData: { [key: string]: IEntityJson } = {}
        for (let info of data_player) {
            if (info.value && info.value._ != "") {
                allLoadData[info.key] = GameServiceConfig.NetTableSaveDataAsSring ? JSON.parse(info.value._ as any) : info.value;
            }
        }
        let data_common = NetHelper.GetOneTable(GameServiceConfig.ENetTables.etentity);
        for (let info of data_common) {
            if (info.value && info.value._ != "") {
                allLoadData[info.key] = GameServiceConfig.NetTableSaveDataAsSring ? JSON.parse(info.value._ as any) : info.value;
            }
        }
        for (let key in allLoadData) {
            let json = allLoadData[key];
            if (json) {
                if (GGameScene.IsHeroSelect) {
                    if (!GameServiceConfig.HERO_SELECT_SYNC_ENTITY.includes(json._t)) {
                        continue
                    }
                }
                let loadList = [key];
                let _p_instanceid = json._p_instanceid;
                while (_p_instanceid && allLoadData[_p_instanceid]) {
                    if (loadList.includes(_p_instanceid)) {
                        break;
                    }
                    else {
                        loadList.push(_p_instanceid);
                        _p_instanceid = allLoadData[_p_instanceid]._p_instanceid;
                    }
                }
                while (loadList.length > 0) {
                    let loadkey = loadList.pop()!;
                    ET.Entity.FromJson(allLoadData[loadkey]);
                    (allLoadData[loadkey] as any) = null;
                }
            }
        }
    }

    UpdateSyncEntity(tableName: string, key: string, value: any) {
        if (value != null) {
            if (value._ == "") {
                value = null;
            }
            else {
                value = GameServiceConfig.NetTableSaveDataAsSring ? JSON.parse(value._ as any) : value;
            }
        }
        // 英雄选择阶段只同步部分实体
        if (GGameScene.IsHeroSelect) {
            if (value == null || !GameServiceConfig.HERO_SELECT_SYNC_ENTITY.includes(value._t)) {
                return
            }
        }
        if (value != null && value._t && value._id) {
            try {
                ET.Entity.FromJson(value);
            } catch (e) {
                LogHelper.error("" + e);
            }
        }
        else {
            ETEntitySystem.GetEntity(key)?.Dispose();
        }
    }
}
