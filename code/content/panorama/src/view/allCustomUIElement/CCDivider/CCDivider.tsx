import React, { } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDivider.less";
export interface ICCDivider {
    /** 默认样式 */
    defaultClass?: "Default";
}

/** 分割线 */
export class CCDivider extends CCPanel<ICCDivider> {
    defaultClass = () => { return CSSHelper.ClassMaker("EOM_Divider", this.props.defaultClass); };
    render() {
        return (
            <Panel  {...this.initRootAttrs()}>
                {this.props.children}
            </Panel>
        );
    }
}