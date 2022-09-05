/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { System_Avalon } from "../../game/system/System_Avalon";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { CustomMiniMap } from "../alldota2/minimap_plus/CustomMiniMap";
import { Minimap_plus } from "../alldota2/minimap_plus/Minimap_plus";
import { CustomAbilityList } from "../alldota2/ui_element/CustomAbilityList";
import { CustomAbilityPanel } from "../alldota2/ui_element/CustomAbilityPanel";
import { CustomHealthMana } from "../alldota2/ui_element/CustomHealthMana";
import { CustomInventory } from "../alldota2/ui_element/CustomInventory";
import { CustomPortrait } from "../alldota2/ui_element/CustomPortrait";
import { CustomPortraitGroup } from "../alldota2/ui_element/CustomPortraitGroup";
import { CustomStats } from "../alldota2/ui_element/CustomStats";
import { ChallengeShopItem } from "../Challenge/ChallengeShopItem";
import { DacBoardPanelV0 } from "../Common/DacBoardPanelV0";
import { DebugPanel } from "../debugPanel/DebugPanel";
import { ShopTopRightPanel } from "../Shop/ShopTopRightPanel";
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
        TimerHelper.AddTimer(
            1,
            FuncHelper.Handler.create(this, () => {
                this.onRefreshUI();
            })
        );
    }

    onRefreshUI() {
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, TopBarPanel, { 
            
         });


        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, ChallengeShopItem, {
            uiScale: "70% 70% 100%",
            marginRight: "0px",
            marginBottom: "0px",
            horizontalAlign: "right",
            verticalAlign: "bottom",
        });
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, ShopTopRightPanel, {
            horizontalAlign: "left",
            verticalAlign: "top",
            marginTop: "100px",
            marginLeft: "10px",
        });
        // 小地图
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, CustomMiniMap, {
            horizontalAlign: "left",
            verticalAlign: "bottom",
            // marginBottom: "10px",
            // marginLeft: "10px",
        });
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, DacBoardPanelV0, {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            // marginBottom: "10px",
            // marginLeft: "10px",
        });
        this.updateSelf();
    }
    /**debug */
    onbtn_click = () => {
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, DebugPanel);
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
