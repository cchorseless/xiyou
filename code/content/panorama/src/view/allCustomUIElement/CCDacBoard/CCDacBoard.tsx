import React from "react";
import { CCAbilityList } from "../CCAbility/CCAbilityList";
import { CCInventory } from "../CCInventory/CCInventory";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCBuffList } from "./CCBuffList";
import { CCHealthMana } from "./CCHealthMana";
import { CCPortraitGroup } from "./CCPortraitGroup";

import "./CCDacBoard.less";
import { CCDOTAHudTalentDisplay } from "./CCDOTAHudTalentDisplay";
import { CCDOTAAghsStatusDisplay } from "./CCDOTAAghsStatusDisplay";
import { CCInventorySlot } from "../CCInventory/CCInventorySlot";
import { InventorySlot } from "../CCInventory/AbilityPanel";

interface ICCDacBoard {

}
export class CCDacBoard extends CCPanel<ICCDacBoard> {
    onInitUI() {
    }

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DacBoardPanel"  {...this.initRootAttrs()} hittest={false}>
                <Panel id="DacBoardLeft" >
                    <CCPortraitGroup particleAttrs={{}} align="right bottom" />
                </Panel>
                <CCPanel id="DacBoardCenter" minWidth={"300px"}>
                    <CCPanel id="DacBoardCenterBG" />
                    <CCBuffList horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"140px"} />
                    <CCPanel flowChildren="right">
                        <CCAbilityList noshowability={[7, 8, 9, 10, 11, 12, 13]} horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"50px"} />
                        <CCDOTAAghsStatusDisplay marginTop={"60px"} />
                    </CCPanel>
                    <CCHealthMana verticalAlign="bottom" marginBottom={"0px"} />
                </CCPanel>
                <Panel id="DacBoardRight">
                    <InventorySlot id={"inventory_slot_" + 1} />
                </Panel>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}