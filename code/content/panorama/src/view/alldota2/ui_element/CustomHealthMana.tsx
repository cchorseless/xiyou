import React from "react";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CustomHealthMana_UI } from "./CustomHealthMana_UI";

export class CustomHealthMana extends CustomHealthMana_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panel = $.CreatePanel("DOTAHealthMana", this.__root__.current!, "health_mana");
        if (panel) {
            panel.style.width = "100%";
            panel.FindChildTraverse("HealthManaContainer")!.style.marginLeft = "0px";
            panel.FindChildTraverse("HealthManaContainer")!.style.marginRight = "0px";
        }
    }
    onStartUI() {}
}
