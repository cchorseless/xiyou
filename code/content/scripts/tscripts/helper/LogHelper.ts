export class LogHelper {
    public static _PRINT_MESSAGE_STACK_ = '_PRINT_MESSAGE_STACK_'
    public static IsDebug = true;
    /**原始的堆栈函数 */
    public static traceFunc = debug.traceback
    /**
     * 打印对象
     * @param t
     * @param des
     */
    public static print(...args: any[]): void {
        if (!LogHelper.IsDebug) { return }
        if (!IsInToolsMode()) { return }
        if (args.length == 0) { args.push('null') };
        let arr = Object.keys(args);
        let len = Number(arr[arr.length - 1])
        let args_ObjectIndex = [];
        for (let i = 0; i < len; i++) {
            if (args[i] == null) {
                args[i] = 'null';
            }
            else if (args[i] instanceof Object) {
                args_ObjectIndex.push(i)
            }
        }
        while (args_ObjectIndex.length > 0) {
            let index = args_ObjectIndex.shift();
            if (index > 0) {
                LogHelper.print(...args.splice(0, index));
                LogHelper.DeepPrintTable(args.shift())
            }
            else if (index == 0) {
                LogHelper.DeepPrintTable(args.shift())
            }
            args_ObjectIndex = args_ObjectIndex.map((s) => { return s - index - 1 })
        }
        if (args.length == 0) { return };
        let message: string = LogHelper._PRINT_MESSAGE_STACK_;
        let stack = LogHelper.traceFunc(message, 2);
        stack = stack.replace(message, "").replace("stack traceback:", "")
        let s = stack.split('\n');
        let s0 = s[3]
        // s.forEach((ssss) => { print(ssss) })
        for (let _ss of s) {
            if (_ss && _ss != '' && _ss.indexOf(LogHelper.name + '.ts') == -1) {
                s0 = _ss;
                break;
            }
        }
        s0 = s0.replace(" ", "").replace("in function", "");
        let s1 = s0.split("<")[0];
        let s2 = s1.split('\\');
        let r = [];
        for (let i = 2; i < s2.length; i++) {
            r.push(s2[i])
        }
        let r_s = r.join("\\")
        r_s = string.gsub(r_s, ".*scripts[\\/]vscripts[\\/]", "")[0];
        let where_str = '<Is????>'
        if (IsServer()) {
            where_str = '<IsServer>'
        }
        else if (IsClient()) {
            where_str = '<IsClient>'
        }
        let r2 = ["[" + r_s + where_str + "]:"];
        let r3 = r2.concat(args);
        print(...r3);
    }

    public static warn(...args: any[]): void {
        LogHelper.print("-------------------------------------warn-------------------------------------")
        LogHelper.print(...args);
        LogHelper.print("-------------------------------------warn end---------------------------------")
    }

    public static error(...args: any[]): void {
        if (!IsInToolsMode()) {
            return;
        }
        let where_str = '<Is????>'
        if (IsServer()) {
            where_str = '<IsServer>'
        }
        else if (IsClient()) {
            where_str = '<IsClient>'
        }
        LogHelper.print("[" + where_str + "] ERROR:")
        let r2 = args || [];
        error(r2.join(" "), 2)
    }

    public static DeepPrintTable(table?: Object) {
        if (!LogHelper.IsDebug) { return }
        if (!IsInToolsMode()) { return }
        LogHelper.print('')
        DeepPrintTable(table);
    }

}

if (!IsInToolsMode()) {
    (debug.traceback as any) = function (this: void, ...args: any[]) {
        let trace;
        if (args.length == 0) {
            trace = LogHelper.traceFunc()
        }
        else {
            trace = LogHelper.traceFunc(...args)
        }
        /**LUA 的堆栈信息 */
        let luatrace = args[0];
        if (luatrace != LogHelper._PRINT_MESSAGE_STACK_) {
            if (type(luatrace) == 'string' && !GGameCache.allErrorInfo[luatrace]) {
                let errmsg = '';
                if (type(trace) == 'string') {
                    errmsg = trace
                }
                else {
                    errmsg = luatrace
                }
                GGameServiceSystem.GetInstance().SendErrorLog(errmsg);
                GGameCache.allErrorInfo[luatrace] = true;
            }
        }
        return trace as any
    }
}

declare global {
    /**
     * @ServerOnly
     */
    var GLogHelper: typeof LogHelper;
}
if (_G.GLogHelper == null) {
    _G.GLogHelper = LogHelper;
    LogHelper.print("-------------------LogHelper Init----------------------------")
    // const oldrequire = require;
    // _G.require = (s: string) => {
    //     LogHelper.print(s)
    //     return oldrequire(s)
    // }
}