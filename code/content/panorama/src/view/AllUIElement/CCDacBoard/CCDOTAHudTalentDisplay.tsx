import React, { } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCPanel } from "../CCPanel/CCPanel";

export interface ICCDOTAHudTalentDisplay {

}

export class CCDOTAHudTalentDisplay extends CCPanel<ICCDOTAHudTalentDisplay> {

    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_DOTAHudTalentDisplay" ref={this.__root__}      {...this.initRootAttrs()}>
                <GenericPanel type="DOTAHudTalentDisplay" id="StatBranch" className="ShowStatBranch" />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}