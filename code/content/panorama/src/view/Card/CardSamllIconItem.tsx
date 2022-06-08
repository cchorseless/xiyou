/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { CardSamllIconItem_UI } from "./CardSamllIconItem_UI";
interface IProps {
    itemname: string;
}
export class CardSamllIconItem extends CardSamllIconItem_UI {
    // 初始化数据
    onStartUI() {
        this.onRefreshUI(this.props as IProps);
    }

    onRefreshUI(k: IProps) {
        CSSHelper.setBgImageUrl(this.img_cion, `card/card_icon/${k.itemname}.png`);
    }

    changePos(x: number, y: number) {
        this.__root__.current!.style.x = x + "px";
        this.__root__.current!.style.y = y + "px";
    }
}
