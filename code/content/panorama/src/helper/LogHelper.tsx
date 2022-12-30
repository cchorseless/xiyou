export module LogHelper {
    export let IsDebug = true;
    export const OffSetLine = -9;

    /**
     * 打印对象
     * @param args
     * @returns
     */
    export function print(...args: any[]): void {
        if (!LogHelper.IsDebug) {
            return;
        }
        if (!Game.IsInToolsMode()) {
            return;
        }
        try {
            throw new Error("");
        } catch (e) {
            let stack = (e as any).stack;
            let arr = stack.split("\n");
            let a = arr[2].split(" ");
            let b = a[5].split(".");
            let c = a[6].split("/");
            let file = c[c.length - 1].split(":");
            let file_str = `${file[0]}:${parseInt(file[1]) + OffSetLine}|`;
            let len = b.length;
            let cls = b[len - 2];
            let fun = b[len - 1];
            if (cls == null) {
                cls = "?";
            }
            let r = `[${file_str}${cls}:${fun}]:`;
            let msg: any[] = [];
            args.forEach(ss => {
                msg.push(ss);
                msg.push(" ");
            })
            $.Msg(r, ...msg);
        }
    }
    /**
     * 打印对象
     * @param args
     * @returns
     */
    export function warn(...args: any[]): void {
        if (!LogHelper.IsDebug) {
            return;
        }
        if (!Game.IsInToolsMode()) {
            return;
        }
        try {
            throw new Error("");
        } catch (e) {
            let stack = (e as any).stack;
            let arr = stack.split("\n");
            let a = arr[2].split(" ");
            let b = a[5].split(".");
            let c = a[6].split("/");
            let file = c[c.length - 1].split(":");
            let file_str = `${file[0]}:${parseInt(file[1]) + OffSetLine}|`;
            let len = b.length;
            let cls = b[len - 2];
            let fun = b[len - 1];
            if (cls == null) {
                cls = "?";
            }
            let r = `[${file_str}${cls}:${fun}]:`;
            $.Warning(r, ...args);
        }
    }

    export function error(...args: any[]): void {
        if (!Game.IsInToolsMode()) {
            return;
        }
        $.AssertHelper(...args);
        // try {
        //     throw new Error("")
        // }
        // catch (e) {
        //     let stack = (e as any).stack;
        //     let arr = stack.split("\n");
        //     let a = arr[2].split(" ");
        //     let b = a[5].split('.');
        //     let c = a[6].split('/');
        //     let file = c[c.length - 1].split(':');
        //     let file_str = `${file[0]}:${parseInt(file[1]) + OffSetLine}|`;
        //     let len = b.length;
        //     let cls = b[len - 2];
        //     let fun = b[len - 1];
        //     if (cls == null) { cls = '?' }
        //     let r = `[${file_str}${cls}:${fun}]:`
        //     $.AssertHelper(r, ...args)
        // }
    }

    export function DeepPrintTable(table?: Object) {
        if (!LogHelper.IsDebug) {
            return;
        }
    }
}
declare global {
    /**
     * @JsOnly
     */
    var GLogHelper: typeof LogHelper;
}
if (global.GLogHelper == null) {
    global.GLogHelper = LogHelper;
}