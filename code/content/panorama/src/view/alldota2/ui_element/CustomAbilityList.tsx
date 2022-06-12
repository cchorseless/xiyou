import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CustomAbilityList_UI } from "./CustomAbilityList_UI";

export class CustomAbilityList extends CustomAbilityList_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panel = $.CreatePanelWithProperties("DOTAAbilityList", this.__root__.current!, "abilities", {
        });
        if (panel) {
            // panel.style.height = "72px";
        }
     
    }
    onStartUI() {
      
    }
}
