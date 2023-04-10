import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { UnitHelper } from "../../../helper/DotaEntityHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCUnitStats.less";

interface ICCUnitStats {
    CurSelectUnit: EntityIndex;
}

export class CCUnitStats extends CCPanel<ICCUnitStats>  {

    onInitUI() {
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            if (Entities.IsValidEntity(this.props.CurSelectUnit)) {
                this.UpdateSelf();
            }
            return 0.1
        }));
    }

    render() {
        let bonus_damage = "";
        let base_damage = "";
        let bonus_physical_armor = "";
        let physical_armor = "";
        let bonus_magical_armor = "";
        let magical_armor = "";
        let bonus_move_speed = "";
        let base_move_speed = "";
        let strength_bonus = "";
        let base_strength = "";
        let agility_bonus = "";
        let base_agility = "";
        let intellect_bonus = "";
        let base_intellect = "";
        if (Entities.IsValidEntity(this.props.CurSelectUnit)) {
            let iLocalPortraitUnit = this.props.CurSelectUnit;
            let fattackdamage = UnitHelper.GetAttackDamage(iLocalPortraitUnit);
            let fbaseDamage = UnitHelper.GetBaseAttackDamage(iLocalPortraitUnit);
            let fBonusDamage = fattackdamage - fbaseDamage;
            base_damage = fbaseDamage.toFixed(0);
            bonus_damage = FuncHelper.SignNumber(FuncHelper.Round(fBonusDamage));
            let fPhysicalArmor = UnitHelper.GetPhysicalArmor(iLocalPortraitUnit);
            let fBasePhysicalArmor = UnitHelper.GetBasePhysicalArmor(iLocalPortraitUnit);
            physical_armor = fBasePhysicalArmor.toFixed(0);
            bonus_physical_armor += FuncHelper.SignNumber(FuncHelper.Round(fPhysicalArmor - fBasePhysicalArmor));
            let fMagicalArmor = UnitHelper.GetMagicalArmor(iLocalPortraitUnit);
            let fBaseMagicalArmor = UnitHelper.GetBaseMagicalArmor(iLocalPortraitUnit);
            bonus_magical_armor = FuncHelper.SignNumber(FuncHelper.Round(fMagicalArmor - fBaseMagicalArmor)) + "";
            magical_armor = fBaseMagicalArmor + "";
            let fBaseMoveSpeed = Entities.GetBaseMoveSpeed(iLocalPortraitUnit);
            let fBonusMoveSpeed = UnitHelper.GetMoveSpeed(iLocalPortraitUnit) - fBaseMoveSpeed;
            bonus_move_speed = FuncHelper.SignNumber(FuncHelper.Round(fBonusMoveSpeed));
            base_move_speed = fBaseMoveSpeed.toFixed(0);
            let iStrength = UnitHelper.GetStrength(iLocalPortraitUnit);
            let iBaseStrength = UnitHelper.GetBaseStrength(iLocalPortraitUnit);
            let iBonusStrength = iStrength - iBaseStrength;
            strength_bonus = FuncHelper.SignNumber(FuncHelper.Round(iBonusStrength));
            base_strength = iBaseStrength + "";
            let iAgility = UnitHelper.GetAgility(iLocalPortraitUnit);
            let iBaseAgility = UnitHelper.GetBaseAgility(iLocalPortraitUnit);
            let iBonusAgility = iAgility - iBaseAgility;
            agility_bonus = FuncHelper.SignNumber(FuncHelper.Round(iBonusAgility));
            base_agility = iBaseAgility + "";
            let iIntellect = UnitHelper.GetIntellect(iLocalPortraitUnit);
            let iBaseIntellect = UnitHelper.GetBaseIntellect(iLocalPortraitUnit);
            let iBonusIntellect = iIntellect - iBaseIntellect;
            intellect_bonus = FuncHelper.SignNumber(FuncHelper.Round(iBonusIntellect));
            base_intellect = iBaseIntellect + "";
        }
        return (
            this.__root___isValid && (
                <Panel className="CCUnitStats ShowSplitLabels" ref={this.__root__} hittest={false}{...this.initRootAttrs()}>
                    <Panel id="Stats" require-composition-layer={true} always-cache-composition-layer={true} hittest={false} hittestchildren={false}>
                        <Panel id="Damage" className="StatIconLabel">
                            <Panel id="DamageIcon" className="StatIcon" />
                            {/* <Label id="DamageLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" localizedText="{s:combined_damage}" /> */}
                            <Label id="DamageModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                bonus_damage.includes("-") ? "StatNegative" : "StatPositive")} text={bonus_damage} />
                            <Label id="DamageBaseLabel" className="MonoNumbersFont StatRegionLabel BaseLabel" text={base_damage} />
                        </Panel>
                        {/* <Panel id="SpellAmplify" className="StatIconLabel">
                            <Panel id="SpellAmplifyIcon" className="StatIcon" />
                            <Label id="SpellAmplifyLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" localizedText="{s:combined_spell_amplify}%" />
                        </Panel> */}
                        <Panel id="PhysicalArmor" className="StatIconLabel">
                            <Panel id="PhysicalArmorIcon" className="StatIcon" />
                            {/* <Label id="PhysicalDamageResist" className="MonoNumbersFont StatRegionLabel" localizedText="{d:physical_resistance}%" /> */}
                            {/* <Label id="PhysicalArmorLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" localizedText="{s:combined_physical_armor}" /> */}
                            <Label id="PhysicalArmorModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                bonus_physical_armor.includes("-") ? "StatNegative" : "StatPositive")} text={bonus_physical_armor} />
                            <Label id="PhysicalArmorBaseLabel" className="MonoNumbersFont StatRegionLabel BaseLabel" text={physical_armor} />
                        </Panel>
                        <Panel id="MagicalArmor" className="StatIconLabel">
                            <Panel id="MagicalArmorIcon" className="StatIcon" />
                            {/* <Label id="MagicalDamageResist" className="MonoNumbersFont StatRegionLabel" localizedText="{d:magical_resistance}%" /> */}
                            {/* <Label id="MagicalArmorLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" localizedText="{s:combined_magical_armor}" /> */}
                            <Label id="MagicalArmorModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                bonus_magical_armor.includes("-") ? "StatNegative" : "StatPositive")} text={bonus_magical_armor} />
                            <Label id="MagicalArmorBaseLabel" className="MonoNumbersFont StatRegionLabel BaseLabel" text={magical_armor} />
                        </Panel>
                        <Panel id="MoveSpeed" className="StatIconLabel">
                            <Panel id="MoveSpeedIcon" className="StatIcon" />
                            {/* <Label id="MoveSpeedLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" localizedText="{s:combined_move_speed}" /> */}
                            <Label id="MoveSpeedModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                bonus_move_speed.includes("-") ? "StatNegative" : "StatPositive")} text={bonus_move_speed} />
                            <Label id="MoveSpeedBaseLabel" className="MonoNumbersFont StatRegionLabel BaseLabel" text={base_move_speed} />
                        </Panel>
                    </Panel>
                    <Panel id="Attribute" always-cache-composition-layer={true} require-composition-layer={true} hittest={false}>
                        <Panel id="Strength" className="AttrIconContainer">
                            <Panel className="HighlightStatIcon" hittest={false} />
                            <Panel id="StrengthIcon" className="StatIcon" hittest={false} />
                            <Label id="StrengthModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                strength_bonus.includes("-") ? "StatNegative" : "StatPositive")} text={strength_bonus} />
                            <Label id="StrengthBaseLabel" className="StatLabel BaseLabel" text={base_strength} hittest={false} />
                            {/* <Label id="StrengthLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" localizedText="{s:strength}" /> */}
                        </Panel>
                        <Panel id="Agility" className="AttrIconContainer">
                            <Panel className="HighlightStatIcon" hittest={false} />
                            <Panel id="AgilityIcon" className="StatIcon" hittest={false} />
                            <Label id="AgilityModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                agility_bonus.includes("-") ? "StatNegative" : "StatPositive")} text={agility_bonus} />
                            <Label id="AgilityBaseLabel" className="StatLabel BaseLabel" text={base_agility} hittest={false} />
                            {/* <Label id="AgilityLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" text={agility} /> */}

                        </Panel>
                        <Panel id="Intellect" className="AttrIconContainer">
                            <Panel className="HighlightStatIcon" hittest={false} />
                            <Panel id="IntellectIcon" className="StatIcon" hittest={false} />
                            <Label id="IntellectModifierLabel" className={CSSHelper.ClassMaker("MonoNumbersFont StatRegionLabel StatModifier",
                                intellect_bonus.includes("-") ? "StatNegative" : "StatPositive")} text={intellect_bonus} />
                            <Label id="IntellectBaseLabel" className="StatLabel BaseLabel" text={base_intellect} hittest={false} />
                            {/* <Label id="IntellectLabel" className="MonoNumbersFont StatRegionLabel CombinedLabel" text={intellect} /> */}

                        </Panel>
                    </Panel>
                </Panel>
            )
        );
    }
}
