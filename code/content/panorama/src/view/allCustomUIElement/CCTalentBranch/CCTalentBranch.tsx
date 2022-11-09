import React from "react";
import { AbilityHelper } from "../../../helper/AbilityHelper";
import { CSSHelper } from "../../../helper/CSSHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { CCLevelxp } from "../CCLevelxp/CCLevelxp";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCTalentBranch {
    unitName: string
}


export class CCTalentBranch extends CCPanel<ICCTalentBranch> {
    defaultStyle() {
        return {
            width: "400px",
            flowChildren: "down"
        }
    }
    render() {
        const unitName = this.props.unitName;
        return (this.__root___isValid &&
            <Panel id="CCTalentBranch" ref={this.__root__} {...this.initRootAttrs()}>
                <Label id="TalentBranchTitle" text={"天赋树"} />
                <CCPanel flowChildren="right" >
                    <CCTalentRow direction="TalentLeft" active={false} level={15} Selected={false} abilityName={unitName + "_talent_5"} />
                    <CCLevelxp level={15} verticalAlign="center" />
                    <CCTalentRow direction="TalentRight" active={false} level={15} Selected={false} abilityName={unitName + "_talent_6"} />
                </CCPanel>
                <CCPanel flowChildren="right" >
                    <CCTalentRow direction="TalentLeft" active={false} level={10} Selected={false} abilityName={unitName + "_talent_3"} />
                    <CCLevelxp level={10} verticalAlign="center" />
                    <CCTalentRow direction="TalentRight" active={false} level={10} Selected={false} abilityName={unitName + "_talent_4"} />
                </CCPanel>
                <CCPanel flowChildren="right" >
                    <CCTalentRow direction="TalentLeft" active={false} level={5} Selected={false} abilityName={unitName + "_talent_1"} />
                    <CCLevelxp level={5} verticalAlign="center" />
                    <CCTalentRow direction="TalentRight" active={false} level={5} Selected={false} abilityName={unitName + "_talent_2"} />
                </CCPanel>
            </Panel>
        )
    }
}

interface ICCTalentRow {
    direction: string,
    active: boolean,
    level: number,
    Selected: boolean,
    abilityName: string;
}

export class CCTalentRow extends CCPanel<ICCTalentRow> {
    defaultClass() {
        return CSSHelper.ClassMaker(this.props.direction, { Selected: this.props.Selected, active: this.props.active });
    }
    defaultStyle() {
        return {
            width: "fill-parent-flow(1)",
            height: "40px"
        }
    }
    render() {
        return (
            <Panel id="CC_TalentRow" hittest={true} onactivate={self => { }}>
                <Label className="TalentDescription" html={true} text={AbilityHelper.GetAbilityDescription({
                    sStr: $.Localize("#DOTA_Tooltip_ability_" + this.props.abilityName),
                    sheetConfig: KVHelper.KVData().building_ability_tower,
                    abilityName: this.props.abilityName,
                    iLevel: 1,
                })} />
            </Panel>
        )
    }
}