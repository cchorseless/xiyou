import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDOTAXP.less";

export interface ICCDOTAXP {

}

/** 闪光 */
export class CCDOTAXP extends CCPanel<ICCDOTAXP> {

    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_DOTAXP" ref={this.__root__}      {...this.initRootAttrs()}>
                <GenericPanel type="DOTAXP" id="xp" style={{ width: "45px" }} hittest={false} always-cache-composition-layer={true} require-composition-layer={true} />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}