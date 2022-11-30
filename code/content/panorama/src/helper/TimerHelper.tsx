import { FuncHelper } from "./FuncHelper";
import { LogHelper } from "./LogHelper";
import { SingletonClass } from "./SingletonHelper";

export module TimerHelper {
    export const Offtime = new Date().getTimezoneOffset() * 60 * 1000;
    export const UpdateInterval = () => {
        let inter = Game.GetGameFrameTime();
        if (inter < 0.04) {
            inter = 0.04
        }
        return inter;
    }

    export const GetTimeDes = (t: number) => {
        t = Math.floor(t);
        let ss = parseInt(t % 60 + "") + "";
        let mm = parseInt(t / 60 % 60 + "") + "";
        let hh = parseInt(t / 60 / 60 + "") + "";
        ss = (ss.length == 2) ? ss : "0" + ss;
        mm = (mm.length == 2) ? mm : "0" + mm;
        hh = (hh.length == 2) ? hh : "0" + hh;
        return `${hh}:${mm}:${ss}`;
    }

    export function Init() {
        let interval = UpdateInterval();
        $.Schedule(interval, () => {
            Update(interval);
        });
    }
    export function Now() {
        return new Date().getTime()
    }
    function Update(interval: number): void {
        TimerManage.GetInstance().Update(interval);
        Init();
    }

    export class TimerTask {
        // 帧事件
        public isFrameTask: boolean;
        //持续时间
        private mDelay: number;
        //重复间隔
        private mInterval: number;
        //重复次数
        private looptime: number;
        //结束回调
        private mEndCallBack: FuncHelper.Handler | null;
        //是否忽略时间
        private isIgnorePauseTime: boolean;
        //计时器
        private mRunTime: number;
        public IsInPool = false;

        //初始化
        public Init(_isFrameTask: boolean, _delay: number, _endCallBack: FuncHelper.Handler, _interval = -1, _looptime = 0, _isIgnorePauseTime = false) {
            this.isFrameTask = _isFrameTask;
            this.mDelay = Math.floor(_delay * 1000);
            this.mEndCallBack = _endCallBack;
            this.mInterval = Math.floor(_interval * 1000);
            this.looptime = _looptime;
            this.isIgnorePauseTime = _isIgnorePauseTime;
            this.mRunTime = 0;
            this.mEndCallBack!.once = false;
            if (this.mDelay == 0) {
                this.mEndCallBack?.run();
                this.mDelay = this.mInterval;
            }
        }

        //更新
        public Update(interval: number): boolean {
            if (!this.isIgnorePauseTime && Game.IsGamePaused()) {
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
                this.mEndCallBack?.run();
                this.mRunTime = 0;
                if (this.mInterval <= 0 || this.looptime == 0) {
                    this.Clear();
                    return false;
                } else {
                    this.mDelay = this.mInterval;
                    if (this.looptime > 0) {
                        this.looptime -= 1;
                    }
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
            this.mInterval = 0;
            this.looptime = 0;
            this.mEndCallBack!.once = true;
            this.mEndCallBack!.recover();
            this.mEndCallBack = null;
            this.mRunTime = 0;
            TimerManage.GetInstance().Clear(this);
        }
    }

    class TimerManage extends SingletonClass {
        //正在使用的TimerTask
        mUseTimerTasks = new Array<TimerTask>();
        //空闲的TimerTask
        mNotUseTimerTasks = new Array<TimerTask>();

        //尝试从空闲池中取一个TimerTask
        GetTimerTask() {
            let data = null;
            if (this.mNotUseTimerTasks.length == 0) {
                data = new TimerTask();
            } else {
                data = this.mNotUseTimerTasks[0];
                this.mNotUseTimerTasks.shift();
            }
            this.mUseTimerTasks.push(data);
            data.IsInPool = false;
            return data;
        }

        //创建一个计时器
        public AddTimer(_delay: number, endCallBack: FuncHelper.Handler, _isIgnorePauseTime = false) {
            let data = this.GetTimerTask();
            data.Init(false, _delay, endCallBack, -1, 0, _isIgnorePauseTime);
            return data;
        }
        public AddTimerTask(task: TimerTask, _delay: number, endCallBack: FuncHelper.Handler, _isIgnorePauseTime = false) {
            if (task == null) {
                LogHelper.warn("TimerTask IS NULL");
                return;
            }
            task.Init(false, _delay, endCallBack, -1, 0, _isIgnorePauseTime);
        }

        public AddFrameTimer(delayframeCount: number, endCallBack: FuncHelper.Handler, _isIgnorePauseTime = false): TimerTask {
            let data = this.GetTimerTask();
            data.Init(true, delayframeCount, endCallBack, -1, 0, _isIgnorePauseTime);
            return data;
        }
        public AddFrameTimerTask(task: TimerTask, delayframeCount: number, endCallBack: FuncHelper.Handler, _isIgnorePauseTime = false) {
            if (task == null) {
                LogHelper.warn("TimerTask IS NULL");
                return;
            }
            task.Init(true, delayframeCount, endCallBack, -1, 0, _isIgnorePauseTime);
        }
        /// <summary>
        /// 创建一个重复型计时器
        /// </summary>
        /// <param name="_delay">秒</param>
        /// <param name="_interval">秒</param>
        /// <param name="_endCallBack"></param>
        /// <param name="looptime"></param>  小于0 无限循环
        /// <param name="_isIgnorePauseTime"></param>
        /// <returns></returns>
        public AddIntervalTimer(_delay: number, _interval: number, _endCallBack: FuncHelper.Handler, looptime: number, _isIgnorePauseTime = false) {
            let data = this.GetTimerTask();
            data.Init(false, _delay, _endCallBack, _interval, looptime, _isIgnorePauseTime);
            return data;
        }
        public AddIntervalTimerTask(task: TimerTask, _delay: number, _interval: number, _endCallBack: FuncHelper.Handler, looptime: number, _isIgnorePauseTime = false) {
            if (task == null) {
                LogHelper.warn("TimerTask IS NULL");
                return;
            }
            task.Init(false, _delay, _endCallBack, _interval, looptime, _isIgnorePauseTime);
        }

        public AddIntervalFrameTimer(delayframeCount: number, _interval: number, _endCallBack: FuncHelper.Handler, looptime: number, _isIgnorePauseTime = false) {
            let data = this.GetTimerTask();
            data.Init(true, delayframeCount, _endCallBack, _interval, looptime, _isIgnorePauseTime);
            return data;
        }

        public AddIntervalFrameTimerTask(task: TimerTask, delayframeCount: number, _interval: number, _endCallBack: FuncHelper.Handler, looptime: number, _isIgnorePauseTime = false) {
            if (task == null) {
                LogHelper.warn("TimerTask IS NULL");
                return;
            }
            task.Init(true, delayframeCount, _endCallBack, _interval, looptime, _isIgnorePauseTime);
        }

        public Clear(data: TimerTask) {
            if (data == null) {
                return;
            }
            let index = this.mUseTimerTasks.indexOf(data);
            if (index > -1) {
                this.mUseTimerTasks.splice(index, 1);
                data.IsInPool = true;
                this.mNotUseTimerTasks.push(data);
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
            for (let i = 0; i < this.mUseTimerTasks.length; ++i) {
                if (!this.mUseTimerTasks[i].Update(interval)) {
                    //没更新成功，mUseTimerTasks长度减1，所以需要--i
                    --i;
                }
            }
        }
    }

    export function AddTimer(delay: number, handler: FuncHelper.Handler, isIgnorePauseTime = true) {
        return TimerManage.GetInstance().AddTimer(delay, handler, isIgnorePauseTime);
    }
    export function AddIntervalTimer(delay: number, _interval: number, handler: FuncHelper.Handler, looptime: number, _isIgnorePauseTime = true) {
        return TimerManage.GetInstance().AddIntervalTimer(delay, _interval, handler, looptime, _isIgnorePauseTime);
    }
    export function AddFrameTimer(delay: number, handler: FuncHelper.Handler, isIgnorePauseTime = true) {
        return TimerManage.GetInstance().AddFrameTimer(delay, handler, isIgnorePauseTime);
    }
    export function AddIntervalFrameTimer(delay: number, _interval: number, handler: FuncHelper.Handler, looptime: number, isIgnorePauseTime = true) {
        return TimerManage.GetInstance().AddIntervalFrameTimer(delay, _interval, handler, looptime, isIgnorePauseTime);
    }

    export async function DelayTime(delay: number, useGameTime = true) {
        return new Promise<boolean>((resolve, reject) => {
            TimerHelper.AddTimer(
                delay,
                FuncHelper.Handler.create(null, () => {
                    resolve(true);
                }),
                useGameTime
            );
        });
    }
    export function ClearAll(obj: any) {
        TimerManage.GetInstance().ClearAll(obj);
    }
    export async function MakeSure(obj: any) {
        return new Promise<boolean>((resolve, reject) => {
            let task = TimerHelper.AddIntervalFrameTimer(
                1, 1,
                FuncHelper.Handler.create(null, () => {
                    if (obj)
                        resolve(true);
                }),
                10
            );

        });
    }
}
