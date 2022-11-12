import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";

import "./CCAbilityList.less";
interface ICCAbilityList extends NodePropsData {
    noshowability?: number[];
}

export class CCAbilityList extends CCPanel<ICCAbilityList> {
    render() {
        return (
            this.__root___isValid && (
                <GenericPanel type="DOTAAbilityList" id="abilities" ref={this.__root__}  {...this.initRootAttrs()} onload={
                    (rootpanel) => {
                        if (this.props.noshowability) {
                            this.props.noshowability.forEach((i) => {
                                let panel = rootpanel.FindChild("Ability" + i);
                                if (panel) {
                                    panel.visible = false;
                                }
                            })
                        }
                    }
                }>
                    {this.props.children}
                    {this.__root___childs}
                </GenericPanel>
            )
        );
    }

}