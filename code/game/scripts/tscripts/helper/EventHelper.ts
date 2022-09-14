/*
 * @Author: Jaxh
 * @Date: 2021-04-30 15:25:17
 * @LastEditors: your name
 * @LastEditTime: 2021-04-30 17:52:07
 * @Description: file content
 */

import { globalData } from "../GameCache";
import { GameEnum } from "../GameEnum";
import { GameFunc } from "../GameFunc";
import { ET } from "../rules/Entity/Entity";
import { GameRequest } from "../service/GameRequest";
import { LogHelper } from "./LogHelper";

export module EventHelper {
    /**
     * 添加客户端lua监听事件
     * @param eventName
     * @param func
     * @param context
     * @param isOnce
     */
    export function addClientGameEvent<TName extends keyof GameEventDeclarations>(context: any, eventName: TName, func: (event: GameEventDeclarations[TName]) => void, isOnce: boolean = false) {
        if (!IsClient()) {
            return;
        }
        // let _eventName = eventName as any;
        let _eventid;
        //#region 支持监听一次  TODO
        // if (isOnce) {
        //     let funcOnce = (event: any) => {

        //     }
        //     _eventid = ListenToGameEvent(_eventName, func, context);
        // }
        //#endregion
        _eventid = ListenToGameEvent(eventName, func, context);
        if (_eventid) {
            if (globalData.allGameEvent[eventName] == null) {
                globalData.allGameEvent[eventName] = [];
            }
            globalData.allGameEvent[eventName].push(_eventid);
        }
    }

    /**
     * 添加监听事件
     * @param eventName
     * @param func
     * @param context
     * @param isOnce
     */
    export function addGameEvent<TName extends keyof GameEventDeclarations>(context: any, eventName: TName, func: (event: GameEventDeclarations[TName]) => void, isOnce: boolean = false) {
        if (!IsServer()) {
            return;
        }
        // let _eventName = eventName as any;
        let _eventid;
        //#region 支持监听一次  TODO
        // if (isOnce) {
        //     let funcOnce = (event: any) => {

        //     }
        //     _eventid = ListenToGameEvent(_eventName, func, context);
        // }
        //#endregion
        _eventid = ListenToGameEvent(eventName, func, context);
        if (_eventid) {
            if (globalData.allGameEvent[eventName] == null) {
                globalData.allGameEvent[eventName] = [];
            }
            globalData.allGameEvent[eventName].push(_eventid);
        }
    }
    /**
     * 移除所有事件监听
     * @param eventName
     */
    export function removeGameEvent(context: any, eventName: keyof GameEventDeclarations) {
        if (!IsServer()) {
            return;
        }
        if (globalData.allGameEvent[eventName] != null) {
            globalData.allGameEvent[eventName].forEach((_eventid) => {
                StopListeningToGameEvent(_eventid);
            });
            globalData.allGameEvent[eventName].length = 0;
            globalData.allGameEvent[eventName] = null;
        }
    }

    /**
     * 添加全局的自定义事件
     * @param eventName
     * @param func
     * @param context
     */
    export function addCustomEvent(context: any, eventName: keyof CustomGameEventDeclarations, func: (userId: EntityIndex, event: any) => void) {
        if (!IsServer()) {
            return;
        }
        // let _eventName = eventName as any;
        let _eventid;
        //#region 支持监听一次  TODO
        // if (isOnce) {
        //     let funcOnce = (event: any) => {

        //     }
        //     _eventid = ListenToGameEvent(_eventName, func, context);
        // }
        //#endregion
        _eventid = CustomGameEventManager.RegisterListener(eventName, (userId: EntityIndex, event: any) => {
            let [status, nextCall] = xpcall(
                func,
                (msg) => {
                    return "\n" + LogHelper.traceFunc(msg) + "\n";
                },
                context,
                userId,
                event
            );
            if (!status) {
                LogHelper.error(`===============protocol error : ${eventName} ===================`);
                LogHelper.error(nextCall);
                GameRequest.GetInstance().SendErrorLog(nextCall);
            }
            return;
        });
        if (_eventid) {
            if (globalData.allCustomEvent[eventName] == null) {
                globalData.allCustomEvent[eventName] = [];
            }
            globalData.allCustomEvent[eventName].push(_eventid);
        }
    }
    /**
     * 移除所有事件监听
     * @param eventName
     */
    export function removeCustomEvent(context: any, eventName: keyof CustomGameEventDeclarations) {
        if (!IsServer()) {
            return;
        }

        if (globalData.allCustomEvent[eventName] != null) {
            globalData.allCustomEvent[eventName].forEach((_eventid) => {
                CustomGameEventManager.UnregisterListener(_eventid);
            });
            globalData.allCustomEvent[eventName].length = 0;
            globalData.allCustomEvent[eventName] = null;
        }
    }

    /**
     * 新增协议事件监听
     * @param eventName
     * @param func
     * @param context
     * @returns
     */
    export function addProtocolEvent(context: any, eventName: string, func: (event: JS_TO_LUA_DATA) => void) {
        if (!IsServer()) {
            return;
        }
        if (context == null) {
            return;
        }
        if (eventName == null) {
            return;
        }
        if (globalData.allCustomProtocolEvent[eventName] == null) {
            globalData.allCustomProtocolEvent[eventName] = [];
        }
        globalData.allCustomProtocolEvent[eventName].push({ context: context, cb: func });
    }
    /**
     * 移除协议事件监听
     * @param eventName
     * @param func
     * @param context
     * @returns
     */
    export function removeProtocolEvent(context: any, eventName: string, func: (event: JS_TO_LUA_DATA) => void) {
        if (!IsServer()) {
            return;
        }
        if (eventName == null) {
            return;
        }
        if (globalData.allCustomProtocolEvent[eventName]) {
            let len = globalData.allCustomProtocolEvent[eventName].length;
            for (let i = len - 1; i >= 0; i--) {
                let cbinfo = globalData.allCustomProtocolEvent[eventName][i];
                if (cbinfo.cb == func) {
                    globalData.allCustomProtocolEvent[eventName].splice(i, 1);
                }
            }
        }
    }
    /**
     * 模拟客户端给服务器发协议,同帧触发服务器协议事件（服务器AI用）
     * @param protocol
     * @param data
     * @param cb
     * @param context
     */
    export function fireProtocolEventOnServer(protocol: string, data: JS_TO_LUA_DATA = null) {
        if (!IsServer()) {
            return;
        }
        if (protocol == null) {
            return;
        }
        if (data == null) {
            data = {};
        }
        let allCB = globalData.allCustomProtocolEvent[protocol];
        data.IsfromServer = true;
        if (allCB && allCB.length > 0) {
            allCB.forEach((cbinfo) => {
                let [status, nextCall] = xpcall(
                    cbinfo.cb,
                    (msg) => {
                        return "\n" + LogHelper.traceFunc(msg) + "\n";
                    },
                    cbinfo.context,
                    data
                );
                if (!status) {
                    LogHelper.error(`===============protocol error : ${protocol} ===================`);
                    LogHelper.error(nextCall);
                    GameRequest.GetInstance().SendErrorLog(nextCall);

                    return;
                }
            });
        }
    }
    /**
     * 推送协议给全部客户端
     * @param eventName
     * @param eventData
     */
    export function fireProtocolEventToClient(eventName: string, eventData: JS_TO_LUA_DATA) {
        if (!IsServer()) {
            return;
        }
        let _event: JS_TO_LUA_DATA = {} as any;
        Object.assign(_event, eventData);
        _event.protocol = eventName;
        _event.state = true;
        LogHelper.print(eventName);
        CustomGameEventManager.Send_ServerToAllClients<JS_TO_LUA_DATA>(eventName, _event);
    }
    /**
     * 推送协议给队伍
     * @param eventName
     * @param eventData
     * @param team
     */
    export function fireProtocolEventToTeam(eventName: string, eventData: JS_TO_LUA_DATA, team: DOTATeam_t = null) {
        if (!IsServer()) {
            return;
        }
        let _event: JS_TO_LUA_DATA = {} as any;
        Object.assign(_event, eventData);
        _event.protocol = eventName;
        _event.state = true;
        LogHelper.print(eventName);
        CustomGameEventManager.Send_ServerToTeam<JS_TO_LUA_DATA>(team, eventName, _event);
    }
    /**
     * 推送协议给玩家，默认自己
     * @param eventName
     * @param eventData
     * @param playerid
     */
    export function fireProtocolEventToPlayer(eventName: string, eventData: JS_TO_LUA_DATA, playerid: PlayerID) {
        if (!IsServer()) {
            return;
        }
        let _event: JS_TO_LUA_DATA = {} as any;
        if (eventData) {
            Object.assign(_event, eventData);
        }
        _event.protocol = eventName;
        _event.state = true;
        let player = PlayerResource.GetPlayer(playerid);
        LogHelper.print(eventName);
        CustomGameEventManager.Send_ServerToPlayer<JS_TO_LUA_DATA>(player, eventName, _event);
    }

    /**
     * 推送錯誤信息給玩家
     * @param message
     * @param sound
     * @param playerID
     */
    export function ErrorMessage(errorcode: string, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        let event: JS_TO_LUA_DATA = {};
        event.state = true;
        event.data = errorcode;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.push_error_message, event);
        } else {
            playerID.forEach((_id) => {
                EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.push_error_message, event, _id as PlayerID);
            });
        }
    }

    export function SyncETEntity(obj: ET.IEntityJson, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        let event: JS_TO_LUA_DATA = {};
        event.state = true;
        event.data = obj;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.push_sync_et_entity, event);
        } else {
            playerID.forEach((_id) => {
                EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.push_sync_et_entity, event, _id as PlayerID);
            });
        }
    }

    /**
     * 删除所有协议事件监听
     */
    export function removeAllProtocolEvent(eventName: string) {
        if (eventName == null) {
            return;
        }
        if (globalData.allCustomProtocolEvent[eventName]) {
            delete globalData.allCustomProtocolEvent[eventName];
        }
    }

    /**
     * 新增协议事件监听
     * @param eventName
     * @param func
     * @param context
     * @returns
     */
    export function addServerEvent(context: any, eventName: string, playerid: PlayerID | null, func: (event: any) => void) {
        if (!IsServer()) {
            return;
        }
        if (eventName == null) {
            return;
        }
        globalData.allCustomServerEvent[eventName] = globalData.allCustomServerEvent[eventName] || [];
        table.insert(globalData.allCustomServerEvent[eventName], { playerid: playerid, context: context, cb: func });
    }
    /**
     * 移除协议事件监听
     * @param eventName
     * @param func
     * @param context
     * @returns
     */
    export function removeServerEvent(context: any, eventName: string, playerid: PlayerID | null, func: (event: LUA_TO_LUA_DATA) => void) {
        if (!IsServer()) {
            return;
        }

        if (eventName == null) {
            return;
        }
        if (globalData.allCustomServerEvent[eventName]) {
            let len = globalData.allCustomServerEvent[eventName].length;
            for (let i = len - 1; i >= 0; i--) {
                let cbinfo = globalData.allCustomServerEvent[eventName][i];
                if (cbinfo.cb == func && playerid == cbinfo.playerid) {
                    globalData.allCustomServerEvent[eventName].splice(i, 1);
                }
            }
        }
    }

    /**
     * 触发服务器监听事件
     * @param eventName
     * @param eventData
     */
    export function fireServerEvent(eventName: string, playerid: PlayerID | null = null, eventData: any = null) {
        if (!IsServer()) {
            return;
        }

        if (eventName == null) {
            return;
        }
        if (eventData == null) {
            eventData = {};
        }
        let allCB = globalData.allCustomServerEvent[eventName];
        if (allCB && allCB.length > 0) {
            allCB.forEach((cbinfo) => {
                if (playerid != cbinfo.playerid) {
                    return
                }
                let [status, nextCall] = xpcall(
                    cbinfo.cb,
                    (msg) => {
                        return "\n" + LogHelper.traceFunc(msg) + "\n";
                    },
                    cbinfo.context,
                    eventData
                );
                if (!status) {
                    LogHelper.error(`===============protocol error : ${eventName} ===================`);
                    LogHelper.error(nextCall);
                    GameRequest.GetInstance().SendErrorLog(nextCall);
                    return;
                }
            });
        }
    }
}
