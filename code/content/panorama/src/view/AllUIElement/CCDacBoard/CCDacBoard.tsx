import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCUnitScepterStatus } from "../../Unit/CCUnitScepterStatus";
import { CCUnitStatsDialog } from "../../Unit/CCUnitStatsDialog";
import { CCAbilityList2 } from "../CCAbility/CCAbilityList";
import { CCInventory } from "../CCInventory/CCInventory";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCTalentDisplayItem } from "../CCTalentBranch/CCTalentDisplayItem";
import { CCBuffList } from "./CCBuffList";
import "./CCDacBoard.less";
import { CCHealthMana } from "./CCHealthMana";
import { CCPortraitGroup } from "./CCPortraitGroup";

interface ICCDacBoard {
    type?: "Tui3" | "Style1";
    BShowBuffList: boolean;
    CurSelectUnit: EntityIndex;
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

        const isShowTalent = GJSONConfig.BuildingLevelUpConfig.get(Entities.GetUnitName(this.props.CurSelectUnit)) != null;

        return (
            <Panel ref={this.__root__} id="CC_DacBoardPanel"  {...this.initRootAttrs()} hittest={false}>
                {this.props.BShowBuffList && <CCBuffList horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"140px"} />}
                <CCPanel id="DacBoardBG" className={CSSHelper.ClassMaker(this.props.type)} />
                <CCPanel id="DacBoardDiv">
                    <Panel id="DacBoardLeft" hittest={false}>
                        <CCPortraitGroup CurSelectUnit={this.props.CurSelectUnit} particleAttrs={{}} align="right bottom" dialogTooltip={{ cls: CCUnitStatsDialog, posRight: false }} />
                    </Panel>
                    <CCPanel id="DacBoardCenter" hittest={false}>
                        <CCPanel flowChildren="right" hittest={false} verticalAlign="bottom" marginBottom={"60px"} >
                            {isShowTalent && <CCTalentDisplayItem CurSelectUnit={this.props.CurSelectUnit} />}
                            <CCAbilityList2 horizontalAlign={"center"} verticalAlign="center" />
                            {isShowTalent && <CCUnitScepterStatus CurSelectUnit={this.props.CurSelectUnit} />}
                        </CCPanel>
                        <CCHealthMana verticalAlign="bottom" marginBottom={"0px"} />
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