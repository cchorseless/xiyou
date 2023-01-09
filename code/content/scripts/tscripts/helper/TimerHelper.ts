import { GameEnum } from "../shared/GameEnum";
import { LogHelper } from "./LogHelper";

export module TimerHelper {
    export function Init() {
        // 函数覆盖掉
        GTimerHelper.NowUnix = NowUnix;
        if (GGameCache.TimerEntity != null) {
            return;
        }
        (GGameCache.TimerEntity as any) = Entities.CreateByClassname(GameEnum.Unit.UnitNames.info_target); //-- Entities: FindByClassname(nil, 'CWorld')
        LogHelper.print("TimeWorker Start ...");
        let interval = GTimerHelper.GetUpdateInterval();
        GGameCache.TimerEntity.SetContextThink("__TIME_THINK__", () => {
            GTimerHelper.Update(interval);
            interval = GTimerHelper.GetUpdateInterval();
            return interval;
        }, interval)
    }
    /**时间戳 */
    function NowUnix() {
        const timeoffset = (TimeZoneOffSet || 0) * 3600 * 1000;
        return GetLocalTime() - timeoffset;
    }

    function GetLocalTime() {
        // 北京时间--01/09/23
        const date = GetSystemDate().split("/");
        let year = Number(date[2]);
        if (year < 2000) year += 2000;
        const month = Number(date[0]);
        const day = Number(date[1]);
        // 北京时间--10:42:17
        const time = GetSystemTime().split(":");;
        const hour = Number(time[0]);
        const minute = Number(time[1]);
        const second = Number(time[2]);
        return GTimerHelper.toUnixTime(year, month, day, hour, minute, second) * 1000;
    }
    let TimeZoneOffSet: number | null = null;
    /**
     * 更新一下时区，用于获取utc时间戳
     * @param time
     */
    export function UpdateTimeZoneOffSet(time: number) {
        if (TimeZoneOffSet != null) {
            const offset = time - GetLocalTime();
            TimeZoneOffSet = Math.floor(Math.abs(offset / 1000 / 3600));
            if (offset < 0) {
                TimeZoneOffSet = TimeZoneOffSet * -1;
            }
        }
        GLogHelper.print(NowUnix(), "------NowUnix-----")
        GLogHelper.print(time, "-----servertime------")
        GLogHelper.print(NowUnix() - time, "-----offset------")
    }

    // export class TimeWorker {
    //     /**固定时间间隔 */
    //     static TIMERS_THINK = 0.02;
    //     static __TIME_THINK__ = "__TIME_THINK__";
    //     static __FRAME_THINK__ = "__FRAME_THINK__";
    //     static Start() {
    //         if (GGameCache.TimerEntity != null) {
    //             return;
    //         }
    //         (GGameCache.TimerEntity as any) = Entities.CreateByClassname(GameEnum.Unit.UnitNames.info_target); //-- Entities: FindByClassname(nil, 'CWorld')
    //         TimeWorker.startTimeThink();
    //         TimeWorker.startFrameThink();
    //         LogHelper.print("TimeWorker Start ...");
    //     }
    //     /**固定时间循环 */
    //     private static startTimeThink() {
    //         if (GGameCache.TimerEntity == null) {
    //             return;
    //         }
    //         if (GameRules.State_Get() >= DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
    //             return;
    //         }
    //         //    固定時間间隔
    //         GGameCache.TimerEntity.SetContextThink(
    //             TimeWorker.__TIME_THINK__,
    //             () => {
    //                 for (let timeid in GGameCache.allTimers) {
    //                     let _timeInfo = GGameCache.allTimers[timeid];
    //                     let now;
    //                     if (_timeInfo.useGameTime) {
    //                         now = GameRules.GetGameTime();
    //                     } else {
    //                         now = Time();
    //                     }
    //                     if (now >= _timeInfo.finishtime) {
    //                         // -- Run the callback
    //                         let [status, nextCall] = xpcall(
    //                             _timeInfo.handler,
    //                             (msg: any) => {
    //                                 return "\n" + LogHelper.traceFunc(msg) + "\n";
    //                             },
    //                             _timeInfo.context
    //                         );
    //                         // Make sure it worked
    //                         if (status) {
    //                             // --Check if it needs to loop
    //                             if (nextCall) {
    //                                 _timeInfo.finishtime = _timeInfo.finishtime + (nextCall as number);
    //                             } else {
    //                                 delete GGameCache.allTimers[timeid];
    //                             }
    //                         } else {
    //                             delete GGameCache.allTimers[timeid];
    //                             LogHelper.error(`===============TimeWorker CB error :  ===================`);
    //                             LogHelper.error(nextCall);
    //                             GGameServiceSystem.GetInstance().SendErrorLog(nextCall);
    //                         }
    //                     }
    //                 }
    //                 return TimeWorker.TIMERS_THINK;
    //             },
    //             0
    //         );
    //     }
    //     /**帧循环 */
    //     private static startFrameThink() {
    //         if (GGameCache.TimerEntity == null) {
    //             return;
    //         }
    //         if (GameRules.State_Get() >= DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
    //             return;
    //         }
    //         //    固定帧率
    //         GGameCache.TimerEntity.SetContextThink(
    //             TimeWorker.__FRAME_THINK__,
    //             () => {
    //                 for (let timeid in GGameCache.allFrameTimers) {
    //                     let _timeInfo = GGameCache.allFrameTimers[timeid];
    //                     _timeInfo.finishtime -= 1;
    //                     if (_timeInfo.finishtime <= 0) {
    //                         // -- Run the callback
    //                         let [status, nextCall] = xpcall(
    //                             _timeInfo.handler,
    //                             (msg: any) => {
    //                                 return "\n" + LogHelper.traceFunc(msg) + "\n";
    //                             },
    //                             _timeInfo.context
    //                         );
    //                         // Make sure it worked
    //                         if (status) {
    //                             // --Check if it needs to loop
    //                             if (nextCall) {
    //                                 _timeInfo.finishtime = _timeInfo.finishtime + (nextCall as number);
    //                             } else {
    //                                 delete GGameCache.allFrameTimers[timeid];
    //                             }
    //                         } else {
    //                             delete GGameCache.allFrameTimers[timeid];
    //                             LogHelper.error(`===============TimeWorker CB error :  ===================`);
    //                             LogHelper.error(nextCall);
    //                             GGameServiceSystem.GetInstance().SendErrorLog(nextCall);
    //                         }
    //                     }
    //                 }
    //                 return GameRules.GetGameFrameTime();
    //             },
    //             0
    //         );
    //     }
    // }
    // export interface timerInfo {
    //     /**计时器ID */
    //     timerid: string;
    //     /**结束时间|结束帧数 */
    //     finishtime: number;
    //     /**上下文 */
    //     context: any;
    //     /**是否使用游戏时间，true=>游戏暂停，计时器停止；false=>无视游戏是否暂停 */
    //     useGameTime: boolean;
    //     /**处理函数()=>时间|帧数 */
    //     handler: () => void | number;
    // }



    // export async function delayTimer(delay: number, useGameTime = true) {
    //     return new Promise((resolve, reject) => {
    //         addTimer(delay, () => {
    //             resolve(true);
    //         }, TimerHelper, useGameTime);
    //     });
    // }

    // /**
    //  * 固定时间计时器
    //  * @param delay 秒
    //  * @param cb 返回下次循环时间
    //  * @param context 上下文
    //  * @param useGameTime 是否使用游戏时间，true=>游戏暂停，计时器停止；false=>无视游戏是否暂停
    //  */
    // export function addTimer(delay: number, cb: (this: any) => void | number, context: any = null, useGameTime = true) {
    //     if (delay <= 0) {
    //         // 下一帧执行
    //         delay = 0;
    //     }
    //     let timeid = DoUniqueString(TimeWorker.__TIME_THINK__);
    //     let finishtime;
    //     if (useGameTime) {
    //         finishtime = GameRules.GetGameTime() + delay;
    //     } else {
    //         finishtime = Time() + delay;
    //     }
    //     while (GGameCache.allTimers[timeid]) {
    //         timeid = DoUniqueString(TimeWorker.__TIME_THINK__);
    //     }
    //     GGameCache.allTimers[timeid] = {
    //         timerid: timeid,
    //         finishtime: finishtime,
    //         context: context,
    //         useGameTime: useGameTime,
    //         handler: cb,
    //     };
    //     return timeid;
    // }

    // /**
    //  * 帧循环计时器
    //  * @param delayFrame 帧数
    //  * @param cb ()=>下次帧数
    //  * @param context 上下文
    //  */
    // export function addFrameTimer(delayFrame: number, cb: (this: any) => void | number, context: any = null) {
    //     if (delayFrame <= 0) {
    //         delayFrame = 1;
    //     }
    //     let timeid = DoUniqueString(TimeWorker.__FRAME_THINK__);
    //     let finishtime = delayFrame;
    //     while (GGameCache.allFrameTimers[timeid]) {
    //         timeid = DoUniqueString(TimeWorker.__FRAME_THINK__);
    //     }
    //     GGameCache.allFrameTimers[timeid] = {
    //         timerid: timeid,
    //         finishtime: finishtime,
    //         context: context,
    //         useGameTime: true,
    //         handler: cb,
    //     };
    //     return timeid;
    // }
    // /**
    //  * 移除计时器
    //  * @param timeid
    //  */
    // export function removeTimer(timeid: string) {
    //     if (GGameCache.allTimers[timeid]) {
    //         delete GGameCache.allTimers[timeid];
    //     }
    //     if (GGameCache.allFrameTimers[timeid]) {
    //         delete GGameCache.allFrameTimers[timeid];
    //     }
    // }

    // /**
    //  * 删除上下文所有计时器
    //  * @param context 上下文 this
    //  */
    // export function removeAllTimer(context: any) {
    //     for (let timeid in GGameCache.allTimers) {
    //         let _timeInfo = GGameCache.allTimers[timeid];
    //         if (_timeInfo.context && _timeInfo.context == context) {
    //             delete GGameCache.allTimers[timeid];
    //         }
    //     }
    //     for (let timeid in GGameCache.allFrameTimers) {
    //         let _timeInfo = GGameCache.allFrameTimers[timeid];
    //         if (_timeInfo.context && _timeInfo.context == context) {
    //             delete GGameCache.allFrameTimers[timeid];
    //         }
    //     }
    // }
}
