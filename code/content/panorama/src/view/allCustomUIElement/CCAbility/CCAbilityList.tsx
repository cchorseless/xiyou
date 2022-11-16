import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";

import "./CCAbilityList.less";
interface ICCAbilityList extends NodePropsData {
    noshowability?: number[];
}

export class CCAbilityList extends CCPanel<ICCAbilityList> {

    onStartUI() {
        this.hideAbility()
    }

    private hideAbility() {
        if (this.props.noshowability) {
            this.props.noshowability.forEach((i) => {
                let panel = this.__root__.current!.FindChild("Ability" + i);
                if (panel) {
                    panel.visible = false;
                }
            })
        }
    }
    render() {
        return (
            this.__root___isValid && (
                <GenericPanel type="DOTAAbilityList" id="abilities" ref={this.__root__}  {...this.initRootAttrs()}
                    onload={
                        (rootpanel) => {
                            this.hideAbility()
                        }
                    }>
                    {this.props.children}
                    {this.__root___childs}
                </GenericPanel>
            )
        );
    }

}