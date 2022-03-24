/*
 * @Author: Jaxh
 * @Date: 2021-05-08 19:04:12
 * @LastEditors: your name
 * @LastEditTime: 2021-05-10 17:59:05
 * @Description: file content
 */

import { TimerHelper } from "./TimerHelper";

export module AnimationHelper {

    class AnimationInfo {
        public frameCount: number = 0;
        public perFrameTime: number = 0.03;
        constructor(frameCount: number, perFrameTime: number = 0.03) {
            this.frameCount = frameCount;
            this.perFrameTime = perFrameTime;
        }
        public CompleteTime() {
            return this.frameCount * this.perFrameTime;
        }
    }


    export const allAnimationInfo: { [v: string]: any } = {
        dawnbreaker: {
            ACT_DOTA_CAST_ABILITY_1: new AnimationInfo(10, 0.01),
            ACT_DOTA_OVERRIDE_ABILITY_1: new AnimationInfo(54, 0.02),
            ACT_DOTA_CAST_ABILITY_1_END: new AnimationInfo(54),

            ACT_DOTA_CAST_ABILITY_2: new AnimationInfo(29),
            ACT_DOTA_OVERRIDE_ABILITY_2: new AnimationInfo(24),
            ACT_DOTA_CAST_ABILITY_2_END: new AnimationInfo(16),



        }
    }

    class CbInfo {
        public cb: Function;
        public wait(cb: Function) {
            this.cb = cb;
        }
        public run() {
            if (this.cb) {
                this.cb()
            }
            this.cb = null;
        }
    }
    export function play(baseNpc: CDOTA_BaseNPC, action: GameActivity_t): CbInfo {
        let _CbInfo = new CbInfo();
        let unitName: string = baseNpc.GetUnitName();
        let finishTime = 0;
        if (allAnimationInfo[unitName]) {
            finishTime = allAnimationInfo[unitName][GameActivity_t[action]]
        }
        baseNpc.StartGesture(action);
        TimerHelper.addTimer(finishTime, () => {
            _CbInfo.run()
        });
        return _CbInfo;
    }


}