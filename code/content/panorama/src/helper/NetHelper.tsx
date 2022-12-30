import { GameServiceConfig } from "../../../scripts/tscripts/shared/GameServiceConfig";
import { LogHelper } from "./LogHelper";

export module NetHelper {
    export interface INetListener {
        ListenEventInfo: { [key: string]: GameEventListenerID[] };
    }

    /**请求LUA服务器数据 */
    export function SendToLua(protocol: string, data: any = null, cbHander: IGHandler | null = null) {
        if (cbHander != null) {
            let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                // LogHelper.print(event.protocol);
                cbHander.runWith([event])
                GameEvents.Unsubscribe(eventID);
            });
        }
        GameEvents.SendCustomGameEventToServer("JS_TO_LUA_EVENT", {
            protocol: protocol,
            data: data,
            hasCB: Boolean(cbHander),
        });
    }
    /**请求CSharp服务器数据 */
    export function SendToCSharp(protocol: string, data: any = null, cbHander: IGHandler | null = null) {
        if (cbHander != null) {
            let eventID = GameEvents.Subscribe(protocol, (event: JS_TO_LUA_DATA) => {
                // LogHelper.print(event.protocol);
                cbHander.runWith([event])
                GameEvents.Unsubscribe(eventID);
            });
        }
        GameEvents.SendCustomGameEventToServer("JS_TO_LUA_EVENT", {
            protocol: protocol,
            data: data,
            hasCB: Boolean(cbHander),
            isawait: true,
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
    export function ListenOnLua(protocol: string, cbHander: IGHandler | null = null, isOnce: boolean = false) {
        if (cbHander != null) {
            cbHander.once = isOnce;
            let eventID = GameEvents.Subscribe(protocol, (event) => {
                // LogHelper.print(protocol);
                cbHander.runWith([event]);
                if (isOnce) {
                    GameEvents.Unsubscribe(eventID);
                }
            });
        }
    }
    export function OffAllListenOnLua(context: any) { }

    export function OffListenOnLua(context: any, protocol: string) { }

    export function GetTableValue(tableName: GameServiceConfig.ENetTables, key: string) {
        let obj = CustomNetTables.GetTableValue(tableName as never, key) as any;
        return obj;
    }

    export function GetOneTable(tableName: GameServiceConfig.ENetTables) {
        return CustomNetTables.GetAllTableValues(tableName as never) as { key: string; value: any }[];
    }


    export function GetETEntityNetTableName(playerid: PlayerID | null = null) {
        if (playerid == null) {
            return GameServiceConfig.ENetTables.etentity;
        }
        switch (playerid) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return GameServiceConfig.ENetTables.etentity + playerid as any;
        }
        LogHelper.error("miss playerId =>", playerid);
    }

    export function GetPlayerIdByNetTableName(nettablename: string): PlayerID {
        if (nettablename == null) {
            return -1;
        }
        switch (nettablename) {
            case GameServiceConfig.ENetTables.etentity:
                return Players.GetLocalPlayer();
            case GameServiceConfig.ENetTables.etentity0:
            case GameServiceConfig.ENetTables.etentity1:
            case GameServiceConfig.ENetTables.etentity2:
            case GameServiceConfig.ENetTables.etentity3:
            case GameServiceConfig.ENetTables.etentity4:
            case GameServiceConfig.ENetTables.etentity5:
                return Number(nettablename.replace(GameServiceConfig.ENetTables.etentity, "")) as PlayerID;
        }
        return -1;
    }
}
