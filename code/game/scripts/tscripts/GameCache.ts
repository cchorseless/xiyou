import { BattleHelper } from "./helper/BattleHelper";
import { LogHelper } from "./helper/LogHelper";
import { TimerHelper } from "./helper/TimerHelper";
import { Modifier_Plus } from "./npc/entityPlus/BaseModifier_Plus";
import { BaseModifier } from "./npc/entityPlus/Base_Plus";
import { GameRequest } from "./service/GameRequest";

/**全局缓存变量 */
export const globalData = globalThis as typeof globalThis & {

    /**攻击伤害记录 */
    RECORD_SYSTEM_DUMMY: {
        DAMAGE_SYSTEM: { [k: string]: BattleHelper.enum_EOM_DAMAGE_FLAGS },
        ATTACK_SYSTEM: { [k: string]: BattleHelper.AttackOptions },
        iLastRecord: number;
    }
    /**重载类的信息 */
    reloadCache: Record<string, any>;
    /**所有的游戏自带事件 */
    allGameEvent: { [v: string]: Array<EventListenerID> };
    /**所有自定义事件 */
    allCustomEvent: { [v: string]: Array<CustomGameEventListenerID> };
    /**所有的JS协议事件 */
    allCustomProtocolEvent: { [k: string]: Array<{ context: any, cb: (event: JS_TO_LUA_DATA) => void }> };
    /**所有服务器自定义事件 */
    allCustomServerEvent: { [k: string]: Array<{ playerid: PlayerID, context: any, cb: (event: LUA_TO_LUA_DATA) => void }> };
    /**所有的buff实例 */
    allModifiersIntance: { [modifiername: string]: { [UUID: string]: InstanceType<typeof BaseModifier> } };
    /**全部注册的BUFF事件信息 */
    allRegisterEvent: { [v: string]: Set<Modifier_Plus> };
    /**全局计时器 */
    TimerEntity: CBaseEntity;
    /**所有固定时间计时器 */
    allTimers: { [key: string]: TimerHelper.timerInfo };
    /**所有帧循环计时器 */
    allFrameTimers: { [key: string]: TimerHelper.timerInfo };
    /**所有报错信息 */
    allErrorInfo: any;
    [k: string]: any;
};
/**需要保留，必须打印，初始化Loghelper */
LogHelper.print('GameCache Begin ....');
globalData.RECORD_SYSTEM_DUMMY = globalData.RECORD_SYSTEM_DUMMY || {} as any;
globalData.reloadCache = globalData.reloadCache || {};
globalData.allGameEvent = globalData.allGameEvent || {};
globalData.allCustomEvent = globalData.allCustomEvent || {};
globalData.allCustomProtocolEvent = globalData.allCustomProtocolEvent || {};
globalData.allCustomServerEvent = globalData.allCustomServerEvent || {};
globalData.allModifiersIntance = globalData.allModifiersIntance || {};
globalData.allRegisterEvent = globalData.allRegisterEvent || {};
globalData.allTimers = globalData.allTimers || {};
globalData.allFrameTimers = globalData.allFrameTimers || {};
globalData.allErrorInfo = globalData.allErrorInfo || {};
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
        if (luatrace != LogHelper.PRINT_MESSAGE_STACK) {
            if (type(luatrace) == 'string' && !globalData.allErrorInfo[luatrace]) {
                let errmsg = '';
                if (type(trace) == 'string') {
                    errmsg = trace
                }
                else {
                    errmsg = luatrace
                }
                globalData.allErrorInfo[luatrace] = pcall(() => {
                    GameRequest.GetInstance().SendErrorLog(errmsg);
                })
            }
        }
        return trace as any
    }
}

/**
 * 重载类
 * @param constructor
 * @returns
 */
export function reloadable<T extends { new(...args: any[]): {}; }>(constructor: T): T {
    const className = constructor.name;
    if (globalData.reloadCache[className] == null) {
        globalData.reloadCache[className] = constructor;
    }
    else {
        Object.assign(globalData.reloadCache[className].prototype, constructor.prototype);
    }
    return globalData.reloadCache[className];
}

export function GetRegClass<T>(className: string) {
    let r = globalData.reloadCache[className];
    if (r == null) {
        LogHelper.error("NOT Reg reload Class " + className);
    }
    return r as T;
}