import React from "react";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { GameEnum } from "../../../libs/GameEnum";
import { MainPanel } from "../../../view/MainPanel/MainPanel";

/**玩家 */
@registerET()
export class PlayerComponent extends ET.Component {
    onAwake() {
        this.addEvent();
    }

    NoticeServerReady() {
        let playerInfo = Game.GetLocalPlayerInfo();
        if (playerInfo == null || playerInfo.player_selected_hero_entity_index <= 0) {
            /**玩家英雄创建绑定 */
            let eventid2 = GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_assigned_hero, (event: DotaPlayerUpdateAssignedHeroEvent) => {
                LogHelper.print(event);
                let playerInfo = Game.GetLocalPlayerInfo();
                LogHelper.print(playerInfo);
                if (playerInfo) {
                    if (playerInfo.player_id == event.playerid) {
                        NetHelper.SendToLua(GameEnum.CustomProtocol.req_LoginGame, null, (e) => {
                            LogHelper.print(e);
                        });
                        GameEvents.Unsubscribe(eventid2);
                    }
                }
            });
        }
    }

    addEvent() {
        this.NoticeServerReady();
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_sync_et_entity, (event) => {
            let entity = ET.Entity.FromJson(event.data);
            
        });
    }
}
