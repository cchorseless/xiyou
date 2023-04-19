import { KVHelper } from "../../helper/KVHelper";
import { PropertyConfig } from "../../shared/PropertyConfig";

export module PropertyCalculate {
    export let call_level: number;
    export let call_key: string;
    export let call_ability: EntityIndex;
    export let call_unit: EntityIndex;
    export let call_func: string;

    export function RunModifierFunc<T extends IBaseModifier_Plus>(buff: T, params: modifierfunction, event: any) {
        if (buff.__safedestroyed__) { return }
        let _r = 0;
        let _r_ = "";
        let _Property = buff.__AllRegisterProperty;
        let _Function = buff.__AllRegisterFunction;
        let _sum = PropertyConfig.UNIQUE_PROPERTY.indexOf(params as any) == -1;
        const params_key = params + "";
        if (_Property && _Property[params_key]) {
            _Property[params_key].forEach((attr: string) => {
                let r = (buff as any)[attr];
                if (r) {
                    switch (typeof r) {
                        case "number":
                            if (_sum) {
                                _r += r;
                            } else {
                                _r = math.max(_r, r);
                            }
                            break;
                        case "string":
                            _r_ = r;
                            break;
                    }
                }
            });
        }
        if (_Function && _Function[params_key]) {
            _Function[params_key].forEach((func) => {
                if (buff.__safedestroyed__ || (buff as any)[func] == null || type((buff as any)[func]) != 'function') { return }
                let r = event == null ? (buff as any)[func]() : (buff as any)[func](event);
                if (r != null) {
                    switch (typeof r) {
                        case "number":
                            if (_sum) {
                                _r += r;
                            } else {
                                _r = math.max(_r, r);
                            }
                            break;
                        case "string":
                            _r_ = r;
                            break;
                    }
                }
            });
        }
        // 优先返回字符串
        if (_r_.length != 0) {
            return _r_;
        }
        return _r;
    }

    /**
     * 计算属性
     * @Both
     * @param target 计算NPC
     * @param event 事件数据
     * @param k 属性类型
     * @returns
     */
    export function SumProps(target: IBaseNpc_Plus, event: any, ...k: Array<PropertyConfig.EMODIFIER_PROPERTY>): number {
        let _r = 0;
        if (!IsValid(target)) {
            return _r
        }
        let info = target.__AllModifiersInfo__;
        if (info == null) return 0;
        for (let ModifierName in info) {
            let allM = info[ModifierName];
            for (let m of allM) {
                if (m.__safedestroyed__) { continue; }
                let _Property = m.__AllRegisterProperty;
                let _Function = m.__AllRegisterFunction;
                if (_Property == null && _Function == null) { continue; }
                for (let p of k) {
                    let _sum = (PropertyConfig.UNIQUE_PROPERTY.indexOf(p) == -1);
                    const _k = p + "";
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
                                if ((m as any)[func] == null || type((m as any)[func]) != 'function') { return }
                                let r = event == null ? (m as any)[func]() : (m as any)[func](event);
                                if (r) {
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

    /**
    * @Both
    * @param k 
    * @returns 
    */
    export function GetUnitCache(hUnit: IBaseNpc_Plus, k: string) {
        let fDefault = 0;
        if (IsValid(hUnit)) {

            if (hUnit.TempData()[k] == null) {
                hUnit.TempData()[k] = GToNumber(KVHelper.GetUnitData(hUnit.GetUnitName(), k));
            }
            fDefault = hUnit.TempData()[k];
        }
        return fDefault;
    }
    /**
     * @Both
     * @param k 
     * @param v 
     */
    export function SetUnitCache(hUnit: IBaseNpc_Plus, k: string, v: number | string) {
        if (IsValid(hUnit)) {
            hUnit.TempData()[k] = v;
        }
    }

    /**
     * 总攻击力
     * @Both
     * @param hUnit 
     * @param tParams 
     * @returns 
     */
    export function GetAttackDamage(hUnit: IBaseNpc_Plus) {
        let baseatk = GetBaseAttackDamage(hUnit);
        let bounsatk = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE);
        let bounsatk_pect = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_PERCENTAGE);
        bounsatk = bounsatk * (100 + bounsatk_pect) / 100;
        let atk_pect = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE);
        return math.floor(baseatk + bounsatk * (100 + atk_pect) / 100);
    }
    /**基础攻击力
     * @Both
     * @param hUnit 
     * @param tParams 
     * @returns 
     */
    export function GetBaseAttackDamage(hUnit: IBaseNpc_Plus) {
        let fDefault = 0;
        if (IsValid(hUnit)) {
            fDefault = GetUnitCache(hUnit, "AttackDamage");
        }
        let baseatk = fDefault + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE);
        let baseatk_pect = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_DAMAGE_PERCENTAGE);
        let atk_pect = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE);
        return math.floor(baseatk * (1 + baseatk_pect * 0.01) * (1 + atk_pect * 0.01));
    }
    /** 基础物理防御
     * @Both
     * @param hUnit 
     * @returns 
     */
    export function GetBasePhysicalArmor(hUnit: IBaseNpc_Plus) {
        let fValue = 0;
        if (IsValid(hUnit)) {
            fValue = GetUnitCache(hUnit, "ArmorPhysical") + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE)
        }
        let BasePhysicalArmorPercentage = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE);
        let PhysicalArmorPercentage = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        return math.floor(fValue * (1 + BasePhysicalArmorPercentage * 0.01) * (1 + PhysicalArmorPercentage * 0.01))
    }

    /**
     * 计算物理护甲
     * @param target
     */
    export function GetPhysicalArmor(target: IBaseNpc_Plus) {
        let BasePhysicalArmor = GetBasePhysicalArmor(target);
        let PhysicalArmorPercentage = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        let BonusPhysicalArmor = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS);
        // 唯一值
        let BonusPhysicalArmor_UNIQU = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE);
        // 无法被无视
        let BonusPhysicalArmor_UNIQUE_ACTIVE = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE);
        BonusPhysicalArmor = (BonusPhysicalArmor + BonusPhysicalArmor_UNIQU + BonusPhysicalArmor_UNIQUE_ACTIVE) * (1 + PhysicalArmorPercentage * 0.01)
        return math.floor(BasePhysicalArmor + BonusPhysicalArmor);
    }
    /**
     * 计算无法被无视的护甲值
     * @param target
     * @returns
     */
    export function GetPhysicalArmor_Active(target: IBaseNpc_Plus) {
        let BonusPhysicalArmor_UNIQUE_ACTIVE = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE);
        let PhysicalArmorPercentage = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        return BonusPhysicalArmor_UNIQUE_ACTIVE * (1 + PhysicalArmorPercentage * 0.01)
    }


    export function GetIgnorePhysicalArmorPercentageTarget(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_TARGET)
    }
    /**
     * 物理护甲减免
     * @param target
     * @param event
     */
    export function GetPhysicalReductionPect(target: IBaseNpc_Plus, event: ModifierAttackEvent) {
        let iDamageFlags = event.damage_flags;
        // 无视魔法护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR) {
            return 0
        }
        let fValue = GetPhysicalArmor(target);
        // 无视基础物理护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_BASE_PHYSICAL_ARMOR) {
            fValue -= GetBasePhysicalArmor(target);
        }
        let fValue_active = GetPhysicalArmor_Active(target);
        // 负甲的时候不计算无视护甲
        if (fValue > 0) {
            if (event && IsValid(event.attacker)) {
                let fIgnore = SumProps(event.attacker, event, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR);
                fValue = math.max(fValue - fIgnore, 0);
                if (fValue > 0) {
                    let fIgnorePect = GetIgnorePhysicalArmorPercentage(event.attacker);
                    fValue = fValue - math.max(fValue * fIgnorePect * 0.01, 0);
                }
            }
        }
        fValue = math.max(fValue, fValue_active)
        return GPropertyConfig.PHYSICAL_ARMOR_FACTOR * fValue / (1 + GPropertyConfig.PHYSICAL_ARMOR_FACTOR * math.abs(fValue))
    }
    /**
     * 物理护甲减免，用于客户端显示
     * @param target 
     * @returns 
     */
    export function GetPhysicalReduction(target: IBaseNpc_Plus) {
        let fValue = GetPhysicalArmor(target)
        return GPropertyConfig.MAGICAL_ARMOR_FACTOR * fValue / (1 + GPropertyConfig.MAGICAL_ARMOR_FACTOR * math.abs(fValue))
    }
    /**
     * 无视物理护甲百分比
     * @param target
     */
    export function GetIgnorePhysicalArmorPercentage(target: IBaseNpc_Plus) {
        let IGNORE_PHYSICAL_ARMOR_PERCENTAGE = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE);
        let IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE);
        return -((1 - IGNORE_PHYSICAL_ARMOR_PERCENTAGE * 0.01) * (1 - IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE * 0.01) - 1) * 100
    }
    //  魔法防御
    export function GetBaseMagicalArmor(hUnit: IBaseNpc_Plus) {
        let fValue = 0;
        if (IsValid(hUnit)) {
            fValue = GetUnitCache(hUnit, "ArmorMagical") + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE)
        }
        let BaseMagicalArmorPercentage = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE_PERCENTAGE);
        let MagicalArmorPercentage = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_PERCENTAGE);
        return math.floor(fValue * (1 + BaseMagicalArmorPercentage * 0.01) * (1 + MagicalArmorPercentage * 0.01))
    }
    /**
     * 计算魔法护甲
     * @param target
     */
    export function GetMagicalArmor(target: IBaseNpc_Plus) {
        let BaseMagicalArmor = GetBaseMagicalArmor(target);
        let MagicalArmorPercentage = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_PERCENTAGE);
        let BonusMagicalArmor = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS);
        return math.floor(BaseMagicalArmor + BonusMagicalArmor * (1 + MagicalArmorPercentage * 0.01))
    }


    export function GetIgnoreMagicalArmorPercentageTarget(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_TARGET,)
    }
    /**
     * 计算魔法抵抗，用于战斗
     * @param target
     * @param event
     */
    export function GetMagicalReductionPect(target: IBaseNpc_Plus, event: ModifierAttackEvent) {
        let iDamageFlags = event.damage_flags;
        // 无视魔法护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR) {
            return 0
        }
        let fValue = GetMagicalArmor(target)
        if (event && IsValid(event.attacker) && fValue > 0) {
            fValue = fValue - math.min(SumProps(target, event, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR), fValue)
            fValue = fValue - math.max(fValue * GetIgnoreMagicalArmorPercentage(event.attacker as IBaseNpc_Plus) * 0.01, 0)
        }
        // 统计魔法抗性
        let magicalResistance = SumProps(target, event, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS);
        magicalResistance = magicalResistance * 0.01;
        return magicalResistance + GPropertyConfig.MAGICAL_ARMOR_FACTOR * fValue / (1 + GPropertyConfig.MAGICAL_ARMOR_FACTOR * math.abs(fValue))
    }
    /**
     * 统计魔法抗性，用于客户端显示
     * @param target 
     * @returns 
     */
    export function GetMagicalReduction(target: IBaseNpc_Plus) {
        let fValue = GetMagicalArmor(target)
        let magicalResistance = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS);
        magicalResistance = magicalResistance * 0.01;
        return magicalResistance + GPropertyConfig.MAGICAL_ARMOR_FACTOR * fValue / (1 + GPropertyConfig.MAGICAL_ARMOR_FACTOR * math.abs(fValue))
    }

    /**
     * 无视魔法护甲百分比
     * @param target
     * @returns
     */
    export function GetIgnoreMagicalArmorPercentage(target: IBaseNpc_Plus) {
        let IGNORE_MAGICAL_ARMOR_PERCENTAGE = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE);
        let IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE = SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE);
        return -((1 - IGNORE_MAGICAL_ARMOR_PERCENTAGE * 0.01) * (1 - IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE * 0.01) - 1) * 100
    }

    //  技能增强
    export function GetBaseSpellAmplify(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    }
    export function GetBonusSpellAmplify(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS_PERCENTAGE)
    }
    export function GetBonusSpellAmplifyUnique(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    }
    export function GetSpellAmplify(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return GetBaseSpellAmplify(hUnit, tParams) + GetBonusSpellAmplify(hUnit, tParams) + GetBonusSpellAmplifyUnique(hUnit, tParams)
    }



    export function GetBaseMaxHealth(hUnit: IBaseNpc_Plus) {
        let fDefault = 0;
        if (IsValid(hUnit)) {
            fDefault = GetUnitCache(hUnit, "StatusHealth");
        }
        let hp_base = PropertyCalculate.SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BASE)
        return fDefault + hp_base;
    }
    //  生命值
    export function GetHealthBonus(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    }
    export function GetHealthPercentage(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENTAGE)
    }
    export function GetHealthPercentageEnemy(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENT_ENEMY)
    }
    //  生命恢复
    export function GetHealthRegen(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    }
    //  魔法值
    export function GetManaBonus(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    }
    export function GetManaPercentage(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_PERCENTAGE)
    }
    export function GetBaseMana(hUnit: IBaseNpc_Plus) {
        let fValue = 0
        if (IsValid(hUnit)) {
            fValue = GetUnitCache(hUnit, "StatusMana")
        }
        return fValue
    }
    export function GetTotalManaBonus(hUnit: IBaseNpc_Plus) {
        let fPercent = GetManaPercentage(hUnit) * 0.01
        return GetManaBonus(hUnit) * (1 + fPercent) + GetBaseMana(hUnit) * fPercent
    }
    //  魔法恢复
    export function GetManaRegen(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE)
    }

    export function GetManaRegenAmplify(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE,)
    }

    export function GetManaRegenTotal(hUnit: IBaseNpc_Plus) {
        return (GetUnitCache(hUnit, "StatusManaRegen") + GetManaRegen(hUnit)) * (1 + GetManaRegenAmplify(hUnit) / 100)
    }
    //  状态抗性
    export function GetStatusResistanceStack(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    }
    export function GetStatusResistanceUnique(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_BONUS)
    }
    export function GetStatusResistance(hUnit: IBaseNpc_Plus) {
        return (1 - (1 - GetStatusResistanceStack(hUnit) * 0.01) * (1 - GetStatusResistanceUnique(hUnit) * 0.01)) * 100
    }
    export function GetStatusResistanceCaster(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_CASTER)
    }
    //  闪避
    export function GetEvasion(hUnit: IBaseNpc_Plus, tParams?: ICustomModifierAttackEvent) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,)
    }
    // 无视闪避
    export function GetIgnoreEvasion(hUnit: IBaseNpc_Plus) {
        if (IsValid(hUnit)) {
            return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.NEGATIVE_EVASION_CONSTANT,)
        }
        return 0;
    }

    //  技能闪避
    export function GetSpellEvasion(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_EVASION_CONSTANT,)
    }
    //  冷却减少
    export function GetCooldownReduction(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let cd_reduction = SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,)
        let max_cd_reduction = GetMaxCooldownReduction(hUnit, tParams)
        if (max_cd_reduction > 0 && max_cd_reduction < cd_reduction) {
            return max_cd_reduction
        }
        return cd_reduction
    }
    export function GetMaxCooldownReduction(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.MAX_COOLDOWN_PERCENTAGE,)
    }
    /**
     * 此次是否能暴击
     */
    export function CanCriticalStrike(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        if (tParams && IsValid(hUnit) && IsValid(tParams.target)) {
            let a = 0;
            let b = 0;
            switch (tParams.damage_category) {
                // 技能
                case DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL:
                    a = SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_NO_SPELL_CRITICALSTRIKE);
                    b = SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_NO_SPELL_CRITICALSTRIKE);
                    if (a < 1 && b < 1) {
                        return true
                    }
                    return false;
                // 普攻
                case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                    a = SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_NO_CRITICALSTRIKE);
                    b = SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_NO_CRITICALSTRIKE);
                    if (a < 1 && b < 1) {
                        return true
                    }
                    return false;
            }
        }
        return false;
    }
    //  物理暴击
    export function GetCriticalStrikeChance(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        if (SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_NO_CRITICALSTRIKE) >= 1) {
            return 0
        }
        if (tParams && IsValid(tParams.target)) {
            if (SumProps(tParams.target, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_NO_CRITICALSTRIKE) >= 1) {
                return 0
            }
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE) + GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_CHANCE
    }
    //  物理暴击伤害
    export function GetCriticalStrikeDamage(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let fDamage = GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_DAMAGE + SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE,)
        if (tParams && IsValid(tParams.target)) {
            fDamage = fDamage + SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_CRITICALSTRIKE_DAMAGE_PERCENTAGE)
        }
        return fDamage
    }
    // 物理暴击时技能暴击补偿
    export function GetCriticalStrikeDamage_Mix(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_MIX_PERCENT,) * 0.01 * GetSpellCriticalStrikeDamage(hUnit, tParams)
    }
    //  技能暴击概率
    export function GetSpellCriticalStrikeChance(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        if (SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_NO_SPELL_CRITICALSTRIKE) >= 1) {
            return 0
        }
        let fChance = SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE) + GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_CHANCE
        if (tParams && IsValid(tParams.target)) {
            if (SumProps(tParams.target, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_NO_SPELL_CRITICALSTRIKE) >= 1) {
                return 0;
            }
            fChance = fChance + SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_CRITICALSTRIKE_CHANCE)
        }
        return fChance
    }
    //  技能暴击伤害
    export function GetSpellCriticalStrikeDamage(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let fDamage = GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_DAMAGE + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE)
        if (tParams && IsValid(tParams.target)) {
            fDamage = fDamage + SumProps(tParams.target, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_CRITICALSTRIKE_DAMAGE_PERCENTAGE)
        }
        return fDamage
    }

    // 技能暴击时物理暴击补偿
    export function GetSpellCriticalStrikeDamage_Mix(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_MIX_PERCENT,) * 0.01 * GetCriticalStrikeDamage(hUnit, tParams)
    }
    //  最大攻击速度
    export function GetBonusMaximumAttackSpeed(hUnit: IBaseNpc_Plus) {
        if (SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS_UNABLE) >= 1) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    }
    export function GetMaximumAttackSpeed(hUnit: IBaseNpc_Plus) {
        return GetBonusMaximumAttackSpeed(hUnit) + GPropertyConfig.MAXIMUM_ATTACK_SPEED
    }
    export function GetOutgoingDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    }
    export function GetOutgoingPhysicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE,)
    }
    export function GetOutgoingMagicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE,)
    }
    export function GetOutgoingPureDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PURE_DAMAGE_PERCENTAGE)
    }
    //  受到的伤害
    export function GetIncomingDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        let r = SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
        let reduce = SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_REDUCE_PERCENTAGE_UNIQUE)
        r = r - math.abs(reduce);
        return r;
    }
    export function GetIncomingPhysicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,)
    }
    export function GetIncomingMagicalDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE,)
    }
    export function GetIncomingPureDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE,)
    }
    export function GetIncomingDamagePercentEnemy(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE_ENEMY,)
    }
    // 毒伤害相关
    export function GetIncomingPoisonDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE,)
    }
    export function GetOutgoingPoisonCountPercent(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_POISON_COUNT_PERCENTAGE)
    }
    export function GetIncomingPoisonCountPercent(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_COUNT_PERCENTAGE)
    }
    export function GetPoisonActiveTimePercent(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.POISON_ACTIVE_TIME_PERCENTAGE)
    }
    export function GetPoisonActiveIncreasePercent(hUnit: IBaseNpc_Plus) {
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.POISON_ACTIVE_INCREASE_PERCENTAGE)
    }
    export function GetPoisonImmune(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.POISON_IMMUNE,)
    }
    // 流血相关
    export function GetIncomingBleedDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE,)
    }
    // 持续伤害相关
    export function GetIncomingDotDamagePercent(hUnit: IBaseNpc_Plus, tParams: ICustomModifierAttackEvent) {
        return SumProps(hUnit, tParams, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DOT_DAMAGE_PERCENTAGE,)
    }
    // 吸血
    export function GetLifeStealPercent(hUnit: IBaseNpc_Plus) {
        let r = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
        let a = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_AMPLIFY_PERCENTAGE)
        return r * (1 + a * 0.01);
    }
    export function GetSpellLifeStealPercent(hUnit: IBaseNpc_Plus) {
        let r = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
        let a = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE)
        return r * (1 + a * 0.01);
    }

    /**-------------基础三围-------------------- */
    export function GetBaseStrength(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        const BaseStrength = GetUnitCache(hUnit, "AttributeBaseStrength");
        return math.max(BaseStrength + math.floor(SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE)), 0) + GetBaseAllStat(hUnit)
    }
    export function GetBaseAgility(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        const BaseAgility = GetUnitCache(hUnit, "AttributeBaseAgility");
        return math.max(BaseAgility + math.floor(SumProps(hUnit, null, (GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BASE))), 0) + GetBaseAllStat(hUnit)
    }
    export function GetBaseIntellect(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        const BaseIntellect = GetUnitCache(hUnit, "AttributeBaseIntelligence");
        return math.max(BaseIntellect + math.floor(SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BASE)), 0) + GetBaseAllStat(hUnit)
    }
    /**-------------基础三围百分比-------------------- */
    export function GetBaseStrengthPercentage(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE_PERCENTAGE)
    }
    export function GetBaseAgilityPercentage(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BASE_PERCENTAGE)
    }
    export function GetBaseIntellectPercentage(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BASE_PERCENTAGE)
    }
    /**-------------三围加成-------------------- */
    export function GetBaseAllStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BASE);
    }
    export function GetBonusAllStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    }
    /**
     * @Both
     * @param hUnit 
     * @param iPrimaryStat 
     * @returns 
     */
    export function GetBonusPrimaryStat(hUnit: IBaseNpc_Plus, iPrimaryStat: Attributes) {
        if (hUnit.GetPrimaryAttribute && hUnit.GetPrimaryAttribute() == iPrimaryStat) {
            return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_BONUS)
        }
        return 0
    }
    export function GetBonusStrength(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS) + GetBonusAllStat(hUnit)
    }
    export function GetBonusAgility(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS) + GetBonusAllStat(hUnit)
    }
    export function GetBonusIntellect(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS) + GetBonusAllStat(hUnit)
    }
    // // // // // // // // // // // // // // // // // // // -三围百分比加成// // // // // // // // // // // // // // // // // // // -
    export function GetAllStatPercent(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_PERCENTAGE)
    }
    export function GetPrimaryStatPercent(hUnit: IBaseNpc_Plus, iPrimaryStat: Attributes) {
        if (type(hUnit.GetPrimaryAttribute) == "function" && hUnit.GetPrimaryAttribute() == iPrimaryStat) {
            return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_PERCENTAGE)
        } else {
            return 0
        }
    }
    export function GetStrengthPercentage(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE) + GetAllStatPercent(hUnit) + GetPrimaryStatPercent(hUnit, Attributes.DOTA_ATTRIBUTE_STRENGTH)
    }
    export function GetAgilityPercentage(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_PERCENTAGE) + GetAllStatPercent(hUnit) + GetPrimaryStatPercent(hUnit, Attributes.DOTA_ATTRIBUTE_AGILITY)
    }
    export function GetIntellectPercentage(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_PERCENTAGE) + GetAllStatPercent(hUnit) + GetPrimaryStatPercent(hUnit, Attributes.DOTA_ATTRIBUTE_INTELLECT)
    }
    // // // // // // // // // // // // // // // // // // // -总三围// // // // // // // // // // // // // // // // // // // -
    export function GetStrength(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = GetStrengthPercentage(hUnit) * 0.01
        return math.max(math.floor(GetBaseStrength(hUnit) * (1 + GetBaseStrengthPercentage(hUnit) * 0.01 + fTotalPercent) + GetBonusStrength(hUnit) * (1 + fTotalPercent)), 0) + GetBonusPrimaryStat(hUnit, Attributes.DOTA_ATTRIBUTE_STRENGTH) * (1 + fTotalPercent) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS_NO_PERCENTAGE)
    }
    export function GetAgility(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = GetAgilityPercentage(hUnit) * 0.01
        return math.max(math.floor(GetBaseAgility(hUnit) * (1 + GetBaseAgilityPercentage(hUnit) * 0.01 + fTotalPercent) + GetBonusAgility(hUnit) * (1 + fTotalPercent)), 0) + GetBonusPrimaryStat(hUnit, Attributes.DOTA_ATTRIBUTE_AGILITY) * (1 + fTotalPercent) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS_NO_PERCENTAGE)
    }
    export function GetIntellect(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = GetIntellectPercentage(hUnit) * 0.01
        return math.max(math.floor(GetBaseIntellect(hUnit) * (1 + GetBaseIntellectPercentage(hUnit) * 0.01 + fTotalPercent) + GetBonusIntellect(hUnit) * (1 + fTotalPercent)), 0) + GetBonusPrimaryStat(hUnit, Attributes.DOTA_ATTRIBUTE_INTELLECT) * (1 + fTotalPercent) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS_NO_PERCENTAGE)
    }
    // // // // // // // // // // // // // // // // // // // -总三围百分比但去掉主属性加成// // // // // // // // // // // // // // // // // // // -
    export function GetStrengthPercentageWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE) + GetAllStatPercent(hUnit)
    }
    export function GetAgilityPercentageWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_PERCENTAGE) + GetAllStatPercent(hUnit)
    }
    export function GetIntellectPercentageWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        return SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_PERCENTAGE) + GetAllStatPercent(hUnit)
    }
    // // // // // // // // // // // // // // // // // // // -总三围但去掉主属性加成// // // // // // // // // // // // // // // // // // // -
    export function GetStrengthWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = GetStrengthPercentageWithoutPrimaryStat(hUnit) * 0.01
        return math.max(math.floor(GetBaseStrength(hUnit) * (1 + GetBaseStrengthPercentage(hUnit) * 0.01 + fTotalPercent) + GetBonusStrength(hUnit) * (1 + fTotalPercent) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS_NO_PERCENTAGE)), 0)
    }
    export function GetAgilityWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = GetAgilityPercentageWithoutPrimaryStat(hUnit) * 0.01
        return math.max(math.floor(GetBaseAgility(hUnit) * (1 + GetBaseAgilityPercentage(hUnit) * 0.01 + fTotalPercent) + GetBonusAgility(hUnit) * (1 + fTotalPercent) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS_NO_PERCENTAGE)), 0)
    }
    export function GetIntellectWithoutPrimaryStat(hUnit: IBaseNpc_Plus) {
        if (!IsValid(hUnit) || !hUnit.HasModifier(GPropertyConfig.HERO_PROPERTY_BUFF_NAME)) {
            return 0
        }
        let fTotalPercent = GetIntellectPercentageWithoutPrimaryStat(hUnit) * 0.01
        return math.max(math.floor(GetBaseIntellect(hUnit) * (1 + GetBaseIntellectPercentage(hUnit) * 0.01 + fTotalPercent) + GetBonusIntellect(hUnit) * (1 + fTotalPercent) + SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS_NO_PERCENTAGE)), 0)
    }

    export function GetCastRangeBonus(target: IBaseNpc_Plus) {
        return SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS);

    }


    export function GetEnergyRegenPercentage(hUnit: IBaseNpc_Plus) {
        return math.max(-100, SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.ENERGY_REGEN_PERCENTAGE))
    }
    export function GetEntityIndex(hUnit: IBaseNpc_Plus) {
        return hUnit.GetEntityIndex()
    }
    /**
     * 获取星级
     * @param hUnit 
     * @returns 
     */
    export function GetStar(hUnit: IBaseNpc_Plus) {
        return hUnit.GetStar()
    }

    /** 召唤物 */
    export function GetSummonDuration(hUnit: IBaseNpc_Plus, curduation: number) {
        let fSummonDurationBonus = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.SUMMON_DURATION_BONUS);
        let fSummonDurationPect = SumProps(hUnit, null, GPropertyConfig.EMODIFIER_PROPERTY.SUMMON_DURATION_PECT);
        return (curduation + fSummonDurationBonus) * (1 + fSummonDurationPect * 0.01);
    }

}
declare global {
    /**
     * @Both
     */
    var GPropertyCalculate: typeof PropertyCalculate;
}
if (_G.GPropertyCalculate == undefined) {
    _G.GPropertyCalculate = PropertyCalculate;
}