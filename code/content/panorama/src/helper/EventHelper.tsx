import { GameEnum } from "../libs/GameEnum";
import { DotaUIHelper } from "./DotaUIHelper";
import { FuncHelper } from "./FuncHelper";
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
            $.Msg("Game Enter State", Game.GetState());
        });

        /**物品位置变动 */
        GameEvents.Subscribe(GameEnum.GameEvent.dota_inventory_changed, (e) => {
            LogHelper.print(e);
            // 通知服务器
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_SLOT_CHANGE, e);
        });
        /**监听错误信息 */
        NetHelper.ListenOnLua(
            GameEnum.CustomProtocol.push_error_message,
            (event) => {
                if (event.data != null) {
                    switch (event.data) {
                    }
                }
            },
            EventHelper
        );
    }

    const AllEventInfo: { [eventName: string]: [{ isonce: boolean; handler: FuncHelper.Handler }] } = {};

    export function AddClientEvent(eventName: string, handler: FuncHelper.Handler, isOnce = false) {
        if (AllEventInfo[eventName] == null) {
            AllEventInfo[eventName] = [] as any;
        }
        if (!isOnce) {
            handler.once = false;
        }
        AllEventInfo[eventName].push({ isonce: isOnce, handler: handler });
    }

    export function FireClientEvent(eventName: string, context: any, ...args: any[]) {
        if (AllEventInfo[eventName] == null) {
            return;
        }
        for (let i = 0, len = AllEventInfo[eventName].length; i < len; i++) {
            let info = AllEventInfo[eventName][i];

            if (info && info.handler && info.handler._id > 0) {
                let bindthis = true;
                if (context) {
                    bindthis = context == info.handler.caller;
                }
                if (bindthis) {
                    if (args.length > 0) {
                        info.handler.runWith(args);
                    } else {
                        info.handler.run();
                    }
                    if (info.isonce) {
                        AllEventInfo[eventName].splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }

    export function RemoveClientEvent(eventName: string, context: any) {
        if (AllEventInfo[eventName] == null) {
            return;
        }
        for (let i = 0, len = AllEventInfo[eventName].length; i < len; i++) {
            let info = AllEventInfo[eventName][i];
            if (info && info.handler && info.handler._id > 0) {
                let bindthis = true;
                if (context) {
                    bindthis = context == info.handler.caller;
                }
                if (bindthis) {
                    AllEventInfo[eventName].splice(i, 1);
                    info.handler.recover();
                    i--;
                }
            }
        }
    }
}
