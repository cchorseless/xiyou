import React from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCAbilityList } from "../allCustomUIElement/CCAbility/CCAbilityList";
import { CCBuffList } from "../allCustomUIElement/CCBuffList/CCBuffList";
import { CCHealthMana } from "../allCustomUIElement/CCHealthMana/CCHealthMana";
import { CCInventory } from "../allCustomUIElement/CCInventory/CCInventory";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPortraitGroup } from "../allCustomUIElement/CCPortrait/CCPortrait";
import { CCUnitStats } from "../allCustomUIElement/CCUnitStats/CCUnitStats";
import "./CCDacBoardPanel.less";

interface ICCDacBoardPanel {

}
export class CCDacBoardPanel extends CCPanel<ICCDacBoardPanel> {
    onInitUI() {
    }

    render() {
        return (
            this.__root___isValid &&
            <CCPanel ref={this.__root__} id="CC_DacBoardPanel" horizontalAlign="center"  {...this.initRootAttrs()} hittest={false}>
                <CCPanel id="DacBoardLeft">
                    <CCPortraitGroup particleAttrs={{}} />
                    <CCUnitStats />
                </CCPanel>
                <CCPanel id="DacBoardCenter">
                    <CCBuffList />
                    <CCAbilityList />
                    <CCHealthMana />
                </CCPanel>
                <CCPanel id="DacBoardRight">
                    <CCInventory />
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </CCPanel >
        )
    }
}