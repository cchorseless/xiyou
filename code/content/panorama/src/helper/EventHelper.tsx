export module EventHelper {
    /**所有的游戏自带事件 */
    export const allGameEvent: { [v: string]: IGHandler[] } = {};
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
        let _eventid = GameEvents.Subscribe(eventName, (e) => {
            hander.runWith([e]);
            if (hander.once) {
                removeGameEvent(eventName, hander.caller);
                GameEvents.Unsubscribe(_eventid);
            }
        });
        if (_eventid) {
            hander.tmpArg = _eventid;
            if (allGameEvent[eventName] == null) {
                allGameEvent[eventName] = [];
            }
            allGameEvent[eventName].push(hander);
        }
    }
    /**
     * 移除所有事件监听
     * @Both
     * @param eventName
     */
    export function removeGameEvent(eventName: keyof GameEventDeclarations, context: any = null) {
        if (allGameEvent[eventName] != null) {
            const handlers = allGameEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && GameEvents.Unsubscribe(handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    export function removeGameEventCaller(context: any) {
        const keys = Object.keys(allGameEvent);
        for (let eventName of keys) {
            const handlers = allGameEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && GameEvents.Unsubscribe(handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }


    export const allUnhandledEvent: { [v: string]: IGHandler[] } = {};

    /**
     * 添加监听事件
     * @Both
     * @param eventName
     * @param func
     * @param context
     * @param isOnce
     */
    export function addUnhandledEvent(eventName: string, hander: IGHandler, isonce = false) {
        if (eventName == null || hander == null) {
            return;
        }
        hander.once = isonce;
        let _eventid = $.RegisterForUnhandledEvent(eventName, (...e) => {
            hander.runWith(e);
            if (hander.once) {
                removeUnhandledEvent(eventName, hander.caller);
                $.UnregisterForUnhandledEvent(eventName, _eventid);
            }
        });
        if (_eventid) {
            hander.tmpArg = _eventid;
            if (allUnhandledEvent[eventName] == null) {
                allUnhandledEvent[eventName] = [];
            }
            allUnhandledEvent[eventName].push(hander);
        }
    }
    /**
     * 移除所有事件监听
     * @Both
     * @param eventName
     */
    export function removeUnhandledEvent(eventName: string, context: any = null) {
        if (allUnhandledEvent[eventName] != null) {
            const handlers = allUnhandledEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && $.UnregisterForUnhandledEvent(eventName, handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    export function removeUnhandledEventCaller(context: any) {
        const keys = Object.keys(allUnhandledEvent);
        for (let eventName of keys) {
            const handlers = allUnhandledEvent[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                const handler = handlers[i];
                if (context == null || handler.caller == context) {
                    handler.tmpArg && $.UnregisterForUnhandledEvent(eventName, handler.tmpArg);
                    handler.recover();
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }


}