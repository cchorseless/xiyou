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
export class PlayerComponent extends ET.Component {
    onAwake() {
        this.addEvent();
    }

    playerId: PlayerID;
    NoticeServerReady() {
        let playerInfo = Game.GetLocalPlayerInfo();
        if (playerInfo == null || playerInfo.player_selected_hero_entity_index <= 0) {
            /**玩家英雄创建绑定 */
            let eventid2 = GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_assigned_hero, (event: DotaPlayerUpdateAssignedHeroEvent) => {
                let playerInfo = Game.GetLocalPlayerInfo();
                if (playerInfo) {
                    if (playerInfo.player_id == event.playerid) {
                        this.playerId = playerInfo.player_id;
                        NetHelper.SendToLua(GameEnum.CustomProtocol.req_LoginGame, null, (e) => {
                            LogHelper.print(e);
                        });
                        GameEvents.Unsubscribe(eventid2);
                    }
                }
            });
        } else {
            this.LoadNetTableData();
        }
    }

    LoadNetTableData() {
        let data = NetHelper.GetOneTable(NetHelper.ENetTables.etentity);
        if (data) {
            for (let info of data) {
                ET.Entity.FromJson(info.value);
            }
        }
    }

    addEvent() {
        this.NoticeServerReady();
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_sync_et_entity, (event) => {
            ET.Entity.FromJson(event.data);
        });
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_update_nettable_etentity, (event) => {
            let instanceid = event.data;
            let data = NetHelper.GetTableValue(NetHelper.ENetTables.etentity, instanceid);
            if (data) {
                ET.Entity.FromJson(data);
            } else {
                ET.EntityEventSystem.GetEntity(instanceid)?.Dispose();
            }
        });
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_del_nettable_etentity, (event) => {
            let instanceid = event.data;
            ET.EntityEventSystem.GetEntity(instanceid)?.Dispose();
        });
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_update_nettable_partprop_etentity, (event) => {
            let instanceid = event.data.instanceId;
            let props = event.data.props;
            let data = NetHelper.GetTableValue(NetHelper.ENetTables.etentity, instanceid);
            if (data) {
                let json = {} as any;
                for (let k of props) {
                    json[k] = data[k];
                }
                ET.EntityEventSystem.GetEntity(instanceid)?.updateFromJson(json);
            }
        });
        /**监听错误信息 */
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_error_message, (event) => {
            if (event.data != null) {
                TipsHelper.showErrorMessage(event.data);
            }
        });
    }
}
