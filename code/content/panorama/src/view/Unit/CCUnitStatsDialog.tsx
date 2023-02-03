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


    getRowClassName(v1: number) {
        if (v1 === 0) {
            return "NoBonus";
        }
        else if (v1 < 0) {
            return "NegativeValue";
        }
    }


    render() {
        let iLocalPortraitUnit = this.GetState<EntityIndex>("curunit")
        let sUnitName = Entities.GetUnitName(iLocalPortraitUnit);
        let tData = KVHelper.KVUnits()[sUnitName];
        let bIsHero = UnitHelper.HasHeroAttribute(iLocalPortraitUnit);
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
        let sBonusStrength = FuncHelper.SignNumber(iBonusStrength);
        const base_strength = iBaseStrength || 0;
        const bonus_strength = sBonusStrength;
        const total_strength = iStrength;
        const strength_attack_damage = iStrength * GPropertyConfig.ATTRIBUTE_STRENGTH_ATTACK_DAMAGE;
        const strength_energy_regen = FuncHelper.Round(iStrength * GPropertyConfig.ATTRIBUTE_STRENGTH_ENERGY_GET, 2);
        const strength_all_damage = FuncHelper.Clamp(FuncHelper.Round(iStrength * GPropertyConfig.ATTRIBUTE_STRENGTH_ALL_DAMAGE, 2), 0, GPropertyConfig.ATTRIBUTE_STRENGTH_ALL_DAMAGE_MAX);
        const strength_all_damage_max = GPropertyConfig.ATTRIBUTE_STRENGTH_ALL_DAMAGE_MAX;
        const strengthdialogVariable = {
            strength_attack_damage: strength_attack_damage + "",
            strength_energy_regen: strength_energy_regen + "",
            strength_all_damage: strength_all_damage + "",
            strength_all_damage_max: strength_all_damage_max + "",
        }
        const rowcls_strength = this.getRowClassName(iBaseStrength);
        // 敏捷
        let iAgility = UnitHelper.GetAgility(iLocalPortraitUnit);
        let iBaseAgility = UnitHelper.GetBaseAgility(iLocalPortraitUnit);
        let iBonusAgility = iAgility - iBaseAgility;
        let sBonusAgility = FuncHelper.SignNumber(iBonusAgility);
        const base_agility = iBaseAgility || 0;
        const bonus_agility = sBonusAgility;
        const total_agility = iAgility;
        const rowcls_agility = this.getRowClassName(iBonusAgility);
        const agility_attack_speed = iAgility * GPropertyConfig.ATTRIBUTE_AGILITY_ATTACK_SPEED;
        const agility_max_attack_speed = iAgility * GPropertyConfig.ATTRIBUTE_AGILITY_MAX_ATTACK_SPEED;
        // const agility_max_energy = iAgility * GPropertyConfig.ATTRIBUTE_AGILITY_MAX_ENERGY;
        // const primary_attribute_damage = Math.floor(FuncHelper.ToFloat(iAgility * GPropertyConfig.ATTRIBUTE_PRIMARY_ATTACK_DAMAGE));
        const agilitydialogVariable = {
            agility_attack_speed: agility_attack_speed + "",
            agility_max_attack_speed: agility_max_attack_speed + "",
            // agility_max_energy: agility_max_energy + "",
            // primary_attribute_damage: primary_attribute_damage + "",
        }
        // 智力
        let iIntellect = UnitHelper.GetIntellect(iLocalPortraitUnit);
        let iBaseIntellect = UnitHelper.GetBaseIntellect(iLocalPortraitUnit);
        let iBonusIntellect = iIntellect - iBaseIntellect;
        let sBonusIntellect = FuncHelper.SignNumber(iBonusIntellect);;
        const base_intellect = iIntellect || 0;
        const bonus_intellect = sBonusIntellect;
        const total_intellect = iIntellect;
        const rowcls_intellect = this.getRowClassName(iBonusIntellect);
        const intellect_spell_amplify = iIntellect * GPropertyConfig.ATTRIBUTE_INTELLECT_SPELL_AMPLIFY;
        const intellect_mana = iIntellect * GPropertyConfig.ATTRIBUTE_INTELLECT_MANA;
        const intellect_cooldown_reduction = Math.min(GPropertyConfig.ATTRIBUTE_INTELLECT_MAX_CD, FuncHelper.Round((1 - Math.pow(1 - GPropertyConfig.ATTRIBUTE_INTELLECT_COOLDOWN_REDUCTION * 0.01, iIntellect)) * 100, 2));
        // const primary_attribute_damage = Math.floor(FuncHelper.ToFloat(iIntellect * FuncHelper.ToFloat(GPropertyConfig.ATTRIBUTE_PRIMARY_ATTACK_DAMAGE)));
        // const fExtraBaseManaRegen = FuncHelper.ToFloat(iIntellect * FuncHelper.ToFloat(GPropertyConfig.ATTRIBUTE_INTELLIGENCE_MANA_REGEN));
        const intellectdialogVariable = {
            intellect_spell_amplify: intellect_spell_amplify + "",
            intellect_mana: intellect_mana + "",
            intellect_cooldown_reduction: intellect_cooldown_reduction + "",
            // primary_attribute_damage: primary_attribute_damage + "",
            // fExtraBaseManaRegen: fExtraBaseManaRegen + "",
        }
        // 攻击力
        let fBonusDamage = Entities.GetDamageBonus(iLocalPortraitUnit);
        let fMinDamage = Entities.GetDamageMin(iLocalPortraitUnit);
        let fMaxDamage = Entities.GetDamageMax(iLocalPortraitUnit);
        let fBaseDamage = (fMinDamage + fMaxDamage) / 2;
        let sBonusDamage = FuncHelper.SignNumber(fBonusDamage);;
        const base_damage_min = fMinDamage;
        const base_damage_max = fMaxDamage;
        const base_damage = fBaseDamage;
        const bonus_damage = sBonusDamage;
        const rowcls_damage = this.getRowClassName(fBonusDamage);
        // 攻击速度
        let fAttackSpeed = UnitHelper.GetAttackSpeedPercent(iLocalPortraitUnit);
        let fSecondsPerAttack = Entities.GetSecondsPerAttack(iLocalPortraitUnit);
        const attack_speed = FuncHelper.Round(fAttackSpeed, 1);
        const seconds_per_attack = FuncHelper.Round(fSecondsPerAttack, 2);
        const max_attack_speed = FuncHelper.Round(UnitHelper.GetMaximumAttackSpeed(iLocalPortraitUnit))
        // 技能增强
        let fBaseSpellAmplify = UnitHelper.GetBaseSpellAmplify(iLocalPortraitUnit);
        let fSpellAmplify = UnitHelper.GetSpellAmplify(iLocalPortraitUnit);
        let fBonusSpellAmplify = FuncHelper.Round(fSpellAmplify - fBaseSpellAmplify, 1);
        const base_spell_amplify = FuncHelper.Round(fSpellAmplify, 1);
        const bonus_spell_amplify = FuncHelper.SignNumber(fBonusSpellAmplify, true);
        const rowcls_spell_amplify = this.getRowClassName(fBonusSpellAmplify);
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
        let sBonusAttackRange = FuncHelper.SignNumber(fBonusAttackRange);
        const base_attack_range = fBaseAttackRange;
        const bonus_attack_range = sBonusAttackRange;
        const rowcls_attack_range = this.getRowClassName(fBonusAttackRange);
        // 冷却减少
        let fCooldownReduction = UnitHelper.GetCooldownReduction(iLocalPortraitUnit);
        const cooldown_reduction = FuncHelper.Round(fCooldownReduction, 1);
        // 魔法恢复
        let fBaseManaRegen = (tData && tData.StatusManaRegen) ? FuncHelper.ToFloat(tData.StatusManaRegen as string) : 0;
        let fManaRegen = UnitHelper.GetManaRegen(iLocalPortraitUnit) + fBaseManaRegen;
        // fBaseManaRegen += fExtraBaseManaRegen;
        let fBonusManaRegen = fManaRegen - fBaseManaRegen;
        let sBonusManaRegen = FuncHelper.SignNumber(fBonusManaRegen);
        const base_mana_regen = FuncHelper.Round(fBaseManaRegen, 1)
        const bonus_mana_regen = sBonusManaRegen;
        const rowcls_mana_regen = this.getRowClassName(fBonusManaRegen);
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
        let sBonus = FuncHelper.SignNumber(fBonus, true);
        const base_attack_crit_chance = fBase;
        const bonus_attack_crit_chance = sBonus;
        const rowcls_Crit = this.getRowClassName(fBonus);
        // 暴击伤害
        let fBaseCritDamage = GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_DAMAGE;// 基础暴击伤害
        let fBonusCritDamage = UnitHelper.GetCriticalStrikeDamage(iLocalPortraitUnit) - fBaseCritDamage;
        let sBonusCritDamage = FuncHelper.SignNumber(fBonusCritDamage, true);
        const base_attack_crit_damage = FuncHelper.Round(fBaseCritDamage, 2);
        const bonus_attack_crit_damage = sBonusCritDamage;
        const rowcls_Crit_damage = this.getRowClassName(fBonusCritDamage);
        // 技能暴击概率
        let fBase_crit_chance = GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_CHANCE;
        let fTotal_crit_chance = FuncHelper.Round(UnitHelper.GetSpellCriticalStrikeChance(iLocalPortraitUnit), 2);
        let fBonus_crit_chance = fTotal_crit_chance - fBase_crit_chance;
        let sBonus_crit_chance = FuncHelper.SignNumber(fBonus_crit_chance, true);
        const base_spell_crit_chance = fBase_crit_chance;
        const bonus_spell_crit_chance = sBonus_crit_chance;
        const rowcls_crit_chance = this.getRowClassName(fBonus_crit_chance);
        // 怒气恢复加成
        const energy_regen_percent = FuncHelper.Round(UnitHelper.GetEnergyRegenPercentage(iLocalPortraitUnit), 2)
        // 技能暴击伤害
        let fBaseSpellCritDamage = GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_DAMAGE;// 基础暴击概率
        let fBonusSpellCritDamage = UnitHelper.GetSpellCriticalStrikeDamage(iLocalPortraitUnit) - fBaseSpellCritDamage;
        let sBonusSpellCritDamage = FuncHelper.SignNumber(fBonusSpellCritDamage, true);
        const spell_crit_damage = FuncHelper.Round(fBaseSpellCritDamage, 2);
        const bonus_spell_crit_damage = sBonusSpellCritDamage;
        const rowcls_spell_crit_damage = this.getRowClassName(fBonusSpellCritDamage);
        // 物理防御
        let fPhysicalArmor = UnitHelper.GetPhysicalArmor(iLocalPortraitUnit);
        let fBasePhysicalArmor = UnitHelper.GetBasePhysicalArmor(iLocalPortraitUnit);
        let fBonusPhysicalArmor = fPhysicalArmor - fBasePhysicalArmor;
        let fPhysicalArmorReduction = (() => {
            let iSign = fPhysicalArmor >= 0 ? 1 : -1;
            return iSign * GPropertyConfig.PHYSICAL_ARMOR_FACTOR * Math.abs(fPhysicalArmor) / (1 + GPropertyConfig.PHYSICAL_ARMOR_FACTOR * Math.abs(fPhysicalArmor));
        })();
        let sBonusPhysicalArmor = FuncHelper.SignNumber(fBonusPhysicalArmor);;
        const base_physical_armor = FuncHelper.Round(fBasePhysicalArmor, 1)
        const bonus_physical_armor = sBonusPhysicalArmor;
        const physical_resistance = FuncHelper.Round(fPhysicalArmorReduction * 100, 1);
        const rowcls_physical_armor = this.getRowClassName(fBonusPhysicalArmor);
        // 魔法防御
        let fMagicalArmor = UnitHelper.GetMagicalArmor(iLocalPortraitUnit);
        let fBaseMagicalArmor = UnitHelper.GetBaseMagicalArmor(iLocalPortraitUnit);
        let fBonusMagicalArmor = fMagicalArmor - fBaseMagicalArmor;
        let fMagicalArmorReduction = (() => {
            let iSign = fMagicalArmor >= 0 ? 1 : -1;
            return iSign * GPropertyConfig.MAGICAL_ARMOR_FACTOR * Math.abs(fMagicalArmor) / (1 + GPropertyConfig.MAGICAL_ARMOR_FACTOR * Math.abs(fMagicalArmor));
        })();
        let sBonusMagicalArmor = FuncHelper.SignNumber(fBonusMagicalArmor);;
        const base_magical_armor = FuncHelper.Round(fBaseMagicalArmor, 1);
        const bonus_magical_armor = sBonusMagicalArmor;
        const magical_resistance = FuncHelper.Round(fMagicalArmorReduction * 100, 1);
        const rowcls_magical_armor = this.getRowClassName(fBonusMagicalArmor);
        // 闪避
        let fEvasion = UnitHelper.GetEvasion(iLocalPortraitUnit);
        const evasion = fEvasion.toFixed(0);
        // 移动速度
        let fBaseMoveSpeed = Entities.GetBaseMoveSpeed(iLocalPortraitUnit);
        let fBonusMoveSpeed = UnitHelper.GetMoveSpeed(iLocalPortraitUnit) - fBaseMoveSpeed;
        let sBonusMoveSpeed = FuncHelper.SignNumber(fBonusMoveSpeed);;
        const base_move_speed = fBaseMoveSpeed.toFixed(0);
        const bonus_move_speed = sBonusMoveSpeed;
        const rowcls_move_speed = this.getRowClassName(fBonusMoveSpeed);
        // 状态抗性
        let fStatusResistance = UnitHelper.GetStatusResistance(iLocalPortraitUnit);
        const status_resistance = FuncHelper.Round(fStatusResistance, 1);

        return <Panel className={CSSHelper.ClassMaker("CCUnitStatsDialog", { Hero: bIsHero })} ref={this.__root__}    {...this.initRootAttrs()}>
            <Panel id="unitStatsTopMain">
                <Panel id="HeroAttackContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bIsHero })}>
                    <Label id="AttackHeader" className="ContainerHeader" localizedText="#Unit_Stats_Label_Outgoing" />
                    <Panel id="DamageRow" className={CSSHelper.ClassMaker("StatRow", rowcls_damage)}>
                        <Image id="DamageIcon" />
                        <Label id="DamageLabel" localizedText="#DOTA_HUD_Damage" className="StatName" />
                        <Panel className="LeftRightFlow">
                            {/* <Label id="Damage" text="{d:base_damage_min} - {d:base_damage_max}" className="BaseValue" /> */}
                            <Label id="Damage" text={`${base_damage}`} className="BaseValue" />
                            <Label id="DamageBonus" text={`${bonus_damage}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackSpeedRow" className="StatRow">
                        <Label id="AttackSpeedLabel" localizedText="#DOTA_HUD_AttackSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackSpeed" text={`${attack_speed}/${max_attack_speed} `} className="BaseValue" />
                            <Label id="AttacksPerSecond" text={` (${seconds_per_attack})`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel className={CSSHelper.ClassMaker("AttackCritRow StatRow", rowcls_Crit)} >
                        <Label id="AttackCritLabel" localizedText="#DOTA_HUD_AttackCrit" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="BaseAttackCrit" text={`${base_attack_crit_chance}%`} className="BaseValue" />
                            <Label id="BonusAttackCrit" text={`${bonus_attack_crit_chance}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackCritDamageRow" className={CSSHelper.ClassMaker("StatRow", rowcls_Crit_damage)}>
                        <Label id="AttackCritDamageLabel" localizedText="#DOTA_HUD_AttackCritDamage" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackCritDamage" text={`${base_attack_crit_damage}%`} className="BaseValue" />
                            <Label id="BonusAttackCritDamage" text={`${bonus_attack_crit_damage}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="SpellAmpRow" className="StatRow">
                        <Image id="SpellAmpIcon" />
                        <Label id="SpellAmpLabel" localizedText="#DOTA_HUD_SpellAmp" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="SpellAmp" text={`${base_spell_amplify}%`} className="BaseValue" />
                            <Label id="SpellAmpBonus" text={`${bonus_spell_amplify}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="CooldownReductionRow" className="StatRow">
                        <Label id="CooldownReductionLabel" localizedText="#DOTA_HUD_CooldownReduction" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="CooldownReduction" text={`${cooldown_reduction}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel className={CSSHelper.ClassMaker("SpellCritRow StatRow", rowcls_crit_chance)}>
                        <Label id="SpellCritLabel" localizedText="#DOTA_HUD_SpellCrit" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="BaseSpellCrit" text={`${base_spell_crit_chance}%`} className="BaseValue" />
                            <Label id="BonusSpellCrit" text={`${bonus_spell_crit_chance}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="SpellCritDamageRow" className={CSSHelper.ClassMaker("StatRow", rowcls_spell_crit_damage)} >
                        <Label id="SpellCritDamageLabel" localizedText="#DOTA_HUD_SpellCritDamage" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="SpellCritDamage" text={`${spell_crit_damage}%`} className="BaseValue" />
                            <Label id="BonusSpellCritDamage" text={`${bonus_spell_crit_damage}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="HeroOtherContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bIsHero })}>
                    <Label id="OtherDamageHeader" className="ContainerHeader" localizedText="#Unit_Stats_Label_Other" />
                    <Panel id="AttackRangeRow" className={CSSHelper.ClassMaker("StatRow", rowcls_attack_range)}>
                        <Label id="RangeLabel" localizedText="#DOTA_HUD_AttackRange" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="Range" text={`${base_attack_range}`} className="BaseValue" />
                            <Label id="RangeBonus" text={`${bonus_attack_range}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="IgnorePhysicalArmorPercentRow" className="StatRow">
                        <Label id="IgnorePhysicalArmorPercentLabel" localizedText="#DOTA_HUD_IgnorePhysicalArmorPercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="IgnorePhysicalArmorPercent" text={`${ignore_physical_armor_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="IgnoreMagicalArmorPercentRow" className="StatRow">
                        <Label id="IgnoreMagicalArmorPercentLabel" localizedText="#DOTA_HUD_IgnoreMagicalArmorPercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="IgnoreMagicalArmorPercent" text={`${ignore_magical_armor_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="StatusResistRow" className="StatRow">
                        <Label id="StatusResistLabel" localizedText="#DOTA_HUD_StatusResist" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="StatusResist=" text={`${status_resistance}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="EnergyRegenRow" className="StatRow">
                        <Label id="EnergyRegenLabel" localizedText="#DOTA_HUD_EnergyRegen" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="EnergyRegen=" text={`${energy_regen_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="TotalDamagePercentRow" className="StatRow">
                        <Label id="TotalDamagePercentLabel" localizedText="#DOTA_HUD_TotalDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="TotalDamagePercent" text={`${total_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="PhysicalDamagePercentRow" className="StatRow">
                        <Label id="PhysicalDamagePercentLabel" localizedText="#DOTA_HUD_PhysicalDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="PhysicalDamagePercent" text={`${physical_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MagicalDamagePercentRow" className="StatRow">
                        <Label id="MagicalDamagePercentLabel" localizedText="#DOTA_HUD_MagicalDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="MagicalDamagePercent" text={`${magical_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="PureDamagePercentRow" className="StatRow">
                        <Label id="PureDamagePercentLabel" localizedText="#DOTA_HUD_PureDamagePercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="PureDamagePercent" text={`${pure_damage_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="EnermyContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bEnemy })}>
                    <Label id="DefenseHeader" className="ContainerHeader" localizedText="#DOTA_HUD_Defense" />
                    <Panel id="PhysicalArmorRow" className={CSSHelper.ClassMaker("StatRow", rowcls_physical_armor)}>
                        <Label id="PhysicalArmorLabel" localizedText="#DOTA_HUD_PhysicalArmor_Custom" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="PhysicalArmor" text={`${base_physical_armor}`} className="BaseValue" />
                            <Label id="PhysicalArmorBonus" text={`${bonus_physical_armor}`} className="BonusValue" />
                            <Label id="PhysicalResist" text={` (${physical_resistance})`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MagicalArmorRow" className={CSSHelper.ClassMaker("StatRow", rowcls_magical_armor)}>
                        <Label id="MagicalArmorLabel" localizedText="#DOTA_HUD_MagicalArmor_Custom" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="MagicalArmor" text={`${base_magical_armor}`} className="BaseValue" />
                            <Label id="MagicalArmorBonus" text={`${bonus_magical_armor}`} className="BonusValue" />
                            <Label id="MagicalResist" text={` (${magical_resistance}%)`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel id="StatusResistRow" className="StatRow">
                        <Label id="StatusResistLabel" localizedText="#DOTA_HUD_StatusResist" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="StatusResist=" text={`${status_resistance}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="EvasionRow" className="StatRow">
                        <Label id="EvasionLabel" localizedText="#DOTA_HUD_Evasion" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="Evasion" text={`${evasion}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MoveSpeedRow" className={CSSHelper.ClassMaker("StatRow", rowcls_move_speed)}>
                        <Label id="MoveSpeedLabel" localizedText="#DOTA_HUD_MoveSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="MoveSpeed" text={`${base_move_speed}`} className="BaseValue" />
                            <Label id="MoveSpeedBonus" text={`${bonus_move_speed}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="FriendlySummonContainer" className={CSSHelper.ClassMaker("SecondaryContainer TopBottomFlow", { Hidden: !bFriendlySummon })}>
                    <Panel id="DamageRow" className={CSSHelper.ClassMaker("StatRow", rowcls_damage)}>
                        <Label id="DamageLabel" localizedText="#DOTA_HUD_Damage" className="StatName" />
                        <Panel className="LeftRightFlow">
                            {/* <Label id="Damage" text="{d:base_damage_min} - {d:base_damage_max}" className="BaseValue" /> */}
                            <Label id="Damage" text={`${base_damage}`} className="BaseValue" />
                            <Label id="DamageBonus" text={`${bonus_damage}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackSpeedRow" className="StatRow">
                        <Label id="AttackSpeedLabel" localizedText="#DOTA_HUD_AttackSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackSpeed" text={`${attack_speed}`} className="BaseValue" />
                            <Label id="AttacksPerSecond" text={` (${seconds_per_attack})`} className="BaseValue AdditionalValue" />
                        </Panel>
                    </Panel>
                    <Panel className={CSSHelper.ClassMaker("AttackCritRow StatRow", rowcls_Crit)}>
                        <Label id="AttackCritLabel" localizedText="#DOTA_HUD_AttackCrit" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="BaseAttackCrit" text={`${base_attack_crit_chance}%`} className="BaseValue" />
                            <Label id="BonusAttackCrit" text={`${bonus_attack_crit_chance}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="AttackCritDamageRow" className={CSSHelper.ClassMaker("StatRow", rowcls_Crit_damage)}>
                        <Label id="AttackCritDamageLabel" localizedText="#DOTA_HUD_AttackCritDamage" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="AttackCritDamage" text={`${base_attack_crit_damage}%`} className="BaseValue" />
                            <Label id="BonusAttackCritDamage" text={`${bonus_attack_crit_damage}%`} className="BonusValue" />
                        </Panel>
                    </Panel>
                    <Panel id="IgnorePhysicalArmorPercentRow" className="StatRow">
                        <Label id="IgnorePhysicalArmorPercentLabel" localizedText="#DOTA_HUD_IgnorePhysicalArmorPercent" className="StatName" html={true} />
                        <Panel className="LeftRightFlow">
                            <Label id="IgnorePhysicalArmorPercent" text={`${ignore_physical_armor_percent}%`} className="BaseValue" />
                        </Panel>
                    </Panel>
                    <Panel id="MoveSpeedRow" className="StatRow">
                        <Label id="MoveSpeedLabel" localizedText="#DOTA_HUD_MoveSpeed" className="StatName" />
                        <Panel className="LeftRightFlow">
                            <Label id="MoveSpeed" text={`${base_move_speed}`} className="BaseValue" />
                            <Label id="MoveSpeedBonus" text={`${bonus_move_speed}`} className="BonusValue" />
                        </Panel>
                    </Panel>
                </Panel>
            </Panel>
            <Panel id="PrimaryTipContainer">
                <Label id="PrimaryTip" localizedText="#P6_Primary_tip" />
            </Panel>
            <Panel id="AttributesContainer" className="TopBottomFlow">
                <Panel id="StrengthContainer" className={CSSHelper.ClassMaker("LeftRightFlow AttributeRow",
                    rowcls_strength,
                    {
                        PrimaryAttribute: iPrimaryAttribute == Attributes.DOTA_ATTRIBUTE_STRENGTH,
                    })}>
                    <Panel id="StrengthIcon" className="AttributeIcon" />
                    <Panel className="AttributeDetails TopBottomFlow">
                        <Panel id="AttributeValues" className="LeftRightFlow">
                            <Label id="BaseStrengthLabel" className="BaseAttributeValue" text={`${base_strength}`} />
                            <Label id="BonusStrengthLabel" className="BonusAttributeValue" text={`${bonus_strength}`} />
                            <Label id="TotalStrengthLabel" className="TotalAttributeValue" text={`${total_strength}`} />
                        </Panel>
                        <Label id="StrengthDamageLabel" className="PrimaryAttributeBonus" localizedText="#P6_StrengthDetails_Custom_Primary" html={true} dialogVariables={strengthdialogVariable} />
                        <Label id="StrengthDetails" className="StatBreakdownLabel" localizedText="#P6_StrengthDetails_Custom" dialogVariables={strengthdialogVariable} />
                    </Panel>
                </Panel>
                <Panel id="AgilityContainer" className={CSSHelper.ClassMaker("LeftRightFlow AttributeRow",
                    rowcls_agility, {
                    PrimaryAttribute: iPrimaryAttribute == Attributes.DOTA_ATTRIBUTE_AGILITY,
                })}>
                    <Panel id="AgilityIcon" className="AttributeIcon" />
                    <Panel className="AttributeDetails TopBottomFlow">
                        <Panel id="AttributeValues" className="LeftRightFlow">
                            <Label id="BaseAgilityLabel" className="BaseAttributeValue" text={`${base_agility}`} />
                            <Label id="BonusAgilityabel" className="BonusAttributeValue" text={`${bonus_agility}`} />
                            <Label id="TotalAgilityabel" className="TotalAttributeValue" text={`${total_agility}`} />
                        </Panel>
                        <Label id="AgilityDamageLabel" className="PrimaryAttributeBonus" localizedText="#P6_AgilityDetails_Custom_Primary" dialogVariables={agilitydialogVariable} />
                        <Label id="AgilityDetails" className="StatBreakdownLabel" localizedText="#P6_AgilityDetails_Custom" dialogVariables={agilitydialogVariable} />
                    </Panel>
                </Panel>
                <Panel id="IntellectContainer" className={CSSHelper.ClassMaker("LeftRightFlow AttributeRow", rowcls_intellect, {
                    PrimaryAttribute: iPrimaryAttribute == Attributes.DOTA_ATTRIBUTE_INTELLECT,
                })}>
                    <Panel id="IntellectIcon" className="AttributeIcon" />
                    <Panel className="AttributeDetails TopBottomFlow">
                        <Panel id="AttributeValues" className="LeftRightFlow">
                            <Label id="BaseIntellectLabel" className="BaseAttributeValue" text={`${base_intellect}`} />
                            <Label id="BonusIntellectLabel" className="BonusAttributeValue" text={`${bonus_intellect}`} />
                            <Label id="TotalIntellectLabel" className="TotalAttributeValue" text={`${total_intellect}`} />
                        </Panel>
                        <Label id="IntellectDamageLabel" className="PrimaryAttributeBonus" localizedText="#P6_IntellectDetails_Custom_Primary" dialogVariables={intellectdialogVariable} />
                        <Label id="IntellectDetails" className="StatBreakdownLabel" localizedText="#P6_IntellectDetails_Custom" dialogVariables={intellectdialogVariable} />
                    </Panel>
                </Panel>
            </Panel>
        </Panel>

    }
}