import { BasePureComponent } from "../libs/BasePureComponent";
import { TipsPanel } from "../view/TipsPanel/TipsPanel";

export module TipsHelper {

    /**
     * 显示tips
     * @returns
     */
    export function showTips(s: string, root: BasePureComponent) {
        if (!root) { return };
        root.addNodeChildAt(root.NODENAME.__root__, TipsPanel, {
            str: s
        })
        root.updateSelf();
    };

    export function showMessage(s: string, root: BasePureComponent) {
        if (!root) { return };
        root.addNodeChildAt(root.NODENAME.__root__, TipsPanel, {
            str: s
        })
        root.updateSelf();
    }

}