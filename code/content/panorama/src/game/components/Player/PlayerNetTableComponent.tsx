import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { GameServiceConfig } from "../../../../../scripts/tscripts/shared/GameServiceConfig";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TipsHelper } from "../../../helper/TipsHelper";

/**玩家 */
@GReloadable
export class PlayerNetTableComponent extends ET.Component {
    onAwake() {
        this.addEvent();
    }

    LoadNetTableData() {
        let nettable = NetHelper.GetETEntityNetTableName(Players.GetLocalPlayer());
        let data_player = NetHelper.GetOneTable(nettable) as { key: string, value: IEntityJson }[];
        let allLoadData: { [key: string]: IEntityJson } = {}
        for (let info of data_player) {
            if (info.value) {
                allLoadData[info.key] = GameServiceConfig.NetTableSaveDataAsSring ? JSON.parse(info.value as any) : info.value;
            }
        }
        let data_common = NetHelper.GetOneTable(GameServiceConfig.ENetTables.etentity);
        for (let info of data_common) {
            if (info.value) {
                allLoadData[info.key] = GameServiceConfig.NetTableSaveDataAsSring ? JSON.parse(info.value as any) : info.value;
            }
        }
        for (let key in allLoadData) {
            let json = allLoadData[key];
            if (json) {
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

    private UpdateSyncEntity(tableName: string, key: string, value: any) {
        value = GameServiceConfig.NetTableSaveDataAsSring ? JSON.parse(value as any) : value;
        if (value != null && value._t && value._id) {
            try {
                ET.Entity.FromJson(value);
            } catch (e) {
                LogHelper.error("" + e);
            }
        }
        else {
            ET.EntitySystem.GetEntity(key)?.Dispose();
        }
    }

    addEvent() {
        let nettable = NetHelper.GetETEntityNetTableName(Players.GetLocalPlayer())! as never;
        CustomNetTables.SubscribeNetTableListener(nettable, (tableName, key, value) => {
            this.UpdateSyncEntity(tableName, key as string, value)
        });
        let netcommon = GameServiceConfig.ENetTables.etentity as never;
        CustomNetTables.SubscribeNetTableListener(netcommon, (tableName, key, value) => {
            this.UpdateSyncEntity(tableName, key as string, value)
        });
        /**监听错误信息 */
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_error_message, GHandler.create(this, (event) => {
            if (event.data != null) {
                TipsHelper.showErrorMessage(event.data);
            }
        }));
    }




}
