import { GameEnum } from "../libs/GameEnum";
import { LogHelper } from "./LogHelper";

export module NetHelper {
    const allListenEventInfo = {};

    /**请求LUA服务器数据 */
    export function SendToLua(protocol: string, data: any = null, cb: (event: JS_TO_LUA_DATA) => void | null = null as any, context: any = null) {
        if (cb != null) {
            let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                LogHelper.print(event.protocol);
                cb.call(context, event);
                GameEvents.Unsubscribe(eventID);
            });
        }
        GameEvents.SendCustomGameEventToServer("JS_TO_LUA_EVENT", {
            protocol: protocol,
            data: data,
            hasCB: Boolean(cb),
        });
    }

    export async function SendToLuaAsync<T>(protocol: string, data: T) {
        return new Promise<JS_TO_LUA_DATA>((resolve, reject) => {
            let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                LogHelper.print(event.protocol);
                GameEvents.Unsubscribe(eventID);
                resolve(event);
            });
            LogHelper.print(protocol, data);
            GameEvents.SendCustomGameEventToServer("JS_TO_LUA_EVENT", {
                protocol: protocol,
                data: data,
                hasCB: true,
            });
        });
    }

    /**
     * 监听服务器事件
     * @param protocol
     * @param cb
     * @param context
     * @param isOnce 是否只监听一次
     */
    export function ListenOnLua(protocol: string, cb: (event: JS_TO_LUA_DATA) => void, context: any = null, isOnce: boolean = false) {
        if (cb != null) {
            if (!isOnce) {
                GameEvents.Subscribe(protocol, (event) => {
                    LogHelper.print(protocol);
                    cb.call(context, event);
                });
            } else {
                let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                    LogHelper.print(protocol);
                    cb.call(context, event);
                    GameEvents.Unsubscribe(eventID);
                });
            }
        }
    }

    export function OffListenOnLua() {}

    export function GetTableValue(tableName: string, key?: string) {
        if (key == null) {
            return CustomNetTables.GetAllTableValues(tableName as never) as any;
        } else {
            return CustomNetTables.GetTableValue(tableName as never, key) as any;
        }
    }
}
