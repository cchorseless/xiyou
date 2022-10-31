import React, { createRef, PureComponent } from "react";
import { DOTAParticleScenePanelAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { TimerHelper } from "../../../helper/TimerHelper";
import { FuncHelper } from "../../../helper/FuncHelper";

interface ICCAbilityList extends NodePropsData {
}

export class CCAbilityList extends CCPanel<ICCAbilityList> {
    render() {
        return (
            this.__root___isValid && (
                <GenericPanel type="DOTAAbilityList" id={"abilities"} ref={this.__root__}  {...this.initRootAttrs()}>
                    {this.props.children}
                    {this.__root___childs}
                </GenericPanel>
            )
        );
    }
    onStartUI() {
        TimerHelper.AddTimer(
            0.1,
            FuncHelper.Handler.create(this, () => {
                for (let i = 7; i < 15; i++) {
                    let panel = this.__root__.current!.FindChild("Ability" + i);
                    if (panel) {
                        panel.style.width = "0px";
                        panel.visible = false;
                    }
                }
                this.__root__.current!.visible = true;
            })
        );
    }
}