import React from "react";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CustomBuffList_UI } from "./CustomBuffList_UI";

export class CustomBuffList extends CustomBuffList_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panelbuff = $.CreatePanel("DOTABuffList", this.__root__.current!, "buffs");
        if (panelbuff) {
            panelbuff.style.flowChildren = "right-wrap";
            panelbuff.style.width = "50%";
            // panelbuff.FindChildTraverse("HealthManaContainer")!.style.marginLeft = "0px";
            // panelbuff.FindChildTraverse("HealthManaContainer")!.style.marginRight = "0px";
        }
        let paneldebuff = $.CreatePanel("DOTABuffList", this.__root__.current!, "debuffs");
        if (paneldebuff) {
            paneldebuff.style.flowChildren = "right-wrap";
            paneldebuff.style.width = "50%";
            // panelbuff.FindChildTraverse("HealthManaContainer")!.style.marginLeft = "0px";
            // panelbuff.FindChildTraverse("HealthManaContainer")!.style.marginRight = "0px";
        }
    }
    onStartUI() { }
}
