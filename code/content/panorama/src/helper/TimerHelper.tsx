import { FuncHelper } from "./FuncHelper";
import { LogHelper } from "./LogHelper";

export module TimerHelper {
    interface ITimerContent {
        InstanceId: string;
    }

    interface timerInfo {
        /**计时器ID */
        timerid: ScheduleID;
        /**结束时间 */
        finishtime: number;
        /**处理函数 */
        handler: () => void;
    }
    /**所有计时器 */
    export let AllTimer: { [uuid: string]: Array<timerInfo> } = {};
    /**
     * 添加计时器
     * @param delay 秒
     * @param handler =>重复间隔时间（秒）
     * @param content
     * @param useGameTime 是否使用游戏时间，true=>游戏暂停，计时器停止；false=>无视游戏是否暂停
     */
    export function addTimer(delay: number, handler: () => number | void, content: ITimerContent | null = null, useGameTime = true) {
        if (delay < 0) {
            return;
        }
        let cb = () => {
            let repeatTime = handler.call(content);
            if (repeatTime && repeatTime > 0) {
                TimerHelper.addTimer(repeatTime, handler, content);
            }
        };
        let timerID = $.Schedule(delay, cb);
        let uuid = FuncHelper.generateUUID();
        if (content) {
            uuid = content.InstanceId;
            if (uuid == null) {
                throw Error(content.constructor.name + "dont have UUID");
            }
        }
        let timerInfo: timerInfo = {
            timerid: timerID,
            finishtime: new Date().getTime() + delay * 1000,
            handler: handler,
        };
        TimerHelper.AllTimer[uuid] = TimerHelper.AllTimer[uuid] || [];
        // 控制队列长度，移除失效时间ID
        if (TimerHelper.AllTimer[uuid].length > 50) {
            let now = new Date().getTime();
            TimerHelper.AllTimer[uuid] = TimerHelper.AllTimer[uuid].filter((v, index, array) => {
                return v.finishtime > now;
            });
        }
        TimerHelper.AllTimer[uuid].push(timerInfo);
        return timerID;
    }

    export async function delayTime(delay: number, useGameTime = true) {
        return new Promise<boolean>((resolve, reject) => {
            TimerHelper.addTimer(delay, () => {
                resolve(true);
            }, null, useGameTime);
        });
    }

    /**
     * 移除计时器
     * @param content 组件，上下文
     * @param handler 函数
     */
    export function removeTimer(content: ITimerContent, handler: () => void) {
        let uuid = content.InstanceId;
        if (uuid == null) {
            throw Error(content.constructor.name + "dont have UUID");
        }
        if (TimerHelper.AllTimer[uuid]) {
            let now = new Date().getTime();
            TimerHelper.AllTimer[uuid] = TimerHelper.AllTimer[uuid].filter((v, index, array) => {
                if (v.handler == handler && v.finishtime > now) {
                    // 只能删除没有触发的计时器，否则会报错
                    TimerHelper.safeCancelScheduled(v.timerid);
                }
                return v.handler != handler;
            });
        }
    }

    /**
     * 删除计时器
     * @param content 组件，上下文
     * @param timerID 计时器ID
     * @returns
     */
    export function removeTimerByID(content: ITimerContent, timerID: ScheduleID) {
        if (content) {
            let uuid = content.InstanceId;
            if (uuid == null) {
                throw Error(content.constructor.name + "dont have UUID");
            }
            let AllTimer = TimerHelper.AllTimer[uuid];
            if (AllTimer) {
                let now = new Date().getTime();
                TimerHelper.AllTimer[uuid] = TimerHelper.AllTimer[uuid].filter((v, index, array) => {
                    return v.finishtime >= now && v.timerid != timerID;
                });
            }
        }
        TimerHelper.safeCancelScheduled(timerID);
    }

    /**
     * 移除所有计时器
     * @param content
     */
    export function removeAllTimer(content: ITimerContent) {
        let uuid = content.InstanceId;
        if (uuid == null) {
            throw Error(content.constructor.name + "dont have UUID");
        }
        let AllTimer = TimerHelper.AllTimer[uuid];
        if (AllTimer) {
            let now = new Date().getTime();
            AllTimer.forEach((timerInfo) => {
                // 加了200毫秒的延迟，防止极限情况
                if (timerInfo.finishtime + 1000 >= now) {
                    TimerHelper.safeCancelScheduled(timerInfo.timerid);
                }
            });
            AllTimer.length = 0;
            delete TimerHelper.AllTimer[uuid];
        }
    }

    /**
     * 安全删除定时器
     * @param timerID
     */
    export function safeCancelScheduled(timerID: ScheduleID) {
        try {
            $.CancelScheduled(timerID);
        } catch (e) {
            LogHelper.warn("timer del repeat");
        }
    }
}
