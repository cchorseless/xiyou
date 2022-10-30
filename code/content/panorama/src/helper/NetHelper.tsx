import { ET } from "../libs/Entity";
import { GameEnum } from "../libs/GameEnum";
import { LogHelper } from "./LogHelper";

export module NetHelper {
    export interface INetListener {
        ListenEventInfo: { [key: string]: GameEventListenerID[] };
    }

    /**请求LUA服务器数据 */
    export function SendToLua(protocol: string, data: any = null, cb: (event: JS_TO_LUA_DATA) => void | null = null as any, context: any = null) {
        if (cb != null) {
            let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                // LogHelper.print(event.protocol);
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
                // LogHelper.print(event.protocol);
                GameEvents.Unsubscribe(eventID);
                resolve(event);
            });
            // LogHelper.print(protocol, data);
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
    export function ListenOnLua(context: any, protocol: string, cb: (event: JS_TO_LUA_DATA) => void, isOnce: boolean = false) {
        if (cb != null) {
            if (!isOnce) {
                GameEvents.Subscribe(protocol, (event) => {
                    // LogHelper.print(protocol);
                    cb.call(context, event);
                });
            } else {
                let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                    // LogHelper.print(protocol);
                    cb.call(context, event);
                    GameEvents.Unsubscribe(eventID);
                });
            }
        }
    }
    export function OffAllListenOnLua(context: any) { }

    export function OffListenOnLua(context: any, protocol: string) { }

    export function GetTableValue(tableName: ENetTables, key: string) {
        let obj = CustomNetTables.GetTableValue(tableName as never, key) as any;
        if (obj) {
            obj._nettable = tableName;
        }
        return obj;
    }

    export function GetOneTable(tableName: ENetTables) {
        return CustomNetTables.GetAllTableValues(tableName as never) as { key: string; value: any }[];
    }

    export function IsFromLocalNetTable(entity: ET.Entity) {
        if (entity.NetTableName == GetETEntityNetTableName()) {
            return true;
        }
        if (entity.NetTableName == GetETEntityNetTableName(Players.GetLocalPlayer())) {
            return true;
        }
        return false;
    }

    export function GetETEntityNetTableName(playerid: PlayerID | null = null) {
        if (playerid == null) {
            return ENetTables.etentity;
        }
        switch (playerid) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return ENetTables.etentity + playerid as any;
        }
        LogHelper.error("miss playerId =>", playerid);
    }

    export function GetPlayerIdByNetTableName(nettablename: string): PlayerID {
        if (nettablename == null) {
            return -1;
        }
        switch (nettablename) {
            case ENetTables.etentity:
                return Players.GetLocalPlayer();
            case ENetTables.etentity0:
            case ENetTables.etentity1:
            case ENetTables.etentity2:
            case ENetTables.etentity3:
            case ENetTables.etentity4:
            case ENetTables.etentity5:
                return Number(nettablename.replace(ENetTables.etentity, "")) as PlayerID;
        }
        return -1;
    }

    export enum ENetTables {
        common = "common",
        etentity = "etentity",
        etentity0 = "etentity0",
        etentity1 = "etentity1",
        etentity2 = "etentity2",
        etentity3 = "etentity3",
        etentity4 = "etentity4",
        etentity5 = "etentity5",
    }
}
