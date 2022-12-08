/** Create By Editor*/
import React, { createRef, useState } from "react";

import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CombinationDesItem_UI } from "./CombinationDesItem_UI";
interface IProps extends NodePropsData {
    activecount: number;
    effect: string;
}
export class CombinationDesItem extends CombinationDesItem_UI<IProps> {
    // 初始化数据
    onStartUI() {
        this.onRefreshUI();
    }

    onRefreshUI() {
        const p = this.props;
        if (!p.activecount || !p.effect) {
            return;
        }
        this.lbl_des0.current!.text = `(${p.activecount})`;
        CSSHelper.setLocalText(this.lbl_des, p.effect);
    }
}
