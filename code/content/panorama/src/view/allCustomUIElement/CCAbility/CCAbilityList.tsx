import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";

import "./CCAbilityList.less";
import { CSSHelper } from "../../../helper/CSSHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CCMainPanel } from "../../MainPanel/CCMainPanel";
import { CCAbilityInfoDialog } from "./CCAbilityInfoDialog";
interface ICCAbilityList extends NodePropsData {
    noshowability?: number[];
}

export class CCAbilityList extends CCPanel<ICCAbilityList> {
    abilityList: React.RefObject<Panel>;
    onInitUI() {
        this.abilityList = createRef<Panel>();
    }
    onStartUI() {
        this.hideAbility()

    }
    private hideAbility() {
        let mainpanel = CCPanel.GetInstanceByName<CCMainPanel>("CCMainPanel");
        for (let i = 0; i < 15; i++) {
            let panel = this.abilityList.current!.FindChild("Ability" + i);
            if (panel == null) {
                break;
            }
            let abilityButton = panel.FindChildTraverse("AbilityButton")!;
            mainpanel.RegCustomToolTip(abilityButton, CCAbilityInfoDialog, () => {
                let selectedEntityid = Players.GetLocalPlayerPortraitUnit();;
                let abilityindex = Entities.GetAbility(selectedEntityid, i);
                return {
                    abilityname: Abilities.GetAbilityName(abilityindex),
                    castentityindex: selectedEntityid,
                    level: Abilities.GetLevel(abilityindex),
                }
            }, true)
            if (this.props.noshowability && this.props.noshowability.includes(i)) {
                panel.visible = false;
            }
        }

    }

    render() {
        return (
            this.__root___isValid && (
                <Panel id="CC_AbilityList" ref={this.__root__}  {...this.initRootAttrs()}>
                    <GenericPanel type="DOTAAbilityList" id="abilities" ref={this.abilityList}>
                    </GenericPanel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }

}