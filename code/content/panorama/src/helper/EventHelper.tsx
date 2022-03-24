import { GameEnum } from "../libs/GameEnum";
import { DotaUIHelper } from "./DotaUIHelper";
import { LogHelper } from "./LogHelper";
import { NetHelper } from "./NetHelper";
import { TimerHelper } from "./TimerHelper";
import { TipsHelper } from "./TipsHelper";

export module EventHelper {

    export function Init() {
        addEvent();
    }

    function addEvent() {

        GameEvents.Subscribe(GameEnum.GameEvent.game_rules_state_change, (e) => {
            // TimerHelper.addTimer(1, () => {
            //     LogHelper.print(e, $.GetContextPanel().id)
            // })
        });


        /**物品位置变动 */
        GameEvents.Subscribe(GameEnum.GameEvent.dota_inventory_changed, (e) => {
            LogHelper.print(e);
            // 通知服务器
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_SLOT_CHANGE, e);
        });
        /**监听错误信息 */
        NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_error_message, (event) => {
            if (event.data != null) {

                switch (event.data) {

                }
            }
        }, EventHelper)

    }

}