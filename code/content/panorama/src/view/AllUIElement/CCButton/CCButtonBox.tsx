import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import { ICCButton } from "./CCButton";
import "./CCButtonBox.less";


export interface ICCButtonBox extends ICCButton {
    /** 资源路径 */
    src?: string;
    /** 旋转角度 */
    rotate?: number;
    /** 是否有旋转动画，默认两秒 */
    spin?: boolean;
    /** 旋转动画时间，有该参数可以省略spin属性 */
    spinDuration?: number;
    /** 描边 */
    shadow?: boolean;
    /** 透明度 */
    opacity?: number;
}
export class CCButtonBox extends CCPanel<ICCButtonBox, Button> {
    defaultClass() { return CSSHelper.ClassMaker(this.props.className, "CCButtonBox", this.props.type, this.props.color) };
    static defaultProps = {
        type: "Tui3"
    }

    render() {
        return (
            <Button ref={this.__root__}      {...this.initRootAttrs()}>
                {this.props.children}
            </Button>
        );
    }
}