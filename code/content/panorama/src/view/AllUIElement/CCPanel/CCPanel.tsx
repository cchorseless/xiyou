import { PanelAttributes } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { BasePureComponent, BasePureComponentSystem } from "../../../libs/BasePureComponent";
import { CCMainPanel } from "../../MainPanel/CCMainPanel";

type CC_PanelScroll = "clip" | "noclip" | "none" | "squish" | "scroll";


export interface dialogTooltipInfo<M extends NodePropsData, T extends typeof CCPanel<M>> {
    cls: T,
    props?: M | any,
    posRight?: boolean
}

interface ICCPanelProps extends NodePropsData {
    /** 宽 */
    width?: "fit-children" | `fill-parent-flow(${number})` | `height-percentage(${number}%)` | `${number}px` | `${number}%` | string;
    /** 高 */
    height?: "fit-children" | `fill-parent-flow(${number})` | `width-percentage(${number}%)` | `${number}px` | `${number}%` | string;
    /** 子元素排列方式 */
    flowChildren?: "right" | "right-wrap" | "down" | "down-wrap" | "left" | "left-wrap" | "up" | "up-wrap" | "none" | undefined,
    /** 对齐方式 */
    verticalAlign?: "top" | "bottom" | "middle" | "center",
    horizontalAlign?: "left" | "right" | "middle" | "center",
    align?: "left top" | "left center" | "left bottom" | "center top" | "center center" | "center bottom" | "right top" | "right center" | "right bottom",
    /**文本tooltip */
    tooltip?: string;
    titleTooltip?: { title: string; tip: string };
    dialogTooltip?: dialogTooltipInfo<any, any>;
    /** 滚动方向 */
    scroll?: "x" | "y" | "both" | CC_PanelScroll | [CC_PanelScroll, CC_PanelScroll] | undefined,
}
export class CCPanel<T = {}, P extends Panel = Panel> extends BasePureComponent<ICCPanelProps & T & Omit<PanelAttributes, "ref">, P>{

    static GetInstanceByOnlyKey(__onlykey__: string) {
        return BasePureComponentSystem.GetBasePureComp(__onlykey__);
    }

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<P>();
        this.__root___isValid = this.onReady();
        if (this.__root___isValid) {
            this.onInitUI();
        }
        else {
            this.checkDataReady()
        }
    }
    private checkDataReady() {
        const isReady = this.onReady();
        if (isReady) {
            // 保证先initUI完成后，render才刷新。不会由于onInitUI 出发rerender
            this.onInitUI();
            this.__root___isValid = true
            this.updateSelf();
        }
        else {
            this.__root___isValid = false;
            GTimerHelper.AddFrameTimer(5, GHandler.create(this, () => { this.checkDataReady() }))
        }
    }


    defaultClass() { return ""; };
    defaultStyle(): Partial<ICCPanelProps & VCSSStyleDeclaration & T & Omit<PanelAttributes, "ref">> | any { return {}; };
    __root___isValid: boolean;
    __root___childs: Array<JSX.Element> = [];

    initRootAttrs() {
        let r: any = { style: {} };
        let ignoreKey = ["style", "children", "ref"];
        let _defaultstyle = this.defaultStyle();
        if (_defaultstyle) {
            for (let k in _defaultstyle) {
                if (ignoreKey.includes(k)) { continue; }
                if (CSSHelper.IsCssStyle(k)) {
                    r.style[k] = _defaultstyle[k];
                }
                else {
                    r[k] = _defaultstyle[k];
                }
            }
        }
        for (let k in this.props) {
            if (ignoreKey.includes(k)) { continue; }
            if (CSSHelper.IsCssStyle(k)) {
                r.style[k] = this.props[k];
            }
            else {
                r[k] = this.props[k];
            }
        }
        let clsname = CSSHelper.ClassMaker(this.defaultClass(), this.props.className);
        if (clsname != "") {
            r.className = clsname;
        }
        if (r.scroll) {
            switch (r.scroll) {
                case "x":
                    r.style.overflow = "scroll squish";
                    break;
                case "y":
                    r.style.overflow = "squish scroll";
                    break;
                case "both":
                    r.style.overflow = "scroll scroll";
                    break;
                case "none" || ["none", "none"]:
                    r.style.overflow = "squish squish";
                    break;
                default:
                    break;
            }
            delete r.scroll;
        }
        if (r.tooltip || r.titleTooltip || r.dialogTooltip) {
            r.onmouseover = (self: P) => {
                if (r.tooltip) {
                    $.DispatchEvent("DOTAShowTextTooltip", self, r.tooltip);
                }
                else if (r.titleTooltip) {
                    $.DispatchEvent("DOTAShowTitleTextTooltip", self, r.titleTooltip.title, r.titleTooltip.tip);
                }
                else if (r.dialogTooltip) {
                    let ccMainPanel = CCPanel.GetInstanceByName<CCMainPanel>("CCMainPanel");
                    ccMainPanel?.ShowCustomToolTip(self, r.dialogTooltip);
                }
            };
            r.onmouseout = (self: Panel) => {
                if (r.tooltip) {
                    $.DispatchEvent("DOTAHideTextTooltip", self);
                }
                else if (r.titleTooltip) {
                    $.DispatchEvent("DOTAHideTitleTextTooltip", self);
                }
                else if (r.dialogTooltip) {
                    let ccMainPanel = CCPanel.GetInstanceByName<CCMainPanel>("CCMainPanel");
                    ccMainPanel?.HideToolTip();
                }
            }
        }
        if (Object.keys(r.style).length == 0) {
            delete r.style;
        }
        return r;
    }

    defaultRender(id: string) {
        return <Panel id={id} ref={this.__root__}      {...this.initRootAttrs()} />
    }

    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}
