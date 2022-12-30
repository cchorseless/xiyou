
export module GEventHelper {
    const AllEventInfo: { [eventName: string]: [{ isonce: boolean; playerid: PlayerID | null, handler: IGHandler }] } = {};

    export function AddEvent(eventName: string, handler: IGHandler, playerid: PlayerID | null = null, isOnce = false) {
        if (AllEventInfo[eventName] == null) {
            AllEventInfo[eventName] = [] as any;
        }
        if (!isOnce) {
            handler.once = false;
        }
        AllEventInfo[eventName].push({ isonce: isOnce, playerid: playerid, handler: handler });
    }

    export function FireEvent(eventName: string, context: any, playerid: PlayerID | null, ...args: any[]) {
        if (AllEventInfo[eventName] == null) {
            return;
        }
        for (let i = 0, len = AllEventInfo[eventName].length; i < len; i++) {
            let info = AllEventInfo[eventName][i];
            const isplayer = (playerid == null) || info.playerid == null || info.playerid == playerid;
            if (info && isplayer && info.handler && info.handler._id > 0) {
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
    export function RemoveCaller(context: any, handler: IGHandler | null = null) {
        if (context == null) {
            return;
        }
        if (handler) {
            for (let eventName in AllEventInfo) {
                for (let i = 0, len = AllEventInfo[eventName].length; i < len; i++) {
                    let info = AllEventInfo[eventName][i];
                    if (info.handler === handler) {
                        AllEventInfo[eventName].splice(i, 1);
                        info.handler.recover();
                        return;
                    }
                }
            }
        }
        else {
            for (let eventName in AllEventInfo) {
                for (let i = 0, len = AllEventInfo[eventName].length; i < len; i++) {
                    let info = AllEventInfo[eventName][i];
                    if (info && info.handler && info.handler._id > 0) {
                        if (context == info.handler.caller) {
                            AllEventInfo[eventName].splice(i, 1);
                            info.handler.recover();
                            i--;
                        }
                    }
                }
            }
        }
    }

    export function RemoveEvent(eventName: string, context: any) {
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