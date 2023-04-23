/*
 * @Author: Jaxh
 * @Date: 2021-04-30 15:25:17
 * @LastEditors: your name
 * @LastEditTime: 2021-04-30 17:52:07
 * @Description: file content
 */


export module EventHelper {
    /**
     * 添加监听事件
     * @Both
     * @param eventName
     * @param func
     * @param context
     * @param isOnce
     */
    export function addGameEvent<TName extends keyof GameEventDeclarations>(eventName: TName, hander: IGHandler, isonce = false) {
        if (eventName == null || hander == null) {
            return;
        }
        hander.once = isonce;
        let _eventid = ListenToGameEvent(eventName, (e) => {
            hander.runWith([e]);
            if (hander.once) {
                removeGameEvent(eventName, hander.caller);
                StopListeningToGameEvent(_eventid);
            }
        }, EventHelper);
        if (_eventid) {
            hander.tmpArg = _eventid;
            if (GGameCache.allGameEvent[eventName] == null) {
                GGameCache.allGameEvent[eventName] = [];
            }
            GGameCache.allGameEvent[eventName].push(hander);
        }
    }
    /**
     * 移除所有事件监听
     * @Both
     * @param eventName
     */
    export function removeGameEvent(eventName: keyof GameEventDeclarations, context: any = null) {
        if (GGameCache.allGameEvent[eventName] != null) {
            const handlers = GGameCache.allGameEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && StopListeningToGameEvent(handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    export function removeGameEventCaller(context: any) {
        const keys = Object.keys(GGameCache.allGameEvent);
        for (let eventName of keys) {
            const handlers = GGameCache.allGameEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && StopListeningToGameEvent(handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }


    /**
     * 添加全局的自定义事件
     * @Server
     * @param eventName
     * @param func
     * @param context
     */
    export function addCustomEvent(eventName: keyof CustomGameEventDeclarations, hander: IGHandler, isonce = false) {
        if (!IsServer()) {
            return;
        }
        if (eventName == null || hander == null) {
            return;
        }
        hander.once = isonce;
        let _eventid = CustomGameEventManager.RegisterListener(eventName, (userId: EntityIndex, event: any) => {
            hander.runWith([userId, event]);
            if (hander.once) {
                removeCustomEvent(eventName, hander.caller);
                CustomGameEventManager.UnregisterListener(_eventid);
            }
        });
        if (_eventid) {
            hander.tmpArg = _eventid;
            if (GGameCache.allCustomEvent[eventName] == null) {
                GGameCache.allCustomEvent[eventName] = [];
            }
            GGameCache.allCustomEvent[eventName].push(hander);
        }
    }
    /**
     * 移除所有事件监听
     * @Server
     * @param eventName
     */
    export function removeCustomEvent(eventName: keyof CustomGameEventDeclarations, context: any = null) {
        if (!IsServer()) {
            return;
        }
        if (GGameCache.allCustomEvent[eventName] != null) {
            const handlers = GGameCache.allCustomEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && CustomGameEventManager.UnregisterListener(handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    /**
     * 新增协议事件监听
     * @Server
     * @param eventName
     * @param func
     * @param context
     * @returns
     */
    export function addProtocolEvent(eventName: string, hander: IGHandler, isonce = false) {
        if (!IsServer()) {
            return;
        }
        if (eventName == null) {
            return;
        }
        if (hander == null) {
            return;
        }
        hander.once = isonce;
        if (GGameCache.allCustomProtocolEvent[eventName] == null) {
            GGameCache.allCustomProtocolEvent[eventName] = [];
        }
        GGameCache.allCustomProtocolEvent[eventName].push(hander);
    }
    /**
     * 移除协议事件监听
     * @Server
     * @param eventName
     * @param func
     * @param context
     * @returns
     */
    export function removeProtocolEvent(eventName: string, context: any = null) {
        if (!IsServer()) {
            return;
        }
        if (eventName == null) {
            return;
        }
        if (GGameCache.allCustomProtocolEvent[eventName]) {
            const handers = GGameCache.allCustomProtocolEvent[eventName];
            if (context == null) {
                delete GGameCache.allCustomProtocolEvent[eventName];
                handers.forEach(h => {
                    h.recover()
                })
            }
            else {
                let len = handers.length;
                for (let i = len - 1; i >= 0; i--) {
                    let cbinfo = handers[i];
                    if (cbinfo.caller == context) {
                        GGameCache.allCustomProtocolEvent[eventName].splice(i, 1);
                        cbinfo.recover()
                    }
                }
            }
        }
    }
    /**
     * 删除所有协议事件监听
     * @Server
     */
    export function removeCallerProtocolEvent(context: any) {
        if (!IsServer()) {
            return;
        }
        if (context == null) {
            return;
        }
        for (let eventName in GGameCache.allCustomProtocolEvent) {
            const handers = GGameCache.allCustomProtocolEvent[eventName];
            let len = handers.length;
            for (let i = len - 1; i >= 0; i--) {
                let cbinfo = handers[i];
                if (cbinfo.caller == context) {
                    GGameCache.allCustomProtocolEvent[eventName].splice(i, 1);
                    cbinfo.recover()
                }
            }
        }
    }
    /**
     * 模拟客户端给服务器发协议,同帧触发服务器协议事件（服务器AI用）
     * @Server
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
        let allCB = GGameCache.allCustomProtocolEvent[protocol] || [];
        data.IsfromServer = true;
        for (let i = 0, len = allCB.length; i < len; i++) {
            let cbinfo = allCB[i];
            if (cbinfo == null) {
                break;
            }
            if (data == null) {
                cbinfo.run();
            }
            else {
                cbinfo.runWith([data]);
            }
            if (cbinfo.once) {
                allCB.splice(i, 1);
                i--;
                len--;
            }
        }
    }

    /**
     * 推送协议给全部客户端
     * @Server
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
        // LogHelper.print(eventName);
        CustomGameEventManager.Send_ServerToAllClients<JS_TO_LUA_DATA>(eventName, _event);
    }
    /**
     * 推送协议给队伍
     * @Server
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
        // LogHelper.print(eventName);
        CustomGameEventManager.Send_ServerToTeam<JS_TO_LUA_DATA>(team, eventName, _event);
    }
    /**
     * 推送协议给玩家，默认自己
     * @Server
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
        // LogHelper.print(eventName);
        CustomGameEventManager.Send_ServerToPlayer<JS_TO_LUA_DATA>(player, eventName, _event);
    }

}

