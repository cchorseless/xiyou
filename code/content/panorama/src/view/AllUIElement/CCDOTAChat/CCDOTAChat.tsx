import React, { } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
// import "./CCDOTAChat.less";

export interface ICCDOTAChat {
    chatstyle?: "hudpregame" | string
}

/** 分割线 */
export class CCDOTAChat extends CCPanel<ICCDOTAChat> {
    static defaultProps = {
        chatstyle: "hudpregame"
    }

    render() {
        const chatstyle = this.props.chatstyle;
        return (
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                <GenericPanel type="DOTAChat" chatstyle={chatstyle} />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        )
    }
}