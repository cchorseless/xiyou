/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { BaseEasyPureComponent, BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { CombinationBottomPanel } from "../Combination/CombinationBottomPanel";
import { DacBoardPanelV0 } from "../Common/DacBoardPanelV0";
import { MainPanel_UI } from "./MainPanel_UI";
export class MainPanel extends MainPanel_UI<NodePropsData> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        DotaUIHelper.addDragTargetClass(this.panel_base.current!, "panel_base");
        this.panel_allpanel.current!.hittest = false;
        this.panel_alldialog.current!.hittest = false;
    }
    onStartUI() {
        this.onRefreshUI();
    }

    onRefreshUI() {
        this.addOnlyOneNodeChild(this.NODENAME.panel_base, CombinationBottomPanel, {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            marginBottom: "200px",
            // backgroundColor: "#FFFFFFFF",
        } as any);


        this.addOrShowOnlyNodeChild(this.NODENAME.panel_base, DacBoardPanelV0, {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            // marginBottom: "10px",
            // marginLeft: "10px",
        } as any);
        this.updateSelf();
    }

    public stagePos(panel: Panel) {
        let position = { x: 0, y: 0 };
        while (panel && panel !== this.__root__.current!) {
            position.x += panel.actualxoffset;
            position.y += panel.actualyoffset;
            panel = panel.GetParent()!;
        }
        position.x = position.x / (this.__root__.current!.actualuiscale_x || 1);
        position.y = position.y / (this.__root__.current!.actualuiscale_y || 1);
        return position;
    }
    public allPanelInMain: { [k: string]: BaseEasyPureComponent } = {};
    public allDialogInMain: { [k: string]: BaseEasyPureComponent } = {};

    async addOnlyPanel<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeType: T, zorder: number, nodeData: M | any = {}) {
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
    async addOnlyDialog<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeType: T, nodeData: M | any = {}) {
        let panel = await this.addOrShowOnlyNodeChild(this.NODENAME.panel_alldialog, nodeType, nodeData);
        return panel;
    }

    private CustomToolTip: BaseEasyPureComponent | null;
    private HideToolTipFunc: (() => void) | null;
    public AddCustomToolTip<M extends NodePropsData, T extends typeof BasePureComponent<M>>(bindpanel: Panel, tipTypeClass: T, attrFunc: (() => { [k: string]: any } | void) | null = null, layoutleftRight: boolean = false) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        let isinrange = false;
        const offset = 20;
        let brightness = Number(bindpanel.style.brightness) || 1;
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
            let panelsize = CSSHelper.getPanelSize(bindpanel);
            let panelwidth = panelsize[0];
            let panelheight = panelsize[1];
            let windowsize = CSSHelper.getPanelSize(this.__root__.current!);
            let windowwidth = windowsize[0];
            let windowheight = windowsize[1];
            let isleft = pos.x <= windowwidth / 2;
            let istop = pos.y <= windowheight / 2;
            let dialogpanel = this.CustomToolTip.__root__.current!;
            dialogpanel.visible = false;
            let posdialog = { x: 0, y: 0 };
            let size = CSSHelper.getPanelSize(dialogpanel)
            let dialogwidth = size[0];
            let dialogheight = size[1];
            if (layoutleftRight) {
                if (isleft) {
                    posdialog.x = pos.x + panelwidth + offset;
                }
                else {
                    posdialog.x = pos.x - dialogwidth - offset;
                }
                posdialog.y = pos.y + panelheight / 2 - dialogheight / 2;
                if (posdialog.y < 0) {
                    posdialog.y = 0;
                }
                else if (posdialog.y + dialogheight > windowheight) {
                    posdialog.y = windowheight - dialogheight;
                }
            }
            else {
                if (istop) {
                    posdialog.y = pos.y + panelheight + offset;
                }
                else {
                    posdialog.y = pos.y - dialogheight - offset;
                }
                posdialog.x = pos.x + panelwidth / 2 - dialogwidth / 2;
                if (posdialog.x < 0) {
                    posdialog.x = 0;
                }
            }
            dialogpanel.SetPositionInPixels(posdialog.x, posdialog.y, 0);
            dialogpanel.visible = true;
            this.HideToolTipFunc = hideFunc;
        });
        let hideFunc = () => {
            isinrange = false;
            bindpanel.style.brightness = brightness + "";
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
                this.updateSelf();
            }
        };
        bindpanel.SetPanelEvent('onmouseout', hideFunc)
    }
    public AddTextToolTip(bindpanel: Panel, attrFunc: (() => string | void)) {
        if (!bindpanel) { return };
        let tipType = ToolTipHelper.ToolTipType.DOTAShowTextTooltip;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.SetPanelEvent('onmouseover', () => {
            let tips = attrFunc();
            if (tips) {
                bindpanel.style.brightness = brightness + 0.5 + "";
                $.DispatchEvent(tipType, bindpanel, tips);
                this.HideToolTipFunc = hideFunc;
            }
        });
        let hideFunc = () => {
            bindpanel.style.brightness = brightness + "";
            $.DispatchEvent(tipType.replace('Show', 'Hide'), bindpanel)
        }
        bindpanel.SetPanelEvent('onmouseout', hideFunc)
    }
    public AddTitleTextToolTip(bindpanel: Panel, attrFunc: (() => { title: string, tip: string } | void)) {
        if (!bindpanel) { return };
        let tipType = ToolTipHelper.ToolTipType.DOTAShowTitleTextTooltip;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.SetPanelEvent('onmouseover', () => {
            let data = attrFunc();
            if (data) {
                bindpanel.style.brightness = brightness + 0.5 + "";
                $.DispatchEvent(tipType, bindpanel, data.title, data.tip);
                this.HideToolTipFunc = hideFunc;
            }
        });
        let hideFunc = () => {
            bindpanel.style.brightness = brightness + "";
            $.DispatchEvent(tipType.replace('Show', 'Hide'), bindpanel)
        };
        bindpanel.SetPanelEvent('onmouseout', hideFunc)
    }

    public HideToolTip() {
        if (this.HideToolTipFunc) {
            this.HideToolTipFunc();
            this.HideToolTipFunc = null;
        }
    }
}
