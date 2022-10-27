import React, { createRef, PureComponent } from "react";
import { PanelAttributes, ImageAttributes, DOTAAbilityImageAttributes, LabelAttributes } from "@demon673/react-panorama";
import { BasePureComponent, NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";

interface ICCPanelProps extends NodePropsData {
}
export class CCPanel<T = {}, P extends Panel = Panel> extends BasePureComponent<ICCPanelProps & T & Omit<PanelAttributes, "ref">, P>{
    constructor(props: any) {
        super(props);
        this.__root__ = createRef<P>();
    }
    defaultClass = () => { return ""; };
    defaultStyle = (): Partial<ICCPanelProps & T & Omit<PanelAttributes, "ref">> => { return {}; };
    __root___isValid: boolean = true;
    __root___childs: Array<JSX.Element> = [];

    initRootAttrs() {
        let r: any = { style: {} };
        let ignoreKey = ["style", "children"];
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
        r.className = CSSHelper.ClassMaker(this.defaultClass(), this.props.className)
        return r;
    }

    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}
