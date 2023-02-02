/** Create By Editor*/
import React from "react";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../helper/CSSHelper";
import { UnitHelper } from "../../helper/DotaEntityHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { KVHelper } from "../../helper/KVHelper";

import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCUnitStatsDialog.less";


interface ICCUnitStatsDialog extends NodePropsData {
}
export class CCUnitStatsDialog extends CCPanel<ICCUnitStatsDialog> {


    onInitUI() {
        this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() || -1 });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
    }

    render() {
        let iLocalPortraitUnit = this.GetState<EntityIndex>("curunit")
        let sUnitName = Entities.GetUnitName(iLocalPortraitUnit);
        let tData = KVHelper.KVUnits()[sUnitName];
        let bIsHero = UnitHelper.HasHeroAttribute(iLocalPortraitUnit);// NOTE:是否是防御塔，懒得改变量名了
        let bEnemy = Entities.IsEnemy(iLocalPortraitUnit);
        let bFriendlySummon = !bEnemy && !bIsHero && !Entities.IsHero(iLocalPortraitUnit);
        let iPrimaryAttribute = Attributes.DOTA_ATTRIBUTE_INVALID;
        if (bIsHero) {
            iPrimaryAttribute = UnitHelper.GetPrimaryAttribute(iLocalPortraitUnit);
        }
        // 力量
        let iStrength = UnitHelper.GetStrength(iLocalPortraitUnit);
        let iBaseStrength = UnitHelper.GetBaseStrength(iLocalPortraitUnit);
        let iBonusStrength = iStrength - iBaseStrength;
        let sSign = iBonusStrength == 0 ? "" : (iBonusStrength > 0 ? "+" : "-");
        let sBonusStrength;
        if (sSign == "") {
            sBonusStrength = "";
        }
        else if (sSign == "+") {
            sBonusStrength = sSign + iBonusStrength.toFixed(0);
        }
        else {
            sBonusStrength = iBonusStrength.toFixed(0);
        }
        const base_strength = iBaseStrength || 0;
        const bonus_strength = sBonusStrength;
        const total_strength = iStrength;
        const NegativeValue_strength = sSign == "-";
        const NoBonus_strength = sSign == "";
        // 敏捷
        let iAgility = UnitHelper.GetAgility(iLocalPortraitUnit);
        let iBaseAgility = UnitHelper.GetBaseAgility(iLocalPortraitUnit);
        let iBonusAgility = iAgility - iBaseAgility;
        sSign = iBonusAgility == 0 ? "" : (iBonusAgility > 0 ? "+" : "-");
        let sBonusAgility;
        if (sSign == "") {
            sBonusAgility = "";
        }
        else if (sSign == "+") {
            sBonusAgility = sSign + iBonusAgility.toFixed(0);
        }
        else {
            sBonusAgility = iBonusAgility.toFixed(0);
        }
        const base_agility = iBaseAgility || 0;
        const bonus_agility = sBonusAgility;
        const total_agility = iAgility;
        const NegativeValue_agility = sSign == "-";
        const NoBonus_agility = sSign == "";
        // 智力
        let iIntellect = UnitHelper.GetIntellect(iLocalPortraitUnit);
        let iBaseIntellect = UnitHelper.GetBaseIntellect(iLocalPortraitUnit);
        let iBonusIntellect = iIntellect - iBaseIntellect;
        sSign = iBonusIntellect == 0 ? "" : (iBonusIntellect > 0 ? "+" : "-");
        let sBonusIntellect;
        if (sSign == "") {
            sBonusIntellect = "";
        }
        else if (sSign == "+") {
            sBonusIntellect = sSign + iBonusIntellect.toFixed(0);
        }
        else {
            sBonusIntellect = iBonusIntellect.toFixed(0);
        }
        const base_intellect = iIntellect || 0;
        const bonus_intellect = sBonusIntellect;
        const total_intellect = iIntellect;
        const NegativeValue_intellect = sSign == "-";
        const NoBonus_intellect = sSign == "";

        // 攻击速度
        let fAttackSpeed = UnitHelper.GetAttackSpeedPercent(iLocalPortraitUnit);
        let fSecondsPerAttack = Entities.GetSecondsPerAttack(iLocalPortraitUnit);
        const attack_speed = fAttackSpeed;
        const seconds_per_attack = FuncHelper.Round(fSecondsPerAttack, 2);
        const max_attack_speed = FuncHelper.Round(UnitHelper.GetMaximumAttackSpeed(iLocalPortraitUnit))
        // 攻击力
        let fBonusDamage = Entities.GetDamageBonus(iLocalPortraitUnit);
        let fMinDamage = Entities.GetDamageMin(iLocalPortraitUnit);
        let fMaxDamage = Entities.GetDamageMax(iLocalPortraitUnit);
        let fBaseDamage = (fMinDamage + fMaxDamage) / 2;
        sSign = fBonusDamage == 0 ? "" : (fBonusDamage > 0 ? "+" : "-");
        let sBonusDamage;
        if (sSign == "") {
            sBonusDamage = "";
        }
        else if (sSign == "+") {
            sBonusDamage = sSign + fBonusDamage.toFixed(0);
        }
        else {
            sBonusDamage = fBonusDamage.toFixed(0);
        }

        // pSelf.SetDialogVariableInt("base_damage_min", fMinDamage);
        // pSelf.SetDialogVariableInt("base_damage_max", fMaxDamage);
        const base_damage = fBaseDamage;
        const bonus_damage = sBonusDamage;
        const NegativeValue_damage = sSign == "-";
        const NoBonus_damage = sSign == "";
        // 技能增强
        // let fBaseSpellAmplify = Entities.GetBaseSpellAmplify(iLocalPortraitUnit);
        let fSpellAmplify = UnitHelper.GetSpellAmplify(iLocalPortraitUnit);
        // let fBonusSpellAmplify = Round(fSpellAmplify - fBaseSpellAmplify, 1);
        const base_spell_amplify = FuncHelper.Round(fSpellAmplify, 1);
        // pSpellAmpRow.SetDialogVariable("bonus_spell_amplify", signNumber(fBonusSpellAmplify));
        // pSpellAmpRow.SetHasClass("NegativeValue", fBonusSpellAmplify < 0);
        // pSpellAmpRow.SetHasClass("NoBonus", fBonusSpellAmplify == 0);
        // 额外全伤害
        let fTotalDamagePercent = UnitHelper.GetOutgoingDamagePercent(iLocalPortraitUnit);
        const total_damage_percent = FuncHelper.Round(fTotalDamagePercent, 2);
        // 额外物理伤害
        let fPhysicalDamagePercent = UnitHelper.GetOutgoingPhysicalDamagePercent(iLocalPortraitUnit);
        const physical_damage_percent = FuncHelper.Round(fPhysicalDamagePercent, 2);
        // 额外魔法伤害
        let fMagicalDamagePercent = UnitHelper.GetOutgoingMagicalDamagePercent(iLocalPortraitUnit);
        const magical_damage_percent = FuncHelper.Round(fMagicalDamagePercent, 2);
        // 额外纯粹伤害
        let fPureDamagePercent = UnitHelper.GetOutgoingPureDamagePercent(iLocalPortraitUnit);
        const pure_damage_percent = FuncHelper.Round(fPureDamagePercent, 2);
        // 攻击距离
        let fAttackRange = Entities.GetAttackRange(iLocalPortraitUnit);
        let fBaseAttackRange = (tData && tData.AttackRange) ? FuncHelper.ToFloat(tData.AttackRange) : 0;
        let fBonusAttackRange = fAttackRange - fBaseAttackRange;
        sSign = fBonusAttackRange == 0 ? "" : (fBonusAttackRange > 0 ? "+" : "-");
        let sBonusAttackRange;
        if (sSign == "") {
            sBonusAttackRange = "";
        }
        else if (sSign == "+") {
            sBonusAttackRange = sSign + fBonusAttackRange.toFixed(0);
        }
        else {
            sBonusAttackRange = fBonusAttackRange.toFixed(0);
        }
        const base_attack_range = fBaseAttackRange;
        const bonus_attack_range = sBonusAttackRange;
        const NegativeValue_attack_range = sSign == "-";
        const NoBonus_attack_range = sSign == "";
        // 冷却减少
        let fCooldownReduction = UnitHelper.GetCooldownReduction(iLocalPortraitUnit);
        const cooldown_reduction = FuncHelper.Round(fCooldownReduction, 1);
        // 魔法恢复
        // let fBaseManaRegen = (tData && tData.StatusManaRegen) ? FuncHelper.ToFloat(tData.StatusManaRegen as string) : 0;
        // let fManaRegen = Entities.GetManaRegen(iLocalPortraitUnit) + fBaseManaRegen;
        // // fBaseManaRegen += fExtraBaseManaRegen;
        // let fBonusManaRegen = fManaRegen - fBaseManaRegen;
        // sSign = fBonusManaRegen == 0 ? "" : (fBonusManaRegen > 0 ? "+" : "-");
        // let sBonusManaRegen: string | number;
        // if (sSign == "") {
        //     sBonusManaRegen = "";
        // }
        // else if (sSign == "+") {
        //     sBonusManaRegen = sSign + FuncHelper.Round(fBonusManaRegen, 1);
        // }
        // else {
        //     sBonusManaRegen = FuncHelper.Round(fBonusManaRegen, 1);
        // }

        // pSelf.SetDialogVariable("base_mana_regen", Round(fBaseManaRegen, 1));
        // pSelf.SetDialogVariable("bonus_mana_regen", sBonusManaRegen);
        // pSelf.SetHasClass("NegativeValue", sSign == "-");
        // pSelf.SetHasClass("NoBonus", sSign == "");
        // 物理防御穿透
        let fIgnorePhysicalArmorPercent = UnitHelper.GetIgnorePhysicalArmorPercentage(iLocalPortraitUnit);
        const ignore_physical_armor_percent = FuncHelper.Round(fIgnorePhysicalArmorPercent, 2);
        // 魔法防御穿透
        let fIgnoreMagicalArmorPercent = UnitHelper.GetIgnoreMagicalArmorPercentage(iLocalPortraitUnit);
        const ignore_magical_armor_percent = FuncHelper.Round(fIgnoreMagicalArmorPercent, 2);
        // 暴击概率
        let fBase = GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_CHANCE;
        let fTotal = FuncHelper.Round(UnitHelper.GetCriticalStrikeChance(iLocalPortraitUnit), 2);
        let fBonus = fTotal - fBase;
        let sBonus = String(fBonus);
        if (fBonus > 0) {
            sBonus = "+" + sBonus;
            sSign = "+"
        }
        else if (fBonus == 0) {
            sBonus = "";
            sSign = ""
        }
        else {
            sSign = "-"
        }
        const base_attack_crit_chance = fBase;
        const bonus_attack_crit_chance = sBonus;
        const NegativeValue_Crit = sSign == "-";
        const NoBonus_Crit = sSign == "";
        // 暴击伤害



        const base_attack_crit_damage = this.GetState<number>("base_attack_crit_damage", 0);
        const bonus_attack_crit_damage = this.GetState<number>("bonus_attack_crit_damage", 0);
        const base_spell_crit_chance = this.GetState<number>("base_spell_crit_chance", 0);
        const bonus_spell_crit_chance = this.GetState<number>("bonus_spell_crit_chance", 0);
        const spell_crit_damage = this.GetState<number>("spell_crit_damage", 0);
        const bonus_spell_crit_damage = this.GetState<number>("bonus_spell_crit_damage", 0);
        const status_resistance = this.GetState<number>("status_resistance", 0);
        const energy_regen_percent = this.GetState<number>("energy_regen_percent", 0);
        const base_physical_armor = this.GetState<number>("base_physical_armor", 0);
        const bonus_physical_armor = this.GetState<number>("bonus_physical_armor", 0);
        const physical_resistance = this.GetState<number>("physical_resistance", 0);
        const base_magical_armor = this.GetState<number>("base_magical_armor", 0);
        const bonus_magical_armor = this.GetState<number>("bonus_magical_armor", 0);
        const magical_resistance = this.GetState<number>("magical_resistance", 0);
        const evasion = this.GetState<number>("evasion", 0);
        // 移动速度
        const base_move_speed = this.GetState<number>("base_move_speed", 0);
        const bonus_move_speed = this.GetState<number>("bonus_move_speed", 0);


        // className="unitStatsRoot">
        return <Panel className={CSSHelper.ClassMaker("CCUnitStatsDialog", { Hero: bIsHero })} ref={this.__root__}    {...this.initRootAttrs()}>
            <Panel id="unitStatsTopMain">
                <Panel id="HeroAttackContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bIsHero })}>
                    {/* <Label id="AttackHeader" className="ContainerHeader" text="#Unit_Stats_Label_Outgoing" /> */}
                    <Panel id="DamageRow" className={CSSHelper.ClassMaker("StatRow", { NegativeValue: NegativeValue_damage, NoBonus: NoBonus_damage })}>
                        <Image id="DamageIcon" />
                        <Label id="DamageLabel" text="#DOTA_HUD_Damage" className="StatName" />
                        <Panel className="LeftRightFlow">
                            {/* <Label id="Damage" text="{d:base_damage_min} - {d:base_damage_max}" className="BaseValue" /> */}
                            <Label id="Damage" text={`${base_damage}`} className="BaseValue" />
                            <Label id="DamageBonus" text={`${bonus_damage}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackSpeedRow" className="StatRow">
                        <Label id="AttackSpeedLabel" text="#DOTA_HUD_AttackSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackSpeed" text={`${attack_speed}/${max_attack_speed} `} className="BaseValue" />
                            <Label id="AttacksPerSecond" text={` (${seconds_per_attack})`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel className={CSSHelper.ClassMaker("AttackCritRow StatRow", { NegativeValue: NegativeValue_Crit, NoBonus: NoBonus_Crit })} >
                        <Label id="AttackCritLabel" text="#DOTA_HUD_AttackCrit" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="BaseAttackCrit" text={`${base_attack_crit_chance}%`} className="BaseValue" />
                            <Label id="BonusAttackCrit" text={`${bonus_attack_crit_chance}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackCritDamageRow" className="StatRow">
                        <Label id="AttackCritDamageLabel" text="#DOTA_HUD_AttackCritDamage" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackCritDamage" text={`${base_attack_crit_damage}%`} className="BaseValue" />
                            <Label id="BonusAttackCritDamage" text={`${bonus_attack_crit_damage}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="SpellAmpRow" className="StatRow">
                        <Image id="SpellAmpIcon" />
                        <Label id="SpellAmpLabel" text="#DOTA_HUD_SpellAmp" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="SpellAmp" text={`${base_spell_amplify}%`} className="BaseValue" />
                            {/* <Label id="SpellAmpBonus" text={`${bonus_spell_amplify}%`} className="BonusValue" />  */}
                        </Panel>
                    </Panel>
                    <Panel id="CooldownReductionRow" className="StatRow">
                        <Label id="CooldownReductionLabel" text="#DOTA_HUD_CooldownReduction" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="CooldownReduction" text={`${cooldown_reduction}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel className="SpellCritRow StatRow">
                        <Label id="SpellCritLabel" text="#DOTA_HUD_SpellCrit" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="BaseSpellCrit" text={`${base_spell_crit_chance}%`} className="BaseValue" />
                            <Label id="BonusSpellCrit" text={`${bonus_spell_crit_chance}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="SpellCritDamageRow" className="StatRow">
                        <Label id="SpellCritDamageLabel" text="#DOTA_HUD_SpellCritDamage" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="SpellCritDamage" text={`${spell_crit_damage}%`} className="BaseValue" />
                            <Label id="BonusSpellCritDamage" text={`${bonus_spell_crit_damage}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="HeroOtherContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bIsHero })}>
                    <Label id="OtherDamageHeader" className="ContainerHeader" text="#Unit_Stats_Label_Other" />
                    <Panel id="AttackRangeRow" className={CSSHelper.ClassMaker("StatRow", { NegativeValue: NegativeValue_attack_range, NoBonus: NoBonus_attack_range })}>
                        <Label id="RangeLabel" text="#DOTA_HUD_AttackRange" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="Range" text={`${base_attack_range}`} className="BaseValue" />
                            <Label id="RangeBonus" text={`${bonus_attack_range}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="IgnorePhysicalArmorPercentRow" className="StatRow">
                        <Label id="IgnorePhysicalArmorPercentLabel" text="#DOTA_HUD_IgnorePhysicalArmorPercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="IgnorePhysicalArmorPercent" text={`${ignore_physical_armor_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="IgnoreMagicalArmorPercentRow" className="StatRow">
                        <Label id="IgnoreMagicalArmorPercentLabel" text="#DOTA_HUD_IgnoreMagicalArmorPercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="IgnoreMagicalArmorPercent" text={`${ignore_magical_armor_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="StatusResistRow" className="StatRow">
                        <Label id="StatusResistLabel" text="#DOTA_HUD_StatusResist" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="StatusResist=" text={`${status_resistance}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="EnergyRegenRow" className="StatRow">
                        <Label id="EnergyRegenLabel" text="#DOTA_HUD_EnergyRegen" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="EnergyRegen=" text={`${energy_regen_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="TotalDamagePercentRow" className="StatRow">
                        <Label id="TotalDamagePercentLabel" text="#DOTA_HUD_TotalDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="TotalDamagePercent" text={`${total_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="PhysicalDamagePercentRow" className="StatRow">
                        <Label id="PhysicalDamagePercentLabel" text="#DOTA_HUD_PhysicalDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="PhysicalDamagePercent" text={`${physical_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MagicalDamagePercentRow" className="StatRow">
                        <Label id="MagicalDamagePercentLabel" text="#DOTA_HUD_MagicalDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="MagicalDamagePercent" text={`${magical_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="PureDamagePercentRow" className="StatRow">
                        <Label id="PureDamagePercentLabel" text="#DOTA_HUD_PureDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="PureDamagePercent" text={`${pure_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="EnermyContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bEnemy })}>
                    <Label id="DefenseHeader" className="ContainerHeader" text="#DOTA_HUD_Defense" />
                    <Panel id="PhysicalArmorRow" className="StatRow">
                        <Label id="PhysicalArmorLabel" text="#DOTA_HUD_PhysicalArmor_Custom" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="PhysicalArmor" text={`${base_physical_armor}`} className="BaseValue" />
                            <Label id="PhysicalArmorBonus" text={`${bonus_physical_armor}`} className="BonusValue" />
                            <Label id="PhysicalResist" text={` (${physical_resistance})`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MagicalArmorRow" className="StatRow">
                        <Label id="MagicalArmorLabel" text="#DOTA_HUD_MagicalArmor_Custom" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="MagicalArmor" text={`${base_magical_armor}`} className="BaseValue" />
                            <Label id="MagicalArmorBonus" text={`${bonus_magical_armor}`} className="BonusValue" />
                            <Label id="MagicalResist" text={` (${magical_resistance}%)`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel id="StatusResistRow" className="StatRow">
                        <Label id="StatusResistLabel" text="#DOTA_HUD_StatusResist" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="StatusResist=" text={`${status_resistance}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="EvasionRow" className="StatRow">
                        <Label id="EvasionLabel" text="#DOTA_HUD_Evasion" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="Evasion" text={`${evasion}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MoveSpeedRow" className="StatRow">
                        <Label id="MoveSpeedLabel" text="#DOTA_HUD_MoveSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="MoveSpeed" text={`${base_move_speed}`} className="BaseValue" />
                            <Label id="MoveSpeedBonus" text={`${bonus_move_speed}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="FriendlySummonContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bFriendlySummon })}>
                    <Panel id="DamageRow" className={CSSHelper.ClassMaker("StatRow", { NegativeValue: NegativeValue_damage, NoBonus: NoBonus_damage })}>
                        <Label id="DamageLabel" text="#DOTA_HUD_Damage" className="StatName" />
                        <Panel className="LeftRightFlow">
                            {/* <Label id="Damage" text="{d:base_damage_min} - {d:base_damage_max}" className="BaseValue" /> */}
                            <Label id="Damage" text={`${base_damage}`} className="BaseValue" />
                            <Label id="DamageBonus" text={`${bonus_damage}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackSpeedRow" className="StatRow">
                        <Label id="AttackSpeedLabel" text="#DOTA_HUD_AttackSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackSpeed" text={`${attack_speed}`} className="BaseValue" />
                            <Label id="AttacksPerSecond" text={` (${seconds_per_attack})`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel className={CSSHelper.ClassMaker("AttackCritRow StatRow", { NegativeValue: NegativeValue_Crit, NoBonus: NoBonus_Crit })}>
                        <Label id="AttackCritLabel" text="#DOTA_HUD_AttackCrit" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="BaseAttackCrit" text={`${base_attack_crit_chance}%`} className="BaseValue" />
                            <Label id="BonusAttackCrit" text={`${bonus_attack_crit_chance}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackCritDamageRow" className="StatRow">
                        <Label id="AttackCritDamageLabel" text="#DOTA_HUD_AttackCritDamage" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackCritDamage" text={`${base_attack_crit_damage}%`} className="BaseValue" />
                            <Label id="BonusAttackCritDamage" text={`${bonus_attack_crit_damage}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="IgnorePhysicalArmorPercentRow" className="StatRow">
                        <Label id="IgnorePhysicalArmorPercentLabel" text="#DOTA_HUD_IgnorePhysicalArmorPercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="IgnorePhysicalArmorPercent" text={`${ignore_physical_armor_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MoveSpeedRow" className="StatRow">
                        <Label id="MoveSpeedLabel" text="#DOTA_HUD_MoveSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="MoveSpeed" text={`${base_move_speed}`} className="BaseValue" />
                            <Label id="MoveSpeedBonus" text={`${bonus_move_speed}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                </Panel>
            </Panel>
            <Panel id="PrimaryTipContainer">
                <Label id="PrimaryTip" text="#P6_Primary_tip" />
            </Panel>
            <Panel id="AttributesContainer" className="TopBottomFlow">
                <Panel id="StrengthContainer" className={CSSHelper.ClassMaker("LeftRightFlow AttributeRow",
                    {
                        PrimaryAttribute: iPrimaryAttribute == Attributes.DOTA_ATTRIBUTE_STRENGTH,
                        NegativeValue: NegativeValue_strength,
                        NoBonus: NoBonus_strength,
                    })}>
                    <Panel id="StrengthIcon" className="AttributeIcon" />
                    <Panel className="AttributeDetails TopBottomFlow">
                        <Panel id="AttributeValues" className="LeftRightFlow">
                            <Label id="BaseStrengthLabel" className="BaseAttributeValue" text={`${base_strength}`} />
                            <Label id="BonusStrengthLabel" className="BonusAttributeValue" text={`${bonus_strength}`} />
                            <Label id="TotalStrengthLabel" className="TotalAttributeValue" text={`${total_strength}`} />
                        </Panel>
                        <Label id="StrengthDamageLabel" className="PrimaryAttributeBonus" text="#P6_StrengthDetails_Custom_Primary" html={true} />
                        <Label id="StrengthDetails" className="StatBreakdownLabel" text="#P6_StrengthDetails_Custom" />
                    </Panel>
                </Panel>
                <Panel id="AgilityContainer" className={CSSHelper.ClassMaker("LeftRightFlow AttributeRow", {
                    PrimaryAttribute: iPrimaryAttribute == Attributes.DOTA_ATTRIBUTE_AGILITY,
                    NegativeValue: NegativeValue_agility,
                    NoBonus: NoBonus_agility,
                })}>
                    <Panel id="AgilityIcon" className="AttributeIcon" />
                    <Panel className="AttributeDetails TopBottomFlow">
                        <Panel id="AttributeValues" className="LeftRightFlow">
                            <Label id="BaseAgilityLabel" className="BaseAttributeValue" text={`${base_agility}`} />
                            <Label id="BonusAgilityabel" className="BonusAttributeValue" text={`${bonus_agility}`} />
                            <Label id="TotalAgilityabel" className="TotalAttributeValue" text={`${total_agility}`} />
                        </Panel>
                        <Label id="AgilityDamageLabel" className="PrimaryAttributeBonus" text="#P6_AgilityDetails_Custom_Primary" />
                        <Label id="AgilityDetails" className="StatBreakdownLabel" text="#P6_AgilityDetails_Custom" />
                    </Panel>
                </Panel>
                <Panel id="IntellectContainer" className={CSSHelper.ClassMaker("LeftRightFlow AttributeRow", {
                    PrimaryAttribute: iPrimaryAttribute == Attributes.DOTA_ATTRIBUTE_INTELLECT,
                    NegativeValue: NegativeValue_intellect,
                    NoBonus: NoBonus_intellect,
                })}>
                    <Panel id="IntellectIcon" className="AttributeIcon" />
                    <Panel className="AttributeDetails TopBottomFlow">
                        <Panel id="AttributeValues" className="LeftRightFlow">
                            <Label id="BaseIntellectLabel" className="BaseAttributeValue" text={`${base_intellect}`} />
                            <Label id="BonusIntellectLabel" className="BonusAttributeValue" text={`${bonus_intellect}`} />
                            <Label id="TotalIntellectLabel" className="TotalAttributeValue" text={`${total_intellect}`} />
                        </Panel>
                        <Label id="IntellectDamageLabel" className="PrimaryAttributeBonus" text="#P6_IntellectDetails_Custom_Primary" />
                        <Label id="IntellectDetails" className="StatBreakdownLabel" text="#P6_IntellectDetails_Custom" />
                    </Panel>
                </Panel>
            </Panel>
        </Panel>

    }
}