import React from "react";

import { LabelAttributes } from "@demon673/react-panorama";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCLabel.less";


interface ICCLabelProps extends LabelAttributes {
    /** 字体大小 */
    fontSize?: `${number}px`;
    /** 字体样式 */
    fontFamily?: "defaultFont" | "monospaceNumbersFont" | "titleFont" | "monospaceFont" | "diretideFont";
    /** 字体颜色 */
    color?: string,
    /** 预设样式 */
    type?: "UnitName" | "Level" | "AbilityName" | "ItemName" | "Gold" | "Menu" | "Title" | "Normal" | "Money" | "Tip";
}


export class CCLabel extends CCPanel<ICCLabelProps, LabelPanel>{
    defaultClass() {
        return CSSHelper.ClassMaker("CC_Label", this.props.type);
    };
    defaultStyle() {
        return {
            fontSize: this.props.fontSize,
            fontFamily: this.props.fontFamily,
            color: this.props.color,
        };
    };

    static defaultProps = {
        type: "Normal"
    }

    render() {
        return (
            <Label ref={this.__root__ as any}  {...this.initRootAttrs()}  >
                {this.props.children}
                {this.__root___childs}
            </Label>
        );
    }
}
