import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCImageProps extends NodePropsData {
    /** 默认资源路径 */
    defaultsrc?: string;
    /** 旋转角度 */
    rotate?: number;
}
export class CCImage extends CCPanel<ICCImageProps, ImagePanel>{
    defaultClass = () => { return "CC_Image"; };
    defaultStyle = () => {
        return {
            preTransformRotate2d: (this.props.rotate != undefined) ? this.props.rotate + "deg" : undefined,
        };
    };

    render() {
        return (
            this.__root___isValid &&
            <Image ref={this.__root__ as any}    {...this.initRootAttrs()}>
                {this.props.children}
                {this.__root___childs}
            </Image>
        );
    }
}
