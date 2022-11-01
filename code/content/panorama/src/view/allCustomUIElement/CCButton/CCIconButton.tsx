import { PanelAttributes } from "@demon673/react-panorama";
import React, { Component } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCIconButton.less";


export interface ICCIconButton {
    /** 资源路径 */
    src?: string;
    /** 旋转角度 */
    rotate?: number;
    /** 是否有旋转动画，默认两秒 */
    spin?: boolean;
    /** 旋转动画时间，有该参数可以省略spin属性 */
    spinDuration?: number;
    /** wash-color */
    color?: string;
    /** 描边 */
    shadow?: boolean;
    /** 透明度 */
    opacity?: number;
    /** ICON */
    icon?: React.ReactNode;
}
export class CCIconButton extends CCPanel<ICCIconButton> {
    defaultClass = () => { return ("CC_IconButton"); };
    render() {
        return (
            this.__root___isValid &&
            <Button ref={this.__root__}      {...this.initRootAttrs()}>
                {this.props.icon}
                {this.props.children}
            </Button>
        );
    }
}