/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { System_Avalon } from "../../game/system/System_Avalon";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { ChallengeShopItem } from "../Challenge/ChallengeShopItem";
import { DebugPanel } from "../debugPanel/DebugPanel";
import { TopBarPanel } from "../TopBarPanel/TopBarPanel";
import { MainPanel_UI } from "./MainPanel_UI";
export class MainPanel extends MainPanel_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        this.panel_allpanel.current!.hittest = false;
        this.panel_alldialog.current!.hittest = false;
    }
    onStartUI() {
        PlayerScene.Init();
        this.onRefreshUI();
    }

    onRefreshUI() {
        this.addOrShowOnlyNodeChild(this.NODENAME.__root__, ChallengeShopItem, {
            uiScale: "70% 70% 100%",
            marginRight: "0px",
            marginBottom: "0px",
            horizontalAlign: "right",
            verticalAlign: "bottom",
        });
    }
    /**debug */
    onbtn_click = () => {
        this.addOrShowOnlyNodeChild(this.NODENAME.__root__, DebugPanel);
        this.updateSelf();
    };

    public stagePos(panel: Panel) {
        let position = { x: 0, y: 0 };
        while (panel && panel !== this.__root__.current!) {
            position.x += panel.actualxoffset;
            position.y += panel.actualyoffset;
            panel = panel.GetParent()!;
        }
        return position;
    }
    public allPanelInMain: { [k: string]: BasePureComponent } = {};
    public allDialogInMain: { [k: string]: BasePureComponent } = {};

    async addOnlyPanel<T extends typeof BasePureComponent>(nodeType: T, zorder: number, nodeData: { [k: string]: any } = {}) {
        for (let k of Object.keys(this.allDialogInMain)) {
            let _zorder = parseInt(k);
            if (_zorder >= zorder) {
                this.allDialogInMain[k].close(true);
                delete this.allDialogInMain[k];
            }
        }
        let panel = await this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, nodeType, nodeData);
        this.allDialogInMain[zorder] = panel;
        return panel;
    }
    async addOnlyDialog<T extends typeof BasePureComponent>(nodeType: T, nodeData: { [k: string]: any } = {}) {
        let panel = await this.addOrShowOnlyNodeChild(this.NODENAME.panel_alldialog, nodeType, nodeData);
        return panel;
    }
}
