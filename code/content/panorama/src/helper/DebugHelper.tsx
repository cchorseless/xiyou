import { BasePureComponent, BasePureComponentSystem } from "../libs/BasePureComponent";
import { GameEnum } from "../libs/GameEnum";
import { FuncHelper } from "./FuncHelper";
import { LogHelper } from "./LogHelper";
import { TimerHelper } from "./TimerHelper";

export module DebugHelper {
    export let IsDebug = true;

    /**
     * 打印组件数量统计
     * @param p
     * @returns
     */
    function debug_LoggerComponentinfo() {
        if (!DebugHelper.IsDebug) { return }
        TimerHelper.AddIntervalTimer(1, 10, FuncHelper.Handler.create(DebugHelper, () => {
            let data = {} as any;
            let count = 0;
            for (let k in BasePureComponentSystem.AllBasePureComp) {
                let _c = BasePureComponentSystem.AllBasePureComp[k];
                data[_c.constructor.name] = data[_c.constructor.name] || 0;
                data[_c.constructor.name] += 1;
                count += 1;
            }
            LogHelper.warn("AllComponentCount:", count)
            LogHelper.warn("AllComponentInfo:", data)
        }), -1);
    }

    /**
     * 打印事件
     */
    function printGameEvent() {
        for (let k in GameEnum.GameEvent) {
            let eventName = (GameEnum.GameEvent as any)[k]
            if (eventName) {
                // LogHelper.print(eventName)
                GameEvents.Subscribe(eventName, (e) => {
                    LogHelper.print(k);
                    if (k == GameEnum.GameEvent.dota_player_update_query_unit) {
                        LogHelper.print(Players.GetLocalPlayerPortraitUnit());
                    }
                })
            }
        }
    }

    /**初始化 */
    export function Init() {
        if (Game.IsInToolsMode()) {
            debug_LoggerComponentinfo();
            printGameEvent();
        }
    }
}