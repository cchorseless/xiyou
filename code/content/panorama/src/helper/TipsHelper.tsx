import { BaseEasyPureComponent } from "../libs/BasePureComponent";
import { TipsPanel } from "../view/TipsPanel/TipsPanel";

export module TipsHelper {
    /**
     * 显示tips
     * @returns
     */
    export function showTips(s: string, root: BaseEasyPureComponent) {
        if (!root) {
            return;
        }
        root.addNodeChildAt(root.NODENAME.__root__, TipsPanel, {
            str: s,
        });
        root.updateSelf();
    }

    export function showMessage(s: string, root: BaseEasyPureComponent) {
        if (!root) {
            return;
        }
        root.addNodeChildAt(root.NODENAME.__root__, TipsPanel, {
            str: s,
        });
        root.updateSelf();
    }

    export function showErrorMessage(msg: string, sound = "General.CastFail_Custom") {
        GameUI.SendCustomHUDError(msg, sound);
    }
}
