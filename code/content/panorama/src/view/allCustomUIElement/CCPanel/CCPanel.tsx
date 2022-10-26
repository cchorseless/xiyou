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
        let _defaultstyle = this.defaultStyle();
        if (_defaultstyle) {
            for (let k in _defaultstyle) {
                if ((this.CSS_0_0 as any)[k] == null) {
                    (this.CSS_0_0 as any)[k] = (_defaultstyle as any)[k];
                }
            }
        }
        this.__root___attrs.className = CSSHelper.ClassMaker(this.defaultClass(), props.className)
    }
    defaultClass = () => { return ""; };
    defaultStyle = (): Partial<T> => { return {}; };
    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    render() {
        this.__root___isValid &&
            <Panel ref={this.__root__}  {...this.props} style={this.CSS_0_0}    {...this.__root___attrs}>
                {this.props.children}
                {this.__root___childs}
            </Panel>
    }
}
