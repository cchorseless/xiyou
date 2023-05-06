import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCLevelxp } from "../CCLevelxp/CCLevelxp";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCTalentBranch.less";
interface ICCTalentBranch {
    unitName: string,
    showLearned?: boolean,
}


export class CCTalentBranch extends CCPanel<ICCTalentBranch> {

    render() {
        const unitName = this.props.unitName;
        const config = GJSONConfig.BuildingLevelUpConfig.get(unitName);
        let abilityNames: { [k: string]: string[] } = {
            1: ["", ""],
            2: ["", ""],
            3: ["", ""],
            4: ["", ""],
        };
        if (config !== null) {
            config?.TalentInfo.forEach((v, k) => {
                abilityNames[v.TalentLevel + ""] = [v.TalentLeft, v.TalentRight];
            });
        }
        let _talent_1 = abilityNames[1 + ""][0];
        let _talent_2 = abilityNames[1 + ""][1];
        let _talent_3 = abilityNames[2 + ""][0];
        let _talent_4 = abilityNames[2 + ""][1];
        let _talent_5 = abilityNames[3 + ""][0];
        let _talent_6 = abilityNames[3 + ""][1];
        let _talent_7 = abilityNames[4 + ""][0];
        let _talent_8 = abilityNames[4 + ""][1];

        let _talent_1_learned = false;
        let _talent_2_learned = false;
        let _talent_3_learned = false;
        let _talent_4_learned = false;
        let _talent_5_learned = false;
        let _talent_6_learned = false;
        let _talent_7_learned = false;
        let _talent_8_learned = false;
        let _talent_1_can_active = false;
        let _talent_2_can_active = false;
        let _talent_3_can_active = false;
        let _talent_4_can_active = false;
        let _talent_5_can_active = false;
        let _talent_6_can_active = false;
        let _talent_7_can_active = false;
        let _talent_8_can_active = false;
        const herounit = this.props.showLearned ? GGameScene.Local.TCharacter.HeroManageComp.GetHeroUnit(unitName) : null;
        if (herounit && herounit.HeroTalentComp) {
            let HeroTalentComp = herounit.HeroTalentComp;
            _talent_1_learned = HeroTalentComp.GetTalentLearn(1, true);
            _talent_2_learned = HeroTalentComp.GetTalentLearn(1, false);
            _talent_3_learned = HeroTalentComp.GetTalentLearn(2, true);
            _talent_4_learned = HeroTalentComp.GetTalentLearn(2, false);
            _talent_5_learned = HeroTalentComp.GetTalentLearn(3, true);
            _talent_6_learned = HeroTalentComp.GetTalentLearn(3, false);
            _talent_7_learned = HeroTalentComp.GetTalentLearn(4, true);
            _talent_8_learned = HeroTalentComp.GetTalentLearn(4, false);
            if (HeroTalentComp.TalentPoint > 0) {
                _talent_1_can_active = _talent_1_learned ? false : herounit.Level >= 4;
                _talent_2_can_active = _talent_2_learned ? false : herounit.Level >= 4;
                _talent_3_can_active = _talent_3_learned ? false : herounit.Level >= 7;
                _talent_4_can_active = _talent_4_learned ? false : herounit.Level >= 7;
                _talent_5_can_active = _talent_5_learned ? false : herounit.Level >= 10;
                _talent_6_can_active = _talent_6_learned ? false : herounit.Level >= 10;
                _talent_7_can_active = _talent_7_learned ? false : herounit.Level >= 13;
                _talent_8_can_active = _talent_8_learned ? false : herounit.Level >= 13;
            }
        }




        return (<Panel className="CCTalentBranch" ref={this.__root__} {...this.initRootAttrs()}>
            <Label id="TalentBranchTitle" text={"天赋树"} />
            <CCPanel flowChildren="right" >
                <CCTalentRow direction="TalentLeft" active={_talent_7_can_active} level={13} Selected={_talent_7_learned} abilityName={_talent_7} />
                <CCLevelxp level={13} verticalAlign="center" />
                <CCTalentRow direction="TalentRight" active={_talent_8_can_active} level={13} Selected={_talent_8_learned} abilityName={_talent_8} />
            </CCPanel>
            <CCPanel flowChildren="right" >
                <CCTalentRow direction="TalentLeft" active={_talent_5_can_active} level={10} Selected={_talent_5_learned} abilityName={_talent_5} />
                <CCLevelxp level={10} verticalAlign="center" />
                <CCTalentRow direction="TalentRight" active={_talent_6_can_active} level={10} Selected={_talent_6_learned} abilityName={_talent_6} />
            </CCPanel>
            <CCPanel flowChildren="right" >
                <CCTalentRow direction="TalentLeft" active={_talent_3_can_active} level={7} Selected={_talent_3_learned} abilityName={_talent_3} />
                <CCLevelxp level={7} verticalAlign="center" />
                <CCTalentRow direction="TalentRight" active={_talent_4_can_active} level={7} Selected={_talent_4_learned} abilityName={_talent_4} />
            </CCPanel>
            <CCPanel flowChildren="right" >
                <CCTalentRow direction="TalentLeft" active={_talent_1_can_active} level={4} Selected={_talent_1_learned} abilityName={_talent_1} />
                <CCLevelxp level={4} verticalAlign="center" />
                <CCTalentRow direction="TalentRight" active={_talent_2_can_active} level={4} Selected={_talent_2_learned} abilityName={_talent_2} />
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
        let str = this.props.abilityName || "";
        if (str.length > 0) {
            GLogHelper.print("天赋树 1", str)
            // const sStr = $.Localize("#DOTA_Tooltip_ability_" + str);
            // str = Abilities.GetAbilityOrBuffDescription(sStr, this.props.abilityName)
            // GLogHelper.print("天赋树 2", sStr)

        }
        return (
            <Panel className="CCTalentRow" hittest={true} ref={this.__root__} {...this.initRootAttrs()}>
                <CCPanel onactivate={self => { }} className={CSSHelper.ClassMaker(this.props.direction,
                    { Selected: this.props.Selected, Actived: this.props.active })}>
                    <Label className="CCTalentDescription" html={true} text={str} />
                </CCPanel>

            </Panel>
        )
    }
}