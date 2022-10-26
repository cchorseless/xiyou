import React, { createRef, PureComponent } from "react";
import { PanelAttributes, ImageAttributes, DOTAAbilityImageAttributes, LabelAttributes } from "@demon673/react-panorama";
import { BasePureComponent, NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../CCPanel/CCPanel";
import { CSSHelper } from "../../../helper/CSSHelper";
import "./CCLabel.less";


interface ICCLabelProps extends NodePropsData {
    /** 字体大小 */
    fontSize?: `${number}px`;
    /** 字体样式 */
    fontFamily?: "defaultFont" | "monospaceNumbersFont" | "titleFont" | "monospaceFont" | "diretideFont";
    /** 字体颜色 */
    color?: string,
    /** 预设样式 */
    type?: "Title" | "Normal" | "Money" | "Tip";
}


export class CCLabel extends CCPanel<ICCLabelProps, LabelPanel>{
    defaultClass = () => {
        return CSSHelper.ClassMaker("CC_Label", {
            CC_LabelTitle: this.props.type == "Title",
            CC_LabelNormal: this.props.type == "Normal",
            CC_LabelMoney: this.props.type == "Money",
            CC_LabelTip: this.props.type == "Tip",
        });
    };
    defaultStyle = () => {
        return {
            fontSize: this.props.fontSize,
            fontFamily: this.props.fontFamily,
            color: this.props.color,
        };
    };

    render() {
        return (
            this.__root___isValid &&
            <Label ref={this.__root__ as any} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.props.children}
                {this.__root___childs}
            </Label>
        );
    }
}
