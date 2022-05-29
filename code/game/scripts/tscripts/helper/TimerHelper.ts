import { globalData } from "../GameCache";
import { GameEnum } from "../GameEnum";
import { GameRequest } from "../service/GameRequest";
import { LogHelper } from "./LogHelper";

export module TimerHelper {
    export class TimeWorker {
        /**固定时间间隔 */
        static TIMERS_THINK = 0.02;
        static __TIME_THINK__ = "__TIME_THINK__";
        static __FRAME_THINK__ = "__FRAME_THINK__";
        static Start() {
            globalData.allTimers = globalData.allTimers || {};
            globalData.allFrameTimers = globalData.allFrameTimers || {};
            if (globalData.TimerEntity != null) {
                return;
            }
            globalData.TimerEntity = Entities.CreateByClassname(GameEnum.Unit.UnitNames.info_target); //-- Entities: FindByClassname(nil, 'CWorld')
            TimeWorker.startTimeThink();
            TimeWorker.startFrameThink();
            LogHelper.print("TimeWorker Start ...");
        }
        /**固定时间循环 */
        private static startTimeThink() {
            if (globalData.TimerEntity == null) {
                return;
            }
            if (GameRules.State_Get() >= DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
                return;
            }
            //    固定時間间隔
            globalData.TimerEntity.SetContextThink(
                TimeWorker.__TIME_THINK__,
                () => {
                    for (let timeid in globalData.allTimers) {
                        let _timeInfo = globalData.allTimers[timeid];
                        let now;
                        if (_timeInfo.useGameTime) {
                            now = GameRules.GetGameTime();
                        } else {
                            now = Time();
                        }
                        if (now >= _timeInfo.finishtime) {
                            // -- Run the callback
                            let [status, nextCall] = xpcall(
                                _timeInfo.handler,
                                (msg: any) => {
                                    return "\n" + LogHelper.traceFunc(msg) + "\n";
                                },
                                _timeInfo.context
                            );
                            // Make sure it worked
                            if (status) {
                                // --Check if it needs to loop
                                if (nextCall) {
                                    _timeInfo.finishtime = _timeInfo.finishtime + (nextCall as number);
                                } else {
                                    delete globalData.allTimers[timeid];
                                }
                            } else {
                                delete globalData.allTimers[timeid];
                                LogHelper.error(`===============TimeWorker CB error :  ===================`);
                                LogHelper.error(nextCall);
                                GameRequest.GetInstance().SendErrorLog(nextCall);
                            }
                        }
                    }
                    return TimeWorker.TIMERS_THINK;
                },
                0
            );
        }
        /**帧循环 */
        private static startFrameThink() {
            if (globalData.TimerEntity == null) {
                return;
            }
            if (GameRules.State_Get() >= DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
                return;
            }
            //    固定帧率
            globalData.TimerEntity.SetContextThink(
                TimeWorker.__FRAME_THINK__,
                () => {
                    for (let timeid in globalData.allFrameTimers) {
                        let _timeInfo = globalData.allFrameTimers[timeid];
                        _timeInfo.finishtime -= 1;
                        if (_timeInfo.finishtime <= 0) {
                            // -- Run the callback
                            let [status, nextCall] = xpcall(
                                _timeInfo.handler,
                                (msg: any) => {
                                    return "\n" + LogHelper.traceFunc(msg) + "\n";
                                },
                                _timeInfo.context
                            );
                            // Make sure it worked
                            if (status) {
                                // --Check if it needs to loop
                                if (nextCall) {
                                    _timeInfo.finishtime = _timeInfo.finishtime + (nextCall as number);
                                } else {
                                    delete globalData.allFrameTimers[timeid];
                                }
                            } else {
                                delete globalData.allFrameTimers[timeid];
                                LogHelper.error(`===============TimeWorker CB error :  ===================`);
                                LogHelper.error(nextCall);
                                GameRequest.GetInstance().SendErrorLog(nextCall);
                            }
                        }
                    }
                    return GameRules.GetGameFrameTime();
                },
                0
            );
        }
    }
    export interface timerInfo {
        /**计时器ID */
        timerid: string;
        /**结束时间|结束帧数 */
        finishtime: number;
        /**上下文 */
        context: any;
        /**是否使用游戏时间，true=>游戏暂停，计时器停止；false=>无视游戏是否暂停 */
        useGameTime: boolean;
        /**处理函数()=>时间|帧数 */
        handler: () => void | number;
    }

    export function now() {
        return  GetSystemDate() +" "+ GetSystemTime();
    }
   
    export async function delayTimer(delay: number, useGameTime = true) {
        return new Promise((resolve, reject) => {
            addTimer(delay, () => {
                resolve(true);
            }, TimerHelper, useGameTime);
        });
    }

    /**
     * 固定时间计时器
     * @param delay 秒
     * @param cb 返回下次循环时间
     * @param context 上下文
     * @param useGameTime 是否使用游戏时间，true=>游戏暂停，计时器停止；false=>无视游戏是否暂停
     */
    export function addTimer(delay: number, cb: (this: any) => void | number, context: any = null, useGameTime = true) {
        if (delay <= 0) {
            // 下一帧执行
            delay = 0;
        }
        let timeid = DoUniqueString(TimeWorker.__TIME_THINK__);
        let finishtime;
        if (useGameTime) {
            finishtime = GameRules.GetGameTime() + delay;
        } else {
            finishtime = Time() + delay;
        }
        while (globalData.allTimers[timeid]) {
            timeid = DoUniqueString(TimeWorker.__TIME_THINK__);
        }
        globalData.allTimers[timeid] = {
            timerid: timeid,
            finishtime: finishtime,
            context: context,
            useGameTime: useGameTime,
            handler: cb,
        };
        return timeid;
    }

    /**
     * 帧循环计时器
     * @param delayFrame 帧数
     * @param cb ()=>下次帧数
     * @param context 上下文
     */
    export function addFrameTimer(delayFrame: number, cb: (this: any) => void | number, context: any = null) {
        if (delayFrame <= 0) {
            delayFrame = 1;
        }
        let timeid = DoUniqueString(TimeWorker.__FRAME_THINK__);
        let finishtime = delayFrame;
        while (globalData.allFrameTimers[timeid]) {
            timeid = DoUniqueString(TimeWorker.__FRAME_THINK__);
        }
        globalData.allFrameTimers[timeid] = {
            timerid: timeid,
            finishtime: finishtime,
            context: context,
            useGameTime: true,
            handler: cb,
        };
        return timeid;
    }
    /**
     * 移除计时器
     * @param timeid
     */
    export function removeTimer(timeid: string) {
        if (globalData.allTimers[timeid]) {
            delete globalData.allTimers[timeid];
        }
        if (globalData.allFrameTimers[timeid]) {
            delete globalData.allFrameTimers[timeid];
        }
    }

    /**
     * 删除上下文所有计时器
     * @param context 上下文 this
     */
    export function removeAllTimer(context: any) {
        for (let timeid in globalData.allTimers) {
            let _timeInfo = globalData.allTimers[timeid];
            if (_timeInfo.context && _timeInfo.context == context) {
                delete globalData.allTimers[timeid];
            }
        }
        for (let timeid in globalData.allFrameTimers) {
            let _timeInfo = globalData.allFrameTimers[timeid];
            if (_timeInfo.context && _timeInfo.context == context) {
                delete globalData.allFrameTimers[timeid];
            }
        }
    }
}
