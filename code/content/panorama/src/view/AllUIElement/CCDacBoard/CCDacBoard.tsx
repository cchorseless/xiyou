import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPlayerInfoDialog } from "../../Player/CCPlayerInfoDialog";
import { CCUnitStatsDialog } from "../../Unit/CCUnitStatsDialog";
import { CCAbilityList2 } from "../CCAbility/CCAbilityList";
import { CCInventory } from "../CCInventory/CCInventory";
import { CCPanel } from "../CCPanel/CCPanel";
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
        const IsCustomCourier = Entities.IsCustomCourier(this.props.CurSelectUnit);
        // const isShowTalent = GJSONConfig.BuildingLevelUpConfig.get(Entities.GetUnitName(this.props.CurSelectUnit)) != null;
        const tips = (IsCustomCourier || Entities.IsFakerCourier(this.props.CurSelectUnit)) ?
            { cls: CCPlayerInfoDialog, posRight: false, props: { Playerid: Entities.GetPlayerOwnerID(this.props.CurSelectUnit), isFaker: Entities.IsFakerCourier(this.props.CurSelectUnit) } } :
            { cls: CCUnitStatsDialog, posRight: false };
        return (
            <Panel ref={this.__root__} id="CC_DacBoardPanel"  {...this.initRootAttrs()} hittest={false}>
                {this.props.BShowBuffList && <CCBuffList horizontalAlign={"center"} verticalAlign="bottom" marginBottom={"140px"} />}
                <CCPanel id="DacBoardBG" className={CSSHelper.ClassMaker(this.props.type)} />
                <CCPanel id="DacBoardDiv">
                    <Panel id="DacBoardLeft" hittest={false}>
                        <CCPortraitGroup CurSelectUnit={this.props.CurSelectUnit} particleAttrs={{}} align="right bottom" dialogTooltip={tips} />
                    </Panel>
                    <CCPanel id="DacBoardCenter" hittest={false}>
                        <CCPanel flowChildren="right" hittest={false} verticalAlign="bottom" marginBottom={"60px"} >
                            {/* {isShowTalent && <CCTalentDisplayItem CurSelectUnit={this.props.CurSelectUnit} />} */}
                            <CCAbilityList2 CurSelectUnit={this.props.CurSelectUnit} horizontalAlign={"center"} verticalAlign="center" />
                            {/* {isShowTalent && <CCUnitScepterStatus CurSelectUnit={this.props.CurSelectUnit} />} */}
                        </CCPanel>
                        {
                            <CCHealthMana entityIndex={this.props.CurSelectUnit} align="center bottom" marginBottom={"5px"} />
                            // IsCustomCourier ?
                            //     <CCHealthExp entityIndex={this.props.CurSelectUnit} align="center bottom" marginBottom={"5px"} />
                            //     :
                        }
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