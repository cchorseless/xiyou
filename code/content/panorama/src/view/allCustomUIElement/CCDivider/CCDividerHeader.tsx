import React, { } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDividerHeader.less";
export interface ICCDividerHeader {
}

/** 分割线 */
export class CCDividerHeader extends CCPanel<ICCDividerHeader> {
    defaultClass() { return CSSHelper.ClassMaker("CC_DividerHeader"); };
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