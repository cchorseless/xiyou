
import React, { createRef, PureComponent } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { BaseEasyPureComponent, BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { CCMiniMap } from "../allCustomUIElement/CCMiniMap/CCMiniMap";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { ShopPanel } from "../Shop/ShopPanel";
import { CCTopBarCenter, CCTopBarGameCoin } from "../TopBarPanel/CCTopBarPanel";


export class CCMainPanel extends CCPanel<NodePropsData> {
    __root__: React.RefObject<Panel>;
    panel_base: React.RefObject<Panel>;
    panel_allpanel: React.RefObject<Panel>;
    panel_alldialog: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', panel_base: 'panel_base', panel_allpanel: 'panel_allpanel', panel_alldialog: 'panel_alldialog', };

    constructor(props: NodePropsData) {
        super(props);
        this.__root__ = createRef<Panel>();
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
                        <CCMiniMap />
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
        if (menuName == "store") {
            if (state) {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, ShopPanel, {
                    marginTop: "100px",
                } as any)
                this.updateSelf();
            }
            else {
                ShopPanel.GetInstance()?.close()
            }
        }
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
    /**显示tooltip弹窗 */
    public async ShowCustomToolTip<M extends NodePropsData, T extends typeof CCPanel<M>>(bindpanel: Panel, dialoginfo: { tipTypeClass: T, props: M | any, layoutleftRight: boolean }) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        if (dialoginfo.tipTypeClass == null) { return };
        let tipTypeClass = dialoginfo.tipTypeClass;
        let obj = dialoginfo.props || {};
        let layoutleftRight = dialoginfo.layoutleftRight || false;
        let isinrange = false;
        const offset = 20;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.style.brightness = brightness + 0.5 + "";
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
        let pos = this.stagePos(bindpanel);
        let panelsize = CSSHelper.getPanelSize(bindpanel);
        let panelwidth = panelsize[0];
        let panelheight = panelsize[1];
        let windowsize = CSSHelper.getPanelSize(this.__root__.current!);
        let windowwidth = windowsize[0];
        let windowheight = windowsize[1];
        let isleft = pos.x <= windowwidth / 2;
        let istop = pos.y <= windowheight / 2;
        let dialogpanel = this.CustomToolTip!.__root__.current!;
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
            let pos = this.stagePos(bindpanel);
            let panelsize = CSSHelper.getPanelSize(bindpanel);
            let panelwidth = panelsize[0];
            let panelheight = panelsize[1];
            let windowsize = CSSHelper.getPanelSize(this.__root__.current!);
            let windowwidth = windowsize[0];
            let windowheight = windowsize[1];
            let isleft = pos.x <= windowwidth / 2;
            let istop = pos.y <= windowheight / 2;
            let dialogpanel = this.CustomToolTip!.__root__.current!;
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


    private allPanelInMain: { [k: string]: BaseEasyPureComponent } = {};
    async addOnlyPanel<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeType: T, zorder: number, nodeData: M | any = {}) {
        for (let k of Object.keys(this.allPanelInMain)) {
            let _zorder = parseInt(k);
            if (_zorder >= zorder) {
                this.allPanelInMain[k].close(true);
                delete this.allPanelInMain[k];
            }
        }
        let panel = await this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, nodeType, nodeData);
        this.allPanelInMain[zorder] = panel;
        return panel;
    }

}