/** Create By Editor*/
import React, { createRef, useState } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { MainPanel } from "../MainPanel/MainPanel";
import { ShopPanel } from "./ShopPanel";
import { ShopTopRightPanel_UI } from "./ShopTopRightPanel_UI";
export class ShopTopRightPanel extends ShopTopRightPanel_UI<NodePropsData> {

    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panel = $.CreatePanelWithProperties("DOTAAbilityButton", this.btn_shop.current!, "AbilityButton", {

        });
        panel.style.width = "100%";
        panel.style.height = "100%";
        panel.style.border = "2px solid #111111FF";
        // <DOTAItemImage id="ItemImage"  scaling="stretch-to-fit-x-preserve-aspect"  hittest={false} hittestchildren={false} />
        let panel2 = $.CreatePanelWithProperties("DOTAItemImage", panel, "ItemImage", {
            scaling: "stretch-to-fit-x-preserve-aspect"
        });
        panel2.style.width = "100%";
        panel2.style.height = "100%";
        this.updateSelf();
    }
    onbtn_shop = (...args: any[]) => {
        MainPanel.GetInstance()!.addOnlyPanel(ShopPanel, 2);
    };
}
