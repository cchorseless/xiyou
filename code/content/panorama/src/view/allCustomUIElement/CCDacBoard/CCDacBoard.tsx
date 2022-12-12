import React from "react";
import { CCAbilityList } from "../CCAbility/CCAbilityList";
import { CCInventory } from "../CCInventory/CCInventory";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCBuffList } from "./CCBuffList";
import { CCHealthMana } from "./CCHealthMana";
import { CCPortraitGroup } from "./CCPortraitGroup";
import { CCDOTAHudTalentDisplay } from "./CCDOTAHudTalentDisplay";
import { CCDOTAAghsStatusDisplay } from "./CCDOTAAghsStatusDisplay";
import "./CCDacBoard.less";
import { CSSHelper } from "../../../helper/CSSHelper";

interface ICCDacBoard {

}
export class CCDacBoard extends CCPanel<ICCDacBoard> {
    onReady() {
        return CSSHelper.IsReadyUI()
    }
    onInitUI() {
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_DacBoardPanel");
        }
        return (
            <Panel ref={this.__root__} id="CC_DacBoardPanel"  {...this.initRootAttrs()} hittest={false}>
                <Panel id="DacBoardLeft" hittest={false}>
                    <CCPortraitGroup particleAttrs={{}} align="right bottom" />
                </Panel>
                <CCPanel id="DacBoardCenter" minWidth={"300px"} hittest={false}>
                    <CCPanel id="DacBoardCenterBG" />
                    <CCPanel flowChildren="right" hittest={false}>
                        <CCAbilityList horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"50px"} />
                        <CCDOTAAghsStatusDisplay marginTop={"60px"} />
                    </CCPanel>
                    <CCHealthMana verticalAlign="bottom" marginBottom={"0px"} />
                    <CCBuffList horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"140px"} />
                </CCPanel>
                <Panel id="DacBoardRight" hittest={false}>
                    <CCInventory verticalAlign="bottom" marginBottom={"0px"} />
                </Panel>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}