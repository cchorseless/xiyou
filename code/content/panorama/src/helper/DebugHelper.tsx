import { GameEnum } from "../../../scripts/tscripts/shared/GameEnum";
import { BasePureComponentSystem } from "../libs/BasePureComponent";

export module DebugHelper {
    export let IsDebug = true;

    /**
     * 打印组件数量统计
     * @param p
     * @returns
     */
    function debug_LoggerComponentinfo() {
        if (!DebugHelper.IsDebug) { return }
        GTimerHelper.AddTimer(1, GHandler.create(DebugHelper, () => {
            let data = {} as any;
            let count = 0;
            for (let k in BasePureComponentSystem.AllBasePureComp) {
                let _c = BasePureComponentSystem.AllBasePureComp[k];
                data[_c.constructor.name] = data[_c.constructor.name] || 0;
                data[_c.constructor.name] += 1;
                count += 1;
            }
            // LogHelper.warn("AllComponentCount:", count)
            // LogHelper.warn("AllComponentInfo:", data)
            return 10
        }));
    }

    /**
     * 打印事件
     */
    function printGameEvent() {
        for (let k in GameEnum.GameEvent) {
            let eventName = (GameEnum.GameEvent as any)[k]
            if (eventName) {
                GameEvents.Subscribe(eventName, (e) => {
                    // LogHelper.print(eventName,e);
                    if (k == GameEnum.GameEvent.dota_player_update_query_unit) {
                        // LogHelper.print(Players.GetLocalPlayerPortraitUnit());
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

