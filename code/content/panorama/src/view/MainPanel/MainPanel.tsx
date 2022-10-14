/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { System_Avalon } from "../../game/system/System_Avalon";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { CustomMiniMap } from "../alldota2/minimap_plus/CustomMiniMap";
import { ChallengeShopItem } from "../Challenge/ChallengeShopItem";
import { CombinationBottomPanel } from "../Combination/CombinationBottomPanel";
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
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, TopBarPanel);
        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, CombinationBottomPanel, {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            marginBottom: "200px",
            backgroundColor: "#FFFFFFFF",
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

    private CustomToolTip: BasePureComponent | null;
    AddCustomToolTip<T extends typeof BasePureComponent>(bindpanel: Panel, tipTypeClass: T, attrFunc: (() => { [k: string]: any } | void) | null = null, layoutleftRight: boolean = true) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        let isinrange = false;
        let brightness = Number(bindpanel.style.brightness);
        bindpanel.SetPanelEvent('onmouseover', async () => {
            let obj: any = {};
            if (attrFunc) {
                obj = attrFunc();
                // 有函数且返回null,不显示
                if (obj == null) {
                    return
                }
            }
            bindpanel.style.brightness = brightness + 0.5 + "";
            isinrange = true;
            let newtip = await this.addOnlyDialog(tipTypeClass, obj);
            if (!isinrange) {
                newtip.close();
                return;
            }
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
            }
            this.CustomToolTip = newtip;
            let pos = this.stagePos(bindpanel);
            let panelwidth = bindpanel.contentwidth;
            let panelheight = bindpanel.contentheight;
            let windowwidth = this.__root__.current!.contentwidth;
            let windowheight = this.__root__.current!.contentheight;
            let isleft = pos.x <= windowwidth / 2;
            let istop = pos.y <= windowheight / 2;
            let posdialog = { x: 0, y: 0 };
            let dialogpanel = this.CustomToolTip.__root__.current!;
            dialogpanel.visible = false;
            if (layoutleftRight) {
                if (isleft) {
                    posdialog.x = pos.x + panelwidth + 20;
                }
                else {
                    posdialog.x = pos.x - dialogpanel.contentwidth - 20;
                }
                posdialog.y = pos.y + panelheight / 2 - dialogpanel.contentheight / 2;
                if (posdialog.y < 0) {
                    posdialog.y = 0;
                }
            }
            else {
                if (istop) {
                    posdialog.y = pos.y + panelheight + 20;
                }
                else {
                    posdialog.y = pos.y - dialogpanel.contentheight - 20;
                }
                posdialog.x = pos.x + panelwidth / 2 - dialogpanel.contentwidth / 2;
                if (posdialog.x < 0) {
                    posdialog.x = 0;
                }
            }
            dialogpanel.SetPositionInPixels(posdialog.x, posdialog.y, 0);
            dialogpanel.visible = true;
        });
        bindpanel.SetPanelEvent('onmouseout', () => {
            isinrange = false;
            bindpanel.style.brightness = brightness + "";
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
            }
        })
    }
    AddTextToolTip(bindpanel: Panel, attrFunc: (() => string | void)) {
        if (!bindpanel) { return };
        let tipType = ToolTipHelper.ToolTipType.DOTAShowTextTooltip;
        let brightness = Number(bindpanel.style.brightness);
        bindpanel.SetPanelEvent('onmouseover', () => {
            let tips = attrFunc();
            if (tips) {
                bindpanel.style.brightness = brightness + 0.5 + "";
                $.DispatchEvent(tipType, bindpanel, tips);
            }
        });
        bindpanel.SetPanelEvent('onmouseout', () => {
            bindpanel.style.brightness = brightness + "";
            $.DispatchEvent(tipType.replace('Show', 'Hide'), bindpanel)
        })
    }
    AddTitleTextToolTip(bindpanel: Panel, attrFunc: (() => { title: string, tip: string } | void)) {
        if (!bindpanel) { return };
        let tipType = ToolTipHelper.ToolTipType.DOTAShowTitleTextTooltip;
        let brightness = Number(bindpanel.style.brightness);
        bindpanel.SetPanelEvent('onmouseover', () => {
            let data = attrFunc();
            if (data) {
                bindpanel.style.brightness = brightness + 0.5 + "";
                $.DispatchEvent(tipType, bindpanel, data.title, data.tip);
            }
        });
        bindpanel.SetPanelEvent('onmouseout', () => {
            bindpanel.style.brightness = brightness + "";
            $.DispatchEvent(tipType.replace('Show', 'Hide'), bindpanel)
        })
    }

}
