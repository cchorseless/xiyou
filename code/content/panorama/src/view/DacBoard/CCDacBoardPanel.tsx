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
    defaultStyle = () => {
        return {
            horizontalAlign: "center"
        };
    }
    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DacBoardPanel"  {...this.initRootAttrs()} hittest={false}>
                <Panel id="DacBoardLeft">
                    <CCPortraitGroup particleAttrs={{}} />
                    <CCUnitStats />
                </Panel>
                <Panel id="DacBoardCenter">
                    <CCBuffList className="CCBuffList" />
                    <CCAbilityList className="CCAbilityList" />
                    <CCHealthMana />
                </Panel>
                <Panel id="DacBoardRight">
                    <CCInventory />
                </Panel>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}