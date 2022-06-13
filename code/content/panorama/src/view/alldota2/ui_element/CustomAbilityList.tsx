import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CustomAbilityList_UI } from "./CustomAbilityList_UI";

export class CustomAbilityList extends CustomAbilityList_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panel = $.CreatePanelWithProperties("DOTAAbilityList", this.__root__.current!, "abilities", {});
        if (panel) {
            this.abilityList = panel;
        }
        this.__root__.current!.visible = false;
    }
    abilityList: Panel;
    onStartUI() {
        TimerHelper.AddTimer(
            0.1,
            FuncHelper.Handler.create(this, () => {
                for (let i = 7; i < 15; i++) {
                    let panel = this.abilityList.FindChild("Ability" + i);
                    if (panel) {
                        panel.style.width = "0px";
                        panel.visible = false;
                    }
                }
                this.__root__.current!.visible = true;
            })
        );
    }
}
