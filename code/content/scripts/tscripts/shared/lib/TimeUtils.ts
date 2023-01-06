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
            if (this.mDelay == 0) {
                this.mEndCallBack?.run();
            }
        }

        //更新
        public Update(interval: number): boolean {
            let isPause = GameRules.IsGamePaused();
            // if (_CODE_IN_LUA_) {
            //     isPause = GameRules.IsGamePaused()
            // }
            // else {
            //     isPause = Game.IsGamePaused()
            // }
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
                const nextDelay = (this.mEndCallBack?.run() || -1);
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
            TimerManage.GetInstance().Clear(this);
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
        Now(): number {
            // return new Date().getTime();
            return 1;
        }

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
        /**
         *
         * @param _delay 秒
         * @param endCallBack
         * @param _isIgnorePauseTime true 忽视游戏暂停.default false
         * @returns
         */
        public AddTimer(_delay: number, endCallBack: ITimerHander, _isIgnorePauseTime = false) {
            let data = this.GetTimerTask();
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