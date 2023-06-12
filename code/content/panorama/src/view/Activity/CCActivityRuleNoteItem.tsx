import React from "react";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCActivityRuleNoteItem.less";


interface ICCActivityRuleNoteItem {
    str: string,
}

export class CCActivityRuleNoteItem extends CCPanel<ICCActivityRuleNoteItem> {

    render() {
        const str = this.props.str || "";
        return <Panel className={"CCActivityRuleNoteItem"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCLabel type="Title" text={`活动规则`} horizontalAlign="center" marginTop={"15px"} />
            <CCPanel id="RuleNoteDiv" width="80%" height="80%" horizontalAlign="center" marginTop={"50px"}>
                <Label id="RuleDes" html={true} text={str} />
            </CCPanel>
        </Panel>
    }
}
