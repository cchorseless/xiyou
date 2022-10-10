/** Create By Editor*/
import React, { createRef, useState } from "react";

import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { CombinationDesItem_UI } from "./CombinationDesItem_UI";
interface IProps {
    activecount: number;
    effect: string;
}
export class CombinationDesItem extends CombinationDesItem_UI {
    // 初始化数据
    onStartUI() {
        this.onRefreshUI(this.props as IProps);
    }

    onRefreshUI(p: IProps) {
        if (!p.activecount || !p.effect) {
            return;
        }
        this.lbl_des0.current!.text = `(${p.activecount})`;
        CSSHelper.setLocalText(this.lbl_des, p.effect);
    }
}
