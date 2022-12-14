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
    type?: "Tui3" | "Style1";
}
export class CCDacBoard extends CCPanel<ICCDacBoard> {

    static defaultProps = {
        type: "Style1"
    }

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
                <CCPanel className={CSSHelper.ClassMaker("DacBoardBG", this.props.type)} />
                <CCPanel id="DacBoardDiv">
                    <Panel id="DacBoardLeft" hittest={false}>
                        <CCPortraitGroup particleAttrs={{}} align="right bottom" />
                    </Panel>
                    <CCPanel id="DacBoardCenter" minWidth={"300px"} hittest={false}>
                        <CCPanel flowChildren="right" hittest={false} verticalAlign="bottom" marginBottom={"60px"} >
                            <CCAbilityList horizontalAlign={"center"} verticalAlign="center" />
                            {/* <CCDOTAAghsStatusDisplay /> */}
                        </CCPanel>
                        <CCHealthMana verticalAlign="bottom" marginBottom={"0px"} />
                        <CCBuffList horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"140px"} />
                    </CCPanel>
                    <Panel id="DacBoardRight" hittest={false}>
                        <CCInventory verticalAlign="bottom" marginBottom={"0px"} />
                    </Panel>
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}