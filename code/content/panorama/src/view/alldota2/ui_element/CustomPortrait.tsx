import React from "react";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CustomPortrait_UI } from "./CustomPortrait_UI";

export class CustomPortrait extends CustomPortrait_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        if (!this.props.hudType) {
           return 
        }
        let panel = $.CreatePanelWithProperties("DOTAPortrait", this.__root__.current!, this.props.hudType, {
            class: "PortraitLocation",
        });
        if (panel) {
            panel.SetParent(this.__root__.current!);
            panel.style.width = "100%";
            panel.style.height = "100%";
        }
    }
    onStartUI() {
        // this.__root__.current!.style.width="500px"
        // this.__root__.current!.style.height="500px"
    }
}
