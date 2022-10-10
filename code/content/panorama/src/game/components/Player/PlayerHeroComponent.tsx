import React from "react";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { ET, registerET } from "../../../libs/Entity";
import { GameEnum } from "../../../libs/GameEnum";
import { MainPanel } from "../../../view/MainPanel/MainPanel";
import { PlayerConfig } from "../../system/Player/PlayerConfig";

/**玩家 */
@registerET()
export class PlayerHeroComponent extends ET.Component {
    onAwake() {
        this.addEvent();
    }

    LoadNetTableData() {
        // try {
            let nettable = NetHelper.GetETEntityNetTableName(Players.GetLocalPlayer());
            let data_player = NetHelper.GetOneTable(nettable);
            for (let info of data_player) {
                if (info.value) {
                    info.value._nettable = nettable;
                    ET.Entity.FromJson(info.value);
                }
        }
            let data_common = NetHelper.GetOneTable(NetHelper.ENetTables.etentity);
            for (let info of data_common) {
                if (info.value) {
                    info.value._nettable = NetHelper.ENetTables.etentity;
                    ET.Entity.FromJson(info.value);
                }
            }
        // }
        // catch (e) {
        //     LogHelper.error(e);
        // }
    }

    addEvent() {
        NetHelper.ListenOnLua(this, GameEnum.CustomProtocol.push_sync_et_entity, (event) => {
            ET.Entity.FromJson(event.data);
        });
        NetHelper.ListenOnLua(this, GameEnum.CustomProtocol.push_update_nettable_etentity, (event) => {
            let instanceid = event.data.instanceId;
            let nettable = event.data.nettable;
            let data = NetHelper.GetTableValue(nettable, instanceid);
            try {
                if (data) {
                    ET.Entity.FromJson(data);
                } else {
                    ET.EntityEventSystem.GetEntity(instanceid)?.Dispose();
                }
            } catch (e) {
                LogHelper.error("" + e);
            }
        });
        NetHelper.ListenOnLua(this, GameEnum.CustomProtocol.push_del_nettable_etentity, (event) => {
            let instanceid = event.data.instanceId;
            ET.EntityEventSystem.GetEntity(instanceid)?.Dispose();
        });
        NetHelper.ListenOnLua(this, GameEnum.CustomProtocol.push_update_nettable_partprop_etentity, (event) => {
            let instanceid = event.data.instanceId;
            let nettable = event.data.nettable;
            let props = event.data.props;
            let data = NetHelper.GetTableValue(nettable, instanceid);
            if (data) {
                let json = {} as any;
                for (let k of props) {
                    json[k] = data[k];
                }
                ET.EntityEventSystem.GetEntity(instanceid)?.updateFromJson(json);
            }
        });
        /**监听错误信息 */
        NetHelper.ListenOnLua(this, GameEnum.CustomProtocol.push_error_message, (event) => {
            if (event.data != null) {
                TipsHelper.showErrorMessage(event.data);
            }
        });
    }
}
