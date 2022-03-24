import { GameEnum } from "../libs/GameEnum";
import { LogHelper } from "./LogHelper";

export module NetHelper {

    const allListenEventInfo = {};

    /**请求LUA服务器数据 */
    export function SendToLua(protocol: GameEnum.CustomProtocol, data: any = null, cb: (event: JS_TO_LUA_DATA) => void | null = (null as any), context: any = null) {
        if (cb != null) {
            let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                LogHelper.print(event.protocol)
                cb.call(context, event);
                GameEvents.Unsubscribe(eventID);
            })
        }
        GameEvents.SendCustomGameEventToServer('JS_TO_LUA_EVENT', {
            protocol: protocol,
            data: data,
            hasCB: Boolean(cb),
        })
    }

    /**
     * 监听服务器事件
     * @param protocol
     * @param cb
     * @param context
     * @param isOnce 是否只监听一次
     */
    export function ListenOnLua(protocol: GameEnum.CustomProtocol, cb: (event: JS_TO_LUA_DATA) => void, context: any = null, isOnce: boolean = false) {
        if (cb != null) {
            if (!isOnce) {
                GameEvents.Subscribe(protocol, (event) => {
                    LogHelper.print(protocol)
                    cb.call(context, event);
                })
            }
            else {
                let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                    LogHelper.print(protocol)
                    cb.call(context, event);
                    GameEvents.Unsubscribe(eventID);
                })
            }
        }
    }



    export function OffListenOnLua() {

    }
}