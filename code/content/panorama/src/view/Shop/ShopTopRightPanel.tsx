/** Create By Editor*/
import React, { createRef, useState } from "react";
import { MainPanel } from "../MainPanel/MainPanel";
import { ShopPanel } from "./ShopPanel";
import { ShopTopRightPanel_UI } from "./ShopTopRightPanel_UI";
export class ShopTopRightPanel extends ShopTopRightPanel_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
    }
    onbtn_shop = (...args: any[]) => {
        MainPanel.GetInstance()!.addOnlyPanel(ShopPanel, 2);
    };
}
