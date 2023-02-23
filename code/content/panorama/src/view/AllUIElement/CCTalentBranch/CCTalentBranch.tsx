import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { AbilityHelper } from "../../../helper/DotaEntityHelper";
import { CCLevelxp } from "../CCLevelxp/CCLevelxp";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCTalentBranch.less";
interface ICCTalentBranch {
    unitName: string,
    entityIndex?: EntityIndex,
}


export class CCTalentBranch extends CCPanel<ICCTalentBranch> {

    render() {
        const unitName = this.props.unitName;
        return (<Panel className="CCTalentBranch" ref={this.__root__} {...this.initRootAttrs()}>
            <Label id="TalentBranchTitle" text={"天赋树"} />
            <CCPanel flowChildren="right" >
                <CCTalentRow direction="TalentLeft" active={false} level={20} Selected={false} abilityName={unitName + "_talent_5"} />
                <CCLevelxp level={20} verticalAlign="center" />
                <CCTalentRow direction="TalentRight" active={false} level={20} Selected={false} abilityName={unitName + "_talent_6"} />
            </CCPanel>
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

    render() {
        return (
            <Panel className="CCTalentRow" hittest={true} ref={this.__root__} {...this.initRootAttrs()}>
                <CCPanel onactivate={self => { }} className={CSSHelper.ClassMaker(this.props.direction, { Selected: this.props.Selected, active: this.props.active })}>
                    <Label className="CCTalentDescription" html={true} text={
                        AbilityHelper.GetAbilityDescription({
                            sStr: $.Localize("#DOTA_Tooltip_ability_" + this.props.abilityName),
                            abilityName: this.props.abilityName,
                            iLevel: 1,
                        })
                    } />
                </CCPanel>

            </Panel>
        )
    }
}