
import React, { createRef, PureComponent } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { BaseEasyPureComponent, BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { CCDacBoard } from "../allCustomUIElement/CCDacBoard/CCDacBoard";
import { CCMiniMap } from "../allCustomUIElement/CCMiniMap/CCMiniMap";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCChallengeShopPanel } from "../Challenge/CCChallengeShopPanel";
import { CCCombinationBottomPanel } from "../Combination/CCCombinationBottomPanel";
import { CCPlayerListPanel } from "../Player/CCPlayerListPanel";
import { CCShopPanel } from "../Shop/CCShopPanel";
import { CCTopBarCenter, CCTopBarGameCoin } from "../TopBarPanel/CCTopBarPanel";


export class CCMainPanel extends CCPanel<NodePropsData> {
    panel_base: React.RefObject<Panel>;
    panel_allpanel: React.RefObject<Panel>;
    panel_alldialog: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', panel_base: 'panel_base', panel_allpanel: 'panel_allpanel', panel_alldialog: 'panel_alldialog', };

    onInitUI() {
        this.panel_base = createRef<Panel>();
        this.panel_allpanel = createRef<Panel>();
        this.panel_alldialog = createRef<Panel>();
    };


    panel_base_isValid: boolean = true;
    panel_base_childs: Array<JSX.Element> = [];
    panel_allpanel_isValid: boolean = true;
    panel_allpanel_childs: Array<JSX.Element> = [];
    panel_alldialog_isValid: boolean = true;
    panel_alldialog_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} className="CC_root" hittest={false} {...this.initRootAttrs()}>
                {this.panel_base_isValid &&
                    <Panel ref={this.panel_base} className="CC_root" hittest={false}>
                        <CCMenuNavigation
                            list={["setting", "mail", "store", "battlepass", "draw", "handbook"]}
                            onToggle={this.onMenuNavigationToggle} />
                        <CCTopBarCenter />
                        <CCTopBarGameCoin />
                        <CCPlayerListPanel />
                        <CCMiniMap />
                        <CCCombinationBottomPanel />
                        <CCChallengeShopPanel />
                        <CCDacBoard />
                        {this.panel_base_childs}
                    </Panel>
                }
                {this.panel_allpanel_isValid &&
                    <Panel ref={this.panel_allpanel} className="CC_root" hittest={false}>
                        {this.panel_allpanel_childs}
                    </Panel>
                }
                {this.panel_alldialog_isValid &&
                    <Panel ref={this.panel_alldialog} className="CC_root" hittest={false}>
                        {this.panel_alldialog_childs}
                    </Panel>
                }
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

    private onMenuNavigationToggle = (menuName: string, state: boolean) => {
        CCShopPanel.GetInstance()?.close();
        if (state) {
            if (menuName == "store") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCShopPanel, {
                    type: "Tui3"
                    // marginTop: "100px",
                } as any)
            }
        }
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
    //#region tooltips
    private CustomToolTip: BaseEasyPureComponent | null;
    private HideToolTipFunc: (() => void) | null;
    private UpdateToolTipPos(bindpanel: Panel, layoutleftRight: boolean) {
        const offset = 20;
        let pos = this.stagePos(bindpanel);
        let panelsize = CSSHelper.getPanelSize(bindpanel);
        let panelwidth = panelsize[0];
        let panelheight = panelsize[1];
        let windowsize = CSSHelper.getPanelSize(this.__root__.current!);
        let windowwidth = windowsize[0];
        let windowheight = windowsize[1];
        let isleft = pos.x <= windowwidth / 2;
        let istop = pos.y <= windowheight / 2;
        let setPosFunc = () => {
            let dialogpanel = this.CustomToolTip!.__root__.current!;
            let posdialog = { x: 0, y: 0 };
            let size = CSSHelper.getPanelSize(dialogpanel);
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
        }
        setPosFunc();
        let tasktimer = TimerHelper.AddIntervalTimer(0.1, 0.1, FuncHelper.Handler.create(this, () => {
            let issizevalid = this.CustomToolTip?.__root__.current?.IsSizeValid();
            if (issizevalid) {
                tasktimer.Clear();
                setPosFunc();
            }
            else if (issizevalid == null) {
                tasktimer.Clear();
            }

        }), 10);
    }
    /**显示tooltip弹窗 */
    public async ShowCustomToolTip<M extends NodePropsData, T extends typeof CCPanel<M>>(bindpanel: Panel, dialoginfo: { tipTypeClass: T, props: M | any, layoutleftRight: boolean }) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        if (dialoginfo.tipTypeClass == null) { return };
        let tipTypeClass = dialoginfo.tipTypeClass;
        let obj = dialoginfo.props || {};
        let layoutleftRight = dialoginfo.layoutleftRight || false;
        let isinrange = true;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.style.brightness = brightness + 0.5 + "";
        let newtip = await this.addNodeChildAsyncAt<M, T>(this.NODENAME.panel_alldialog, tipTypeClass, obj);
        if (!isinrange) {
            newtip?.close();
            return;
        }
        this.HideToolTip();
        this.CustomToolTip = newtip;
        this.UpdateToolTipPos(bindpanel, layoutleftRight);
        this.HideToolTipFunc = () => {
            isinrange = false;
            bindpanel.style.brightness = brightness + "";
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
                this.updateSelf();
            }
        };
    }
    /**注册tooltip弹窗事件 */
    public RegCustomToolTip<M extends NodePropsData, T extends typeof CCPanel<M>>(bindpanel: Panel, tipTypeClass: T, attrFunc: (() => { [k: string]: any } | void) | null = null, layoutleftRight: boolean = false) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        let isinrange = false;
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
            let newtip = await this.addNodeChildAsyncAt<M, T>(this.NODENAME.panel_alldialog, tipTypeClass, obj);
            if (!isinrange) {
                newtip.close();
                return;
            }
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
            }
            this.CustomToolTip = newtip;
            this.UpdateToolTipPos(bindpanel, layoutleftRight)
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
    public RegTextToolTip(bindpanel: Panel, attrFunc: (() => string | void)) {
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
    public RegTitleTextToolTip(bindpanel: Panel, attrFunc: (() => { title: string, tip: string } | void)) {
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
    /**隐藏tooltip弹窗事件 */
    public HideToolTip() {
        if (this.HideToolTipFunc) {
            this.HideToolTipFunc();
            this.HideToolTipFunc = null;
        }
    }
    //#endregion


    private allPanelInMain: { [k: string]: BaseEasyPureComponent[] } = {};
    async addOnlyPanel<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeType: T, nodeData: M | any = {}, zorder: number = -1) {
        if (zorder > -1) {
            for (let k of Object.keys(this.allPanelInMain)) {
                let _zorder = parseInt(k);
                if (_zorder > zorder) {
                    this.allPanelInMain[k].forEach(c => c.close(true));
                    delete this.allPanelInMain[k];
                }
            }
        }
        let panel = await this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, nodeType, nodeData);
        this.allPanelInMain[zorder] = this.allPanelInMain[zorder] || [];
        for (let i = 0, len = this.allPanelInMain[zorder].length; i < len; i++) {
            let comp = this.allPanelInMain[zorder][i];
            if (comp && comp.IsRegister == false) {
                this.allPanelInMain[zorder].splice(i, 1);
                i--;
                len--;
            }
        }
        this.allPanelInMain[zorder].push(panel);
        return panel;
    }



}