import React, { } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDividerLine.less";

export interface IDividerLine {
    /** 默认样式 */
    type?: "Default" | "Tui3";
    isHorizontal?: boolean;
}

/** 分割线 */
export class CCDividerLine extends CCPanel<IDividerLine> {
    static defaultProps = {
        type: "Default",
        isHorizontal: true,
    }
    defaultClass() {
        return CSSHelper.ClassMaker("CC_DividerLine", this.props.type, {
            Horizontal: this.props.isHorizontal,
            Vertical: !this.props.isHorizontal
        });
    };
    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}