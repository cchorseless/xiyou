import { GameFunc } from "../../GameFunc";
import { BattleHelper } from "../../helper/BattleHelper";
import { KVHelper } from "../../helper/KVHelper";
import { ResHelper } from "../../helper/ResHelper";
import { PropertyConfig } from "../../shared/PropertyConfig";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, modifier_event } from "../propertystat/modifier_event";


/**
 * 自定义属性计算
 */
@registerModifier()
export class modifier_property extends BaseModifier_Plus {
    /**
     * 计算属性
     * @Both
     * @param target 计算NPC
     * @param event 事件数据
     * @param k 属性类型
     * @returns
     */
    static SumProps(target: IBaseNpc_Plus, event: any, ...k: Array<PropertyConfig.EMODIFIER_PROPERTY>): number {
        let _r = 0;
        if (!GameFunc.IsValid(target)) {
            return _r
        }
        let info = BaseModifier_Plus.GetAllModifiersInfo(target)
        if (info == null) return 0;
        for (let ModifierName in info) {
            let allM: Array<IModifier_Plus> = info[ModifierName];
            for (let m of allM) {
                let _Property = m.__AllRegisterProperty
                let _Function = m.__AllRegisterFunction
                while (k.length > 0) {
                    let _k = k.shift();
                    let _sum = (PropertyConfig.UNIQUE_PROPERTY.indexOf(_k) == -1);
                    if (_Property && _Property[_k]) {
                        _Property[_k].forEach(
                            (attr: string) => {
                                let r = (m as any)[attr]
                                if (r) {
                                    // 属性累加
                                    if (_sum) {
                                        _r += r
                                    }
                                    // 属性求最大
                                    else {
                                        _r = math.max(_r, r);
                                    }
                                }
                            }
                        )
                    }
                    if (_Function && _Function[_k]) {
                        _Function[_k].forEach(
                            (func) => {
                                let [func_finish, r] = pcall(func, m, event)
                                if (func_finish && r) {
                                    // 属性累加
                                    if (_sum) {
                                        _r += (r as number)
                                    }
                                    // 属性求最大
                                    else {
                                        _r = math.max(_r, r as number);
                                    }
                                }
                            }
                        )
                    }

                }
            }
        }
        return _r
    }
    /**额外基础攻击力
     * @Both
     * @param hUnit 
     * @param tParams 
     * @returns 
     */
    static GetBaseBonusDamage(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    }
    /** 基础物理防御
     * @Both
     * @param hUnit 
     * @returns 
     */
    static GetBasePhysicalArmor(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
    }
    static GetBonusPhysicalArmor(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    }
    static GetBasePhysicalArmorPercentage(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE)
    }
    static GetPhysicalArmorPercentage(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_PERCENTAGE)
    }

    static GetIgnorePhysicalArmorPercentageTarget(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_TARGET)
    }
    //  魔法防御
    static GetBaseMagicalArmor(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE)
    }
    static GetBonusMagicalArmor(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    }
    static GetBaseMagicalArmorPercentage(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE_PERCENTAGE)
    }
    static GetMagicalArmorPercentage(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_PERCENTAGE)
    }

    static GetIgnoreMagicalArmorConstant(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_CONSTANT,)
    }
    static GetIgnoreMagicalArmorPercentageTarget(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_TARGET,)
    }

    //  技能增强
    static GetBaseSpellAmplify(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BASE,)
    }
    static GetBonusSpellAmplify(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS,)
    }
    static GetBonusSpellAmplifyUnique(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS_UNIQUE,)
    }
    static GetSpellAmplify(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.GetBaseSpellAmplify(hUnit, tParams) + this.GetBonusSpellAmplify(hUnit, tParams) + this.GetBonusSpellAmplifyUnique(hUnit, tParams)
    }
    //  生命值
    static GetHealthBonus(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    }
    static GetHealthPercentage(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    }
    static GetHealthPercentageEnemy(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENT_ENEMY)
    }
    //  生命恢复
    static GetHealthRegen(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    }
    //  魔法值
    static GetManaBonus(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    }
    static GetManaPercentage(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_PERCENTAGE)
    }
    static GetBaseMana(hUnit: IBaseNpc_Plus) {
        let fValue = 0
        if (hUnit != null) {
            if (GameFunc.IsValid(hUnit) && hUnit.__BaseStatusMana == null) {
                hUnit.__BaseStatusMana = GToNumber(KVHelper.GetUnitData(hUnit.GetUnitName(), "StatusMana"))
            }
            if (hUnit.__BaseStatusMana != null) {
                fValue = hUnit.__BaseStatusMana
            }
        }
        return fValue
    }
    static GetTotalManaBonus(hUnit: IBaseNpc_Plus) {
        let fPercent = this.GetManaPercentage(hUnit) * 0.01
        return this.GetManaBonus(hUnit) * (1 + fPercent) + this.GetBaseMana(hUnit) * fPercent
    }
    //  魔法恢复
    static GetManaRegen(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE)
    }

    static GetManaRegenAmplify(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE,)
    }

    static GetManaRegenTotal(hUnit: IBaseNpc_Plus) {
        return (GToNumber(KVHelper.GetUnitData(hUnit.GetUnitName(), "StatusManaRegen")) + this.GetManaRegen(hUnit)) * (1 + this.GetManaRegenAmplify(hUnit) / 100)
    }
    //  状态抗性
    static GetStatusResistanceStack(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    }
    static GetStatusResistanceUnique(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_UNIQUE)
    }
    static GetStatusResistance(hUnit: IBaseNpc_Plus) {
        return (1 - (1 - this.GetStatusResistanceStack(hUnit) * 0.01) * (1 - this.GetStatusResistanceUnique(hUnit) * 0.01)) * 100
    }
    static GetStatusResistanceCaster(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_CASTER)
    }
    //  闪避
    static GetEvasion(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,)
    }
    //  技能闪避
    static GetSpellEvasion(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_EVASION,)
    }
    //  冷却减少
    static GetCooldownReduction(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let cd_reduction = this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,)
        let max_cd_reduction = this.GetMaxCooldownReduction(hUnit, tParams)
        if (max_cd_reduction > 0 && max_cd_reduction < cd_reduction) {
            return max_cd_reduction
        }
        return cd_reduction
    }
    static GetMaxCooldownReduction(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.MAX_COOLDOWN_PERCENTAGE,)
    }
    //  物理暴击
    static GetCriticalStrikeChance(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        if (this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.NO_CRITICALSTRIKE,) >= 1) {
            return 0
        }
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE,) + GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_CHANCE
    }
    //  物理暴击伤害
    static GetCriticalStrikeDamage(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let fDamage = GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_DAMAGE + this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE,)
        if (tParams && GameFunc.IsValid(tParams.target)) {
            fDamage = fDamage + this.SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_CRITICALSTRIKE_DAMAGE_CONSTANT,)
        }
        let fPercent = this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE_TOTAL,)
        return fDamage * (1 + fPercent / 100)
    }
    // 物理暴击时技能暴击补偿
    static GetCriticalStrikeDamage_Mix(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_MIX_PERCENT,) * 0.01 * this.GetSpellCriticalStrikeDamage(hUnit, tParams)
    }
    //  技能暴击概率
    static GetSpellCriticalStrikeChance(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        if (this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.NO_SPELL_CRITICALSTRIKE,) >= 1) {
            return 0
        }
        let fChance = this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE,) + GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_CHANCE
        if (tParams && GameFunc.IsValid(tParams.target)) {
            fChance = fChance + this.SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE_TARGET,)
        }
        return fChance
    }
    //  技能暴击伤害
    static GetSpellCriticalStrikeDamage(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let fDamage = GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_DAMAGE + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE)
        if (tParams && GameFunc.IsValid(tParams.target)) {
            fDamage = fDamage + this.SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_CRITICALSTRIKE_DAMAGE_CONSTANT)
        }
        let fPercent = this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE_TOTAL,)
        return fDamage * (1 + fPercent / 100)
    }
    // 技能暴击时物理暴击补偿
    static GetSpellCriticalStrikeDamage_Mix(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_MIX_PERCENT,) * 0.01 * this.GetCriticalStrikeDamage(hUnit, tParams)
    }
    //  最大攻击速度
    static GetBonusMaximumAttackSpeed(hUnit: IBaseNpc_Plus) {
        if (this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS_UNABLE) >= 1) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    }
    static GetMaximumAttackSpeed(hUnit: IBaseNpc_Plus) {
        return this.GetBonusMaximumAttackSpeed(hUnit) + GPropertyConfig.MAXIMUM_ATTACK_SPEED
    }
    static GetOutgoingDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE,)
    }
    static GetOutgoingPhysicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE,)
    }
    static GetOutgoingMagicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE,)
    }
    static GetOutgoingPureDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PURE_DAMAGE_PERCENTAGE,)
    }
    //  受到的伤害
    static GetIncomingDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,)
    }
    static GetIncomingPhysicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,)
    }
    static GetIncomingMagicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE,)
    }
    static GetIncomingPureDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE,)
    }
    static GetIncomingDamagePercentEnemy(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE_ENEMY,)
    }
    // 毒伤害相关
    static GetIncomingPoisonDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE,)
    }
    static GetOutgoingPoisonCountPercent(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_POISON_COUNT_PERCENTAGE)
    }
    static GetIncomingPoisonCountPercent(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_COUNT_PERCENTAGE)
    }
    static GetPoisonActiveTimePercent(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.POISON_ACTIVE_TIME_PERCENTAGE)
    }
    static GetPoisonActiveIncreasePercent(hUnit: IBaseNpc_Plus) {
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.POISON_ACTIVE_INCREASE_PERCENTAGE)
    }
    static GetPoisonImmune(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return this.SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.POISON_IMMUNE,)
    }

    /**-------------基础三围-------------------- */
    static GetBaseStrength(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return math.max(math.floor(this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE)), 0) + this.GetBaseAllStat(hUnit)
    }
    static GetBaseAgility(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return math.max(math.floor(this.SumProps(hUnit, null, (GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BASE))), 0) + this.GetBaseAllStat(hUnit)
    }
    static GetBaseIntellect(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return math.max(math.floor(this.SumProps(hUnit, null, (GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BASE))), 0) + this.GetBaseAllStat(hUnit)
    }
    /**-------------基础三围百分比-------------------- */
    static GetBaseStrengthPercentage(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE_PERCENTAGE)
    }
    static GetBaseAgilityPercentage(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BASE_PERCENTAGE)
    }
    static GetBaseIntellectPercentage(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BASE_PERCENTAGE)
    }
    /**-------------三围加成-------------------- */
    static GetBaseAllStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BASE);
    }
    static GetBonusAllStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    }
    static GetBonusPrimaryStat(hUnit: IBaseNpc_Plus, iPrimaryStat: Attributes) {
        if (hUnit.GetPrimaryAttribute && hUnit.GetPrimaryAttribute() == iPrimaryStat) {
            return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_BONUS)
        }
        return 0
    }
    static GetBonusStrength(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS) + this.GetBonusAllStat(hUnit)
    }
    static GetBonusAgility(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS) + this.GetBonusAllStat(hUnit)
    }
    static GetBonusIntellect(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS) + this.GetBonusAllStat(hUnit)
    }
    // // // // // // // // // // // // // // // // // // // -三围百分比加成// // // // // // // // // // // // // // // // // // // -
    static GetAllStatPercent(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_PERCENTAGE)
    }
    static GetPrimaryStatPercent(hUnit: IBaseNpc_Plus, iPrimaryStat: Attributes) {
        if (type(hUnit.GetPrimaryAttribute) == "function" && hUnit.GetPrimaryAttribute() == iPrimaryStat) {
            return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_PERCENTAGE)
        } else {
            return 0
        }
    }
    static GetStrengthPercentage(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE) + this.GetAllStatPercent(hUnit) + this.GetPrimaryStatPercent(hUnit, Attributes.DOTA_ATTRIBUTE_STRENGTH)
    }
    static GetAgilityPercentage(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_PERCENTAGE) + this.GetAllStatPercent(hUnit) + this.GetPrimaryStatPercent(hUnit, Attributes.DOTA_ATTRIBUTE_AGILITY)
    }
    static GetIntellectPercentage(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_PERCENTAGE) + this.GetAllStatPercent(hUnit) + this.GetPrimaryStatPercent(hUnit, Attributes.DOTA_ATTRIBUTE_INTELLECT)
    }
    // // // // // // // // // // // // // // // // // // // -总三围// // // // // // // // // // // // // // // // // // // -
    static GetStrength(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = this.GetStrengthPercentage(hUnit) * 0.01
        return math.max(math.floor(this.GetBaseStrength(hUnit) * (1 + this.GetBaseStrengthPercentage(hUnit) * 0.01 + fTotalPercent) + this.GetBonusStrength(hUnit) * (1 + fTotalPercent)), 0) + this.GetBonusPrimaryStat(hUnit, Attributes.DOTA_ATTRIBUTE_STRENGTH) * (1 + fTotalPercent) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS_NO_PERCENTAGE)
    }
    static GetAgility(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = this.GetAgilityPercentage(hUnit) * 0.01
        return math.max(math.floor(this.GetBaseAgility(hUnit) * (1 + this.GetBaseAgilityPercentage(hUnit) * 0.01 + fTotalPercent) + this.GetBonusAgility(hUnit) * (1 + fTotalPercent)), 0) + this.GetBonusPrimaryStat(hUnit, Attributes.DOTA_ATTRIBUTE_AGILITY) * (1 + fTotalPercent) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS_NO_PERCENTAGE)
    }
    static GetIntellect(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = this.GetIntellectPercentage(hUnit) * 0.01
        return math.max(math.floor(this.GetBaseIntellect(hUnit) * (1 + this.GetBaseIntellectPercentage(hUnit) * 0.01 + fTotalPercent) + this.GetBonusIntellect(hUnit) * (1 + fTotalPercent)), 0) + this.GetBonusPrimaryStat(hUnit, Attributes.DOTA_ATTRIBUTE_INTELLECT) * (1 + fTotalPercent) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS_NO_PERCENTAGE)
    }
    // // // // // // // // // // // // // // // // // // // -总三围百分比但去掉主属性加成// // // // // // // // // // // // // // // // // // // -
    static GetStrengthPercentageWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE) + this.GetAllStatPercent(hUnit)
    }
    static GetAgilityPercentageWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_PERCENTAGE) + this.GetAllStatPercent(hUnit)
    }
    static GetIntellectPercentageWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_PERCENTAGE) + this.GetAllStatPercent(hUnit)
    }
    // // // // // // // // // // // // // // // // // // // -总三围但去掉主属性加成// // // // // // // // // // // // // // // // // // // -
    static GetStrengthWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = this.GetStrengthPercentageWithoutPrimaryStat(hUnit) * 0.01
        return math.max(math.floor(this.GetBaseStrength(hUnit) * (1 + this.GetBaseStrengthPercentage(hUnit) * 0.01 + fTotalPercent) + this.GetBonusStrength(hUnit) * (1 + fTotalPercent) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS_NO_PERCENTAGE)), 0)
    }
    static GetAgilityWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = this.GetAgilityPercentageWithoutPrimaryStat(hUnit) * 0.01
        return math.max(math.floor(this.GetBaseAgility(hUnit) * (1 + this.GetBaseAgilityPercentage(hUnit) * 0.01 + fTotalPercent) + this.GetBonusAgility(hUnit) * (1 + fTotalPercent) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS_NO_PERCENTAGE)), 0)
    }
    static GetIntellectWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = this.GetIntellectPercentageWithoutPrimaryStat(hUnit) * 0.01
        return math.max(math.floor(this.GetBaseIntellect(hUnit) * (1 + this.GetBaseIntellectPercentage(hUnit) * 0.01 + fTotalPercent) + this.GetBonusIntellect(hUnit) * (1 + fTotalPercent) + this.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS_NO_PERCENTAGE)), 0)
    }
    /**
     * 计算魔法抵抗
     * @param target
     * @param event
     */
    static GetMagicalReduction(target: IBaseNpc_Plus, event: ModifierAttackEvent) {
        let iDamageFlags = event.damage_flags;
        // 无视魔法护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR) {
            return 0
        }
        let fValue = modifier_property.GetMagicalArmor(target)
        if (event && GameFunc.IsValid(event.attacker) && fValue > 0) {
            fValue = fValue - math.min(modifier_property.SumProps(target, event, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR), fValue)
            fValue = fValue - math.max(fValue * modifier_property.GetIgnoreMagicalArmorPercentage(event.attacker as IBaseNpc_Plus) * 0.01, 0)
        }
        return GPropertyConfig.MAGICAL_ARMOR_FACTOR * fValue / (1 + GPropertyConfig.MAGICAL_ARMOR_FACTOR * math.abs(fValue))
    }
    /**
     * 计算魔法护甲
     * @param target
     */
    static GetMagicalArmor(target: IBaseNpc_Plus) {
        let BaseMagicalArmor = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE);
        let BaseMagicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE_PERCENTAGE);
        let MagicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_PERCENTAGE);
        let BonusMagicalArmor = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS);
        return (BaseMagicalArmor * (1 + BaseMagicalArmorPercentage * 0.01) + BonusMagicalArmor) * (1 + MagicalArmorPercentage * 0.01)
    }

    /**
     * 无视魔法护甲百分比
     * @param target
     * @returns
     */
    static GetIgnoreMagicalArmorPercentage(target: IBaseNpc_Plus) {
        let IGNORE_MAGICAL_ARMOR_PERCENTAGE = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE);
        let IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE);
        return -((1 - IGNORE_MAGICAL_ARMOR_PERCENTAGE * 0.01) * (1 - IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE * 0.01) - 1) * 100
    }

    /**
     * 物理护甲减免
     * @param target
     * @param event
     */
    static GetPhysicalReduction(target: IBaseNpc_Plus, event: ModifierAttackEvent) {
        let iDamageFlags = event.damage_flags;
        // 无视魔法护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR) {
            return 0
        }
        let fValue = this.GetPhysicalArmor(target);
        // 无视基础物理护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_BASE_PHYSICAL_ARMOR) {
            fValue -= this.GetPhysicalArmor_Base(target);
        }
        let fValue_active = this.GetPhysicalArmor_Active(target);
        // 负甲的时候不计算无视护甲
        if (fValue > 0) {
            if (event && GameFunc.IsValid(event.attacker)) {
                let fIgnore = modifier_property.SumProps(event.attacker, event, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR);
                fValue = math.max(fValue - fIgnore, 0);
                if (fValue > 0) {
                    let fIgnorePect = modifier_property.GetIgnorePhysicalArmorPercentage(event.attacker);
                    fValue = fValue - math.max(fValue * fIgnorePect * 0.01, 0);
                }
            }
        }
        fValue = math.max(fValue, fValue_active)
        return GPropertyConfig.PHYSICAL_ARMOR_FACTOR * fValue / (1 + GPropertyConfig.PHYSICAL_ARMOR_FACTOR * math.abs(fValue))
    }

    /**
     * 基础物理护甲
     * @param target
     * @returns
     */
    static GetPhysicalArmor_Base(target: IBaseNpc_Plus) {
        let BasePhysicalArmor = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE);
        let BasePhysicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE);
        let PhysicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        return BasePhysicalArmor * (1 + BasePhysicalArmorPercentage * 0.01) * (1 + PhysicalArmorPercentage * 0.01)
    }

    /**
     * 计算物理护甲
     * @param target
     */
    static GetPhysicalArmor(target: IBaseNpc_Plus) {
        let BasePhysicalArmor = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE);
        let BasePhysicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE);
        let PhysicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        let BonusPhysicalArmor = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS);
        // 唯一值
        let BonusPhysicalArmor_UNIQU = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE);
        // 无法被无视
        let BonusPhysicalArmor_UNIQUE_ACTIVE = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE);
        return (BasePhysicalArmor * (1 + BasePhysicalArmorPercentage * 0.01) + BonusPhysicalArmor + BonusPhysicalArmor_UNIQU + BonusPhysicalArmor_UNIQUE_ACTIVE) * (1 + PhysicalArmorPercentage * 0.01)
    }
    /**
     * 计算无法被无视的护甲值
     * @param target
     * @returns
     */
    static GetPhysicalArmor_Active(target: IBaseNpc_Plus) {
        let BonusPhysicalArmor_UNIQUE_ACTIVE = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE);
        let PhysicalArmorPercentage = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        return BonusPhysicalArmor_UNIQUE_ACTIVE * (1 + PhysicalArmorPercentage * 0.01)
    }


    /**
     * 无视物理护甲百分比
     * @param target
     */
    static GetIgnorePhysicalArmorPercentage(target: IBaseNpc_Plus) {
        let IGNORE_PHYSICAL_ARMOR_PERCENTAGE = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE);
        let IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE);
        return -((1 - IGNORE_PHYSICAL_ARMOR_PERCENTAGE * 0.01) * (1 - IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE * 0.01) - 1) * 100
    }

    //#region JS-CLIENTLUA
    static call_level: number;
    static call_key: string;
    static call_ability: EntityIndex;
    static call_unit: EntityIndex;
    static call_func: string;
    GetTexture(): string {
        if (modifier_property.call_ability != null) {
            let hAbility = EntIndexToHScript(modifier_property.call_ability) as IBaseAbility_Plus;
            let iLevel = modifier_property.call_ability!;
            let sKeyName = modifier_property.call_key!;
            modifier_property.call_ability = null;
            modifier_property.call_ability = null;
            modifier_property.call_key = null;
            if (GameFunc.IsValid(hAbility) && hAbility.GetLevelSpecialValueFor != null) {
                switch (sKeyName) {
                    case "cool_down":
                        return tostring(hAbility.GetCooldown(iLevel));
                    case "mana_cost":
                        return tostring(hAbility.GetManaCost(iLevel));
                    case "gold_cost":
                        return tostring(hAbility.GetGoldCost(iLevel));
                    default:
                        return tostring(hAbility.GetLevelSpecialValueFor(sKeyName, iLevel));
                }
            }
            return "";
        }
        if (modifier_property.call_unit != null) {
            let hUnit = EntIndexToHScript(modifier_property.call_unit) as IBaseNpc_Plus;
            let sFunctionName = modifier_property.call_func!;
            modifier_property.call_unit = null;
            modifier_property.call_func = null;
            let func = (modifier_property as any)[sFunctionName];
            if (GameFunc.IsValid(hUnit) && func != null && typeof func == "function") {
                return tostring(func(hUnit));
            }
            return "";
        }
        return "";
    }
    //#endregion JS-CLIENTLUA



    OnCreated(params: object) {
        super.OnCreated(params);
        if (IsServer()) {
            this.SetHasCustomTransmitterData(true)
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                this.Calculate_Hp()
                return 1
            }))
        }
    }
    /**最大气血 */
    currentMaxHp: number;
    GetBaseMaxHealth(hUnit: IBaseNpc_Plus) {
        let fDefault = 0;
        if (GameFunc.IsValid(hUnit) && hUnit.__BaseStatusHealth == null) {
            hUnit.__BaseStatusHealth = GToNumber(KVHelper.GetUnitData(hUnit.GetUnitName(), "StatusHealth"));
        }
        if (hUnit.__BaseStatusHealth != null) {
            fDefault = hUnit.__BaseStatusHealth;
        }
        let hp_base = modifier_property.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_BASE)
        return fDefault + hp_base;
    }
    /**用于计算气血属性 */
    Calculate_Hp() {
        let parent = this.GetParentPlus();
        if (parent == null) { return }
        let fHealthPercent = parent.GetHealth() / parent.GetMaxHealth();
        let extraHp = modifier_property.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
        let extraPect = modifier_property.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS_PERCENTAGE)
        let hpPect = modifier_property.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
        let baseMaxHealth = this.GetBaseMaxHealth(parent);
        let maxhp = (baseMaxHealth + extraHp * (1 + extraPect * 0.01)) * (1 + hpPect * 0.01);
        let fCorrectHealth = math.floor(maxhp);
        if (this.currentMaxHp != fCorrectHealth) {
            this.currentMaxHp = fCorrectHealth;
            parent.SetBaseMaxHealth(fCorrectHealth);
            parent.SetMaxHealth(fCorrectHealth);
            parent.ModifyHealth(math.floor(fHealthPercent * fCorrectHealth), null, false, 0)
        }

    }


    DeclareFunctions(): modifierfunction[] {
        return Array.from(PropertyConfig.CustomDeclarePropertyEvent);
    }
    /**
     * 额外基础攻击力
     * @returns
     */
    GetModifierBaseAttack_BonusDamage(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    }
    /**
     * 技能CD减少
     */
    GetModifierPercentageCooldown(event: ModifierAbilityEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), event, GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    }

    /**闪避 */
    GetModifierEvasion_Constant(event: ModifierAttackEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), event, GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    }

    /**气血恢复 */
    GetModifierConstantHealthRegen(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    }
    /**
     * 额外魔法值
     * @returns
     */
    GetModifierManaBonus(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    }

    /**
     * 魔法恢复
     * @returns
     */
    GetModifierConstantManaRegen(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT);
    }
    /**
     * 技能增伤
     * @param event
     * @returns
     */
    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), null,
            GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_CREEP,
            GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
        );
    }

    /**
     * 最大攻速上限
     * @returns
     */
    GetModifierAttackSpeedBaseOverride(): number {
        let parent = this.GetParentPlus()
        let fBonus = modifier_property.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
        let current = 1 + parent.GetIncreasedAttackSpeed();
        let minpect = GPropertyConfig.MINIMUM_ATTACK_SPEED * 0.01;
        let maxpect = (GPropertyConfig.MAXIMUM_ATTACK_SPEED + fBonus) * 0.01
        return GameFunc.mathUtil.Clamp(current, minpect, maxpect)
    }
    /**额外攻速 */
    GetModifierAttackSpeedBonus_Constant(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    }

    /**
     * 伤害倍率，发生暴击在这里返回暴击伤害
     * @param event
     * @returns
     */
    GetModifierPreAttack_CriticalStrike(event: ModifierAttackEvent): number {
        if (IsServer()) {
            let hAttacker = event.attacker as IBaseNpc_Plus;
            let hTarget = event.target as IBaseNpc_Plus;
            if (hAttacker == this.GetParentPlus()) {
                // 不暴击
                if (BattleHelper.AttackFilter(event.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CRIT)) {
                    return 0
                }
                let bool = false;
                let _chanceEnum = 0;
                let _damage_r = 0;
                // 随机
                switch (event.damage_category) {
                    // 技能
                    case DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL:
                        _damage_r = (GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_DAMAGE + modifier_property.SumProps(hAttacker, event, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE))
                        break
                    // 普攻
                    case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                        _damage_r = (GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_DAMAGE + modifier_property.SumProps(hAttacker, event, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE))
                        break
                }
                // 必定暴击
                if (BattleHelper.AttackFilter(event.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_CRIT)) {
                    bool = true;
                }
                else {
                    switch (event.damage_category) {
                        // 技能
                        case DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL:
                            _chanceEnum = GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE;
                            break
                        // 普攻
                        case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                            _chanceEnum = GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE
                            break
                    }
                    // 我方主动攻击暴击概率
                    let fChance = modifier_property.SumProps(hAttacker, event, _chanceEnum);
                    // 目标受击暴击概率
                    let tChance = modifier_property.SumProps(hTarget, event, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
                    fChance = fChance * (1 + tChance * 0.01)
                    if (GameFunc.mathUtil.PRD(fChance, this.GetParentPlus(), 'GetModifierPreAttack_CriticalStrike')) {
                        bool = true;
                    }
                }
                if (bool) {
                    BattleHelper.SetAttackCrit(event.record);
                    switch (event.damage_category) {
                        // 技能
                        case DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL:
                            modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_SPELL_CRIT);
                            break
                        // 普攻
                        case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                            modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_CRIT);
                            break
                    }
                    modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ANY_CRIT);
                    return _damage_r
                }
            }
        }
        return 0
    }
    /**
     * 我方受击后,受到收到暴击的概率
     * @returns
     */
    GetModifierPreAttack_Target_CriticalStrike(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
    }



    // GetModifierTotalDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
    //     return 100
    // }
    GetModifierDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), event,
            GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    }



    /**
     * 收到伤害加深百分比
     * @param params
     * @returns
     */
    GetModifierIncomingDamage_Percentage(params: ModifierAttackEvent): number {
        let iDamageFlags = params.damage_flags
        let iDamageType = params.damage_type
        let iDamageCategory = params.damage_category
        let fPercent = 100
        let hTarget = params.target as IBaseNpc_Plus;
        if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_BEFORE_TRANSFORMED_DAMAGE)) {
            return 0
        }
        // 技能暴击特效
        if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_SPELL_CRIT) && params.original_damage > 0) {
            let iNumber = math.floor(params.original_damage)
            let sNumber = tostring(iNumber)
            let fDuration = 3
            let vColor = Vector(0, 191, 255)
            let iParticleID = ResHelper.CreateParticle(
                {
                    resPath: "particles/msg_fx/msg_crit.vpcf",
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN
                })
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(0, iNumber, 4))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(fDuration, sNumber.length + 1, 0))
            ParticleManager.SetParticleControl(iParticleID, 3, vColor)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
        if (GameFunc.IsValid(hTarget)) {
            // 无视伤害加深
            let bDamageAmplify = !BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY);
            let _tmp = 0
            switch (iDamageType) {
                case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
                    fPercent = fPercent * (1 - modifier_property.GetMagicalReduction(hTarget, params))
                    //  魔法伤害加深
                    if (bDamageAmplify) {
                        _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  受到额外毒伤害 NOTE:若是以后毒伤害不是魔法伤害了，记得改到其他位置上
                    if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_POISON)) {
                        _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
                    fPercent = fPercent * (1 - modifier_property.GetPhysicalReduction(hTarget, params))
                    //  物理护甲
                    if (bDamageAmplify) {
                        _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
                    if (bDamageAmplify) {
                        _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  流血伤害加深
                    if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_BLEEDING)) {
                        _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_ALL:
                case DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL:
                    break
            }

            //  全伤害
            if (bDamageAmplify) {
                _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
            //  敌方的减伤，例如无尽的减伤
            // fPercent = fPercent * (1 + GetIncomingDamagePercentEnemy(hTarget, params) * 0.01)
            //  受到额外持续伤害
            if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT)) {
                _tmp = modifier_property.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DOT_DAMAGE_PERCENTAGE)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
        }
        return fPercent - 100
    }



    // GetModifierIncomingSpellDamageConstant(event: ModifierAttackEvent): number { return 0 }


}



declare global {
    /**
     * @ServerOnly
     */
    var Gmodifier_property: typeof modifier_property;
}
if (_G.Gmodifier_property == undefined) {
    _G.Gmodifier_property = modifier_property;
}