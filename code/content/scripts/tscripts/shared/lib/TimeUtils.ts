import { SingletonClass } from "./SingletonClass";

type ITimerHander = IGHandler<number | void>;
export module TimeUtils {
    export class TimerTask {
        // 帧事件
        public isFrameTask: boolean;
        //持续时间
        private mDelay: number;
        //结束回调
        private mEndCallBack: ITimerHander | null;
        //是否忽略时间
        private isIgnorePauseTime: boolean;
        //计时器
        private mRunTime: number;
        public IsInPool = false;

        //初始化
        public Init(_isFrameTask: boolean, _delay: number, _endCallBack: ITimerHander, _isIgnorePauseTime = false) {
            this.isFrameTask = _isFrameTask;
            this.mDelay = Math.floor(_delay * 1000);
            this.mEndCallBack = _endCallBack;
            this.isIgnorePauseTime = _isIgnorePauseTime;
            this.mRunTime = 0;
            this.mEndCallBack!.once = false;
            if (this.mDelay <= 0 && this.mEndCallBack) {
                this.mEndCallBack.run();
            }
        }

        //更新
        public Update(interval: number, isPause: boolean): boolean {
            if (!this.isIgnorePauseTime && isPause) {
                return true;
            }
            let deltaTime;
            if (this.isFrameTask) {
                deltaTime = 1000;
            } else {
                // UpdateInterval * 1000
                deltaTime = interval * 1000;
            }
            this.mRunTime += deltaTime;
            let isFinish = this.mRunTime >= this.mDelay;
            if (isFinish) {
                let nextDelay = this.mEndCallBack!.run();
                if (!nextDelay) { nextDelay = -1 }
                this.mDelay = Math.floor(nextDelay * 1000);
                this.mRunTime = 0;
                if (this.mDelay <= 0) {
                    this.Clear();
                    return false;
                }
            }
            return true;
        }
        IsBind(obj: any) {
            if (obj == null) {
                return false;
            } else {
                return this.mEndCallBack!.caller == obj;
            }
        }
        public Clear() {
            if (this.IsInPool) {
                return;
            }
            this.mDelay = 0;
            this.mEndCallBack!.once = true;
            this.mEndCallBack!.recover();
            this.mEndCallBack = null;
            this.mRunTime = 0;
            GTimerHelper.Clear(this);
        }
    }

    export class TimerManage extends SingletonClass {
        //正在使用的TimerTask
        mUseTimerTasks: TimerTask[] = [];
        //空闲的TimerTask
        mNotUseTimerTasks: TimerTask[] = [];
        GetUpdateInterval(): number {
            let inter = GameRules.GetGameFrameTime();
            if (inter < 0.04) {
                inter = 0.04
            }
            return inter;
        }
        /**
         * @Server
         * @override TimerHelper 覆盖掉
         * @returns unix mills时间戳
         */
        NowUnix(): number {
            return 1;
        }

        /**
         * 判断年份是否为闰年
         * @param iYear 年份
         * @returns 是否是闰年
         */
        IsLeapYear(iYear: number) {
            return (iYear % 4 == 0 && iYear % 100 != 0) || (iYear % 400 == 0);
        }

        /**
         * 根据日期返回时间戳
         * @param iYear 年
         * @param iMonth 月
         * @param iDay 日
         * @param iHour 时
         * @param iMin 分
         * @param iSec 秒
         * @returns 时间戳
         */
        toUnixTime(iYear: number = 0, iMonth: number = 0, iDay: number = 0, iHour: number = 0, iMin: number = 0, iSec: number = 0) {
            let iTotalSec = iSec + iMin * 60 + iHour * 60 * 60 + (iDay - 1) * 86400;
            // 此年经过的秒
            let iTotalDay = 0;
            let iTotalMonth = iMonth - 1;
            for (let i = 0; i <= iTotalMonth; i++) {
                if (i == 1 || i == 3 || i == 5 || i == 7 || i == 8 || i == 10 || i == 12) {
                    iTotalDay = iTotalDay + 31;
                } else if (i == 4 || i == 6 || i == 9 || i == 11) {
                    iTotalDay = iTotalDay + 30;
                } else {
                    if (this.IsLeapYear(iYear)) {
                        iTotalDay = iTotalDay + 29;
                    } else {

                        iTotalDay = iTotalDay + 28;
                    }
                }
            }

            for (let i = 1970; i <= iYear - 1; i++) {
                if (this.IsLeapYear(i)) {
                    iTotalDay = iTotalDay + 366;
                } else {
                    iTotalDay = iTotalDay + 365;
                }
            }
            iTotalSec = iTotalSec + iTotalDay * 86400;
            return iTotalSec;
        }


        //尝试从空闲池中取一个TimerTask
        GetTimerTask() {
            // let data = this.mNotUseTimerTasks.pop() || new TimerTask();
            let data = new TimerTask();
            // if (this.mNotUseTimerTasks.length == 0) {

            // } else {
            //     data = this.mNotUseTimerTasks.pop();
            // }
            this.mUseTimerTasks.push(data);
            data.IsInPool = false;
            return data;
        }

        //创建一个计时器
        /**
         *
         * @param _delay 秒
         * @param endCallBack
         * @param _isIgnorePauseTime true 忽视游戏暂停.default false
         * @returns
         */
        public AddTimer(_delay: number, endCallBack: ITimerHander, _isIgnorePauseTime = false) {
            let data = this.GetTimerTask();
            if (_delay <= 0) { _delay = this.GetUpdateInterval() }
            data.Init(false, _delay, endCallBack, _isIgnorePauseTime);
            return data;
        }
        private AddTimerTask(task: TimerTask, _delay: number, endCallBack: ITimerHander, _isIgnorePauseTime = false) {
            if (task == null) {
                GLogHelper.warn("TimerTask IS NULL");
                return;
            }
            task.Init(false, _delay, endCallBack, _isIgnorePauseTime);
        }
        /**
         *
         * @param delayframeCount 帧数
         * @param endCallBack
         * @param _isIgnorePauseTime true 忽视游戏暂停; default false
         * @returns
         */
        public AddFrameTimer(delayframeCount: number, endCallBack: ITimerHander, _isIgnorePauseTime = false): TimerTask {
            let data = this.GetTimerTask();
            if (delayframeCount <= 0) { delayframeCount = 1 }
            data.Init(true, delayframeCount, endCallBack, _isIgnorePauseTime);
            return data;
        }
        private AddFrameTimerTask(task: TimerTask, delayframeCount: number, endCallBack: ITimerHander, _isIgnorePauseTime = false) {
            if (task == null) {
                GLogHelper.warn("TimerTask IS NULL");
                return;
            }
            task.Init(true, delayframeCount, endCallBack, _isIgnorePauseTime);
        }

        public Clear(data: TimerTask) {
            if (data == null) {
                return;
            }
            let index = this.mUseTimerTasks.indexOf(data);
            if (index > -1) {
                this.mUseTimerTasks.splice(index, 1);
                data.IsInPool = true;
                // this.mNotUseTimerTasks.push(data);
            }
        }
        public ClearAll(bindObj: any) {
            if (bindObj == null) {
                return;
            }
            ([] as TimerTask[]).concat(this.mUseTimerTasks).forEach(task => {
                if (task.IsBind(bindObj)) {
                    task.Clear();
                }
            });
        }
        public Update(interval: number) {
            let isPause = GameRules.GetGameFrameTime() == 0;
            let len = this.mUseTimerTasks.length;
            for (let i = 0; i < len; i++) {
                if (this.mUseTimerTasks[i] == null) {
                    this.mUseTimerTasks.splice(i, 1);
                    i--;
                    len--;
                }
                else if (!this.mUseTimerTasks[i].Update(interval, isPause)) {
                    //没更新成功，mUseTimerTasks长度减1，所以需要--i
                    // hander 也可能往里面加计时器，所以需要重新计算长度
                    i--;
                    len--;
                }
            }
        }

        async DelayTime(delay: number, useGameTime = true) {
            return new Promise<boolean>((resolve, reject) => {
                this.AddTimer(
                    delay,
                    GHandler.create(null, () => {
                        resolve(true);
                    }),
                    useGameTime
                );
            });
        }
        async MakeSure(obj: any) {
            return new Promise<boolean>((resolve, reject) => {
                const timers = 10;
                let i = 0;
                this.AddFrameTimer(1, GHandler.create(null, () => {
                    i++;
                    if (obj) {
                        resolve(true);
                    }
                    else if (i <= timers) {
                        return 1;
                    }
                })
                );

            });
        }
    }
}



declare global {
    type ITimerTask = TimeUtils.TimerTask;
    var GTimerHelper: TimeUtils.TimerManage;
}
if (_G.GTimerHelper == null) {
    _G.GTimerHelper = TimeUtils.TimerManage.GetInstance();
}