import React, { createRef, PureComponent } from "react";
import { PanelAttributes, ImageAttributes, DOTAAbilityImageAttributes, LabelAttributes } from "@demon673/react-panorama";
import { BasePureComponent, NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCImageProps extends NodePropsData {
    /** 默认资源路径 */
    defaultsrc?: string;
    /** 旋转角度 */
    rotate?: number;
}
export class CCImage extends CCPanel<ICCImageProps, ImagePanel>{
    defaultClass = () => { return CSSHelper.ClassMaker("CC_Image"); };
    defaultStyle = () => {
        return {
            preTransformRotate2d: (this.props.rotate != undefined) ? this.props.rotate + "deg" : undefined,
        };
    };

    render() {
        return (
            this.__root___isValid &&
            <Image ref={this.__root__ as any} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.props.children}
                {this.__root___childs}
            </Image>
        );
    }
}
