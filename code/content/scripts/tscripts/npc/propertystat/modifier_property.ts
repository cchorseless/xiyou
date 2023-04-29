import { ResHelper } from "../../helper/ResHelper";
import { PropertyConfig } from "../../shared/PropertyConfig";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, modifier_event, registerEvent } from "../propertystat/modifier_event";
import { PropertyCalculate } from "./PropertyCalculate";



/**
 * 自定义属性计算
 */
@registerModifier()
export class modifier_property extends BaseModifier_Plus {

    GetTexture(): string {
        if (GPropertyCalculate.call_ability != null) {
            let hAbility = EntIndexToHScript(GPropertyCalculate.call_ability) as IBaseAbility_Plus;
            let iLevel = GPropertyCalculate.call_level!;
            let sKeyName = GPropertyCalculate.call_key!;
            GPropertyCalculate.call_ability = null;
            GPropertyCalculate.call_level = null;
            GPropertyCalculate.call_key = null;
            if (IsValid(hAbility)) {
                let func = (hAbility as any)[sKeyName];
                if (func != null && typeof func == "function") {
                    let r = tostring((hAbility as any)[sKeyName](iLevel))
                    return r;
                }
                switch (sKeyName) {
                    default:
                        return tostring(hAbility.GetLevelSpecialValueFor(sKeyName, iLevel));
                }
            }
            return "";
        }
        if (GPropertyCalculate.call_unit != null) {
            let hUnit = EntIndexToHScript(GPropertyCalculate.call_unit) as IBaseNpc_Plus;
            let sFunctionName = GPropertyCalculate.call_func!;
            GPropertyCalculate.call_unit = null;
            GPropertyCalculate.call_func = null;
            let func = (GPropertyCalculate as any)[sFunctionName];
            if (IsValid(hUnit) && func != null && typeof func == "function") {
                let r = tostring(func(hUnit))
                return r;
            }
            GLogHelper.error(`cant find func:${sFunctionName} in PropertyCalculate`)
            return "";
        }
        return "";
    }

    BeCreated(params: object) {
        this.SetHasCustomTransmitterData(true);
        if (IsServer()) {
            this.Calculate_Hp();
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                this.Calculate_Hp()
                return 1
            }));
        }
    }

    /**用于计算气血属性 */
    Calculate_Hp() {
        let parent = this.GetParentPlus();
        if (parent == null) { return }
        let fHealthPercent = parent.GetHealth() / parent.GetMaxHealth();
        let extraHp = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
        let extraPect = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS_PERCENTAGE)
        let hpPect = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENTAGE)
        let baseMaxHealth = PropertyCalculate.GetBaseMaxHealth(parent);
        let maxhp = (baseMaxHealth + extraHp * (1 + extraPect * 0.01)) * (1 + hpPect * 0.01);
        let fCorrectHealth = math.floor(maxhp);
        if (parent.GetMaxHealth() != fCorrectHealth) {
            parent.SetBaseMaxHealth(fCorrectHealth);
            parent.SetMaxHealth(fCorrectHealth);
            parent.ModifyHealth(math.floor(fHealthPercent * fCorrectHealth), null, false, 0)
        }
    }


    DeclareFunctions(): modifierfunction[] {
        let r: modifierfunction[] = [];
        PropertyConfig.CustomDeclarePropertyEvent.forEach((value) => {
            r.push(value)
        });
        return r;
    }
    /**
     * 基础攻击力用于计算总攻击力
     * @returns
     */
    GetModifierBaseAttack_BonusDamage(): number {
        return PropertyCalculate.GetAttackDamage(this.GetParentPlus())
    }

    /**
     * 技能CD减少
     */
    GetModifierPercentageCooldown(event: ModifierAbilityEvent): number {
        return PropertyCalculate.GetCooldownReduction(this.GetParentPlus(), event as any)
    }

    /**闪避 */
    GetModifierEvasion_Constant(event: ModifierAttackEvent): number {
        let c = PropertyCalculate.GetEvasion(this.GetParentPlus()) - PropertyCalculate.GetIgnoreEvasion(event.attacker);
        c = c > 0 ? c : 0;
        return c;
    }
    /**气血恢复 */
    GetModifierConstantHealthRegen(): number {
        return PropertyCalculate.GetHealthRegen(this.GetParentPlus())
    }
    /**
     * 额外魔法值
     * @returns
     */
    GetModifierManaBonus(): number {
        return PropertyCalculate.GetManaBonus(this.GetParentPlus())
    }

    /**
     * 魔法恢复
     * @returns
     */
    GetModifierConstantManaRegen(): number {
        return PropertyCalculate.GetManaRegen(this.GetParentPlus())
    }
    /**
     * 技能增伤
     * @param event
     * @returns
     */
    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return PropertyCalculate.GetSpellAmplify(this.GetParentPlus(), event)
    }

    /**
     * 最大攻速上限
     * @returns
     */
    GetModifierAttackSpeedBaseOverride(): number {
        let parent = this.GetParentPlus()
        let current = 1 + parent.GetIncreasedAttackSpeed();
        let minpect = GPropertyConfig.MINIMUM_ATTACK_SPEED * 0.01;
        let maxpect = PropertyCalculate.GetMaximumAttackSpeed(parent) * 0.01
        return GFuncMath.Clamp(current, minpect, maxpect)
    }
    /**额外攻速 */
    GetModifierAttackSpeedBonus_Constant(): number {
        return PropertyCalculate.GetAttackSpeedBonus(this.GetParentPlus())
    }

    /**
     * 普攻伤害倍率，发生暴击在这里返回暴击伤害
     * @param event
     * @returns
     */
    GetModifierPreAttack_CriticalStrike(event: ModifierAttackEvent): number {
        // 暴击先算 基础暴击，再算额外暴击。因为非线性计算，所以要分开计算，取最大值
        if (IsClient()) { return }
        event.damage_category = DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK;
        let hAttacker = event.attacker as IBaseNpc_Plus;
        if (!IsValid(hAttacker) || hAttacker != this.GetParentPlus()) { return }
        // 不暴击
        if (GBattleSystem.AttackFilter(event.record, GEBATTLE_ATTACK_STATE.ATTACK_STATE_NO_CRIT)) {
            return 0
        }
        // 不暴击
        if (!PropertyCalculate.CanCriticalStrike(hAttacker, event)) { return }
        let critbool = false;
        let _chance = 0;
        let _damage_base = PropertyCalculate.GetCriticalStrikeDamage(hAttacker, event);
        let _damage_other = 0;
        // 必定基础暴击
        if (GBattleSystem.AttackFilter(event.record, GEBATTLE_ATTACK_STATE.ATTACK_STATE_CRIT)) {
            critbool = true;
        }
        else {
            _chance = PropertyCalculate.GetCriticalStrikeChance(hAttacker, event)
            _damage_other = PropertyCalculate.SumProps(hAttacker, event, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE_UNIQUE);
            // 基础暴击
            if (GFuncRandom.PRD(_chance, this.GetParentPlus(), 'GetModifierPreAttack_CriticalStrike')) {
                critbool = true;
            }
            // 额外暴击
            if (_damage_other && _damage_other > 0) {
                critbool = true;
                if (_damage_other > _damage_base) {
                    _damage_base = _damage_other;
                }
            }
        }
        if (critbool) {
            GBattleSystem._DamageStateAttackCrit(event.record);
            modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_CRIT);
            modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ANY_CRIT);
            return _damage_base
        }
        return 0
    }
    /**
     * 我方受击后,受到暴击的概率
     * @returns
     */
    GetModifierPreAttack_Target_CriticalStrike(): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
    }


    /**
     * 计算技能暴击
     * @param event 
     * @returns 
     */
    GetModifierTotalDamageOutgoing_Percentage(params: ModifierAttackEvent): number {
        if (IsClient()) { return }
        let iDamageType = params.damage_type
        let iDamageCategory = params.damage_category
        let fPercent = 100
        let hAttacker = params.attacker
        // 这里的params.damage永远为0
        if (iDamageCategory == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
            fPercent = fPercent * (1 + 0.01 * PropertyCalculate.SumProps(hAttacker, params, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE))
        }
        else {
            GBattleSystem.RECORD_SYSTEM_DUMMY.iLastRecord = params.record;
        }
        // 计算技能暴击
        if (iDamageCategory == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL &&
            !GBattleSystem.DamageFilter(params.record, GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NO_SPELL_CRIT) &&
            PropertyCalculate.CanCriticalStrike(hAttacker, params)) {
            let critbool = false;
            let _chance = PropertyCalculate.GetSpellCriticalStrikeChance(hAttacker, params);
            let _damage_base = 0;
            let _damage_spell = PropertyCalculate.SumProps(hAttacker, params, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_UNIQUE);
            if (GFuncRandom.PRD(_chance, this, 'GetModifierTotalDamageOutgoing_Percentage')) {
                _damage_base = PropertyCalculate.GetSpellCriticalStrikeDamage(hAttacker, params);
                critbool = true;
            }
            // 额外暴击
            if (_damage_spell && _damage_spell > 0) {
                critbool = true;
                if (_damage_spell > _damage_base) {
                    _damage_base = _damage_spell;
                }
            }
            if (critbool) {
                fPercent = fPercent * (1 + _damage_base * 0.01)
                GBattleSystem._DamageStateSpellCrit(params.record);
                modifier_event.FireEvent(params, Enum_MODIFIER_EVENT.ON_SPELL_CRIT);
                modifier_event.FireEvent(params, Enum_MODIFIER_EVENT.ON_ANY_CRIT);
            }
        }
        if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
            fPercent = fPercent * (1 + PropertyCalculate.GetOutgoingPhysicalDamagePercent(hAttacker, params) * 0.01)
        } else if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
            fPercent = fPercent * (1 + PropertyCalculate.GetOutgoingMagicalDamagePercent(hAttacker, params) * 0.01)
        } else if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
            fPercent = fPercent * (1 + PropertyCalculate.GetOutgoingPureDamagePercent(hAttacker, params) * 0.01)
        }
        fPercent = fPercent * (1 + PropertyCalculate.GetOutgoingDamagePercent(hAttacker, params) * 0.01)
        return fPercent - 100
    }

    /**
     * 受到伤害加深百分比,计算伤害前
     * @param params
     * @returns
     */
    GetModifierIncomingDamage_Percentage(params: ModifierAttackEvent): number {
        let iDamageFlags = params.damage_flags
        let iDamageType = params.damage_type
        let iDamageCategory = params.damage_category
        let fPercent = 100
        let hTarget = params.target as IBaseNpc_Plus;
        // 技能暴击特效
        if (GBattleSystem.DamageFilter(params.record, GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_SPELL_CRIT) && params.original_damage > 0) {
            let iNumber = math.floor(params.original_damage)
            let sNumber = tostring(iNumber)
            let fDuration = 3
            let vColor = Vector(0, 191, 255)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/msg_fx/msg_crit.vpcf",
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN
            })
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(0, iNumber, 4))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(fDuration, sNumber.length + 1, 0))
            ParticleManager.SetParticleControl(iParticleID, 3, vColor)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
        if (IsValid(hTarget)) {
            // 无视伤害加深
            let bDamageAmplify = !GBattleSystem.DamageFilter(params.record, GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NO_DAMAGE_AMPLIFY);
            let _tmp = 0
            switch (iDamageType) {
                case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
                    fPercent = fPercent * (1 - PropertyCalculate.GetMagicalReductionPect(hTarget, params))
                    //  魔法伤害加深
                    if (bDamageAmplify) {
                        _tmp = PropertyCalculate.GetIncomingMagicalDamagePercent(hTarget, params)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  受到额外毒伤害 NOTE:若是以后毒伤害不是魔法伤害了，记得改到其他位置上
                    if (GBattleSystem.DamageFilter(params.record, GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_POISON)) {
                        _tmp = PropertyCalculate.GetIncomingPoisonDamagePercent(hTarget, params)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
                    fPercent = fPercent * (1 - PropertyCalculate.GetPhysicalReductionPect(hTarget, params))
                    //  物理护甲
                    if (bDamageAmplify) {
                        _tmp = PropertyCalculate.GetIncomingPhysicalDamagePercent(hTarget, params)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
                    if (bDamageAmplify) {
                        _tmp = PropertyCalculate.GetIncomingPureDamagePercent(hTarget, params)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  流血伤害加深
                    if (GBattleSystem.DamageFilter(params.record, GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_BLEEDING)) {
                        _tmp = PropertyCalculate.GetIncomingBleedDamagePercent(hTarget, params)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_ALL:
                case DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL:
                    break
            }

            //  全伤害
            if (bDamageAmplify) {
                _tmp = PropertyCalculate.GetIncomingDamagePercent(hTarget, params)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
            //  敌方的减伤，例如无尽的减伤
            // fPercent = fPercent * (1 + GetIncomingDamagePercentEnemy(hTarget, params) * 0.01)
            //  受到额外持续伤害
            if (GBattleSystem.DamageFilter(params.record, GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_DOT)) {
                _tmp = PropertyCalculate.GetIncomingDotDamagePercent(hTarget, params)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
        }
        return fPercent - 100
    }

    /**
     * 技能特殊值的修改
     * @param keys 
     * @returns 
     */
    GetModifierOverrideAbilitySpecial(keys: ModifierOverrideAbilitySpecialEvent): 0 | 1 {
        if (keys.ability && keys.ability.TempData().SpecialValueOverride) {
            return keys.ability.TempData<{ [k: string]: IGHandler<number> }>().SpecialValueOverride[keys.ability_special_value] ? 1 : 0;
        }
        return 0;
    }
    /**
     * 技能特殊值的修改
     * @param keys 
     */
    GetModifierOverrideAbilitySpecialValue(keys: ModifierOverrideAbilitySpecialEvent): number {
        if (keys.ability && keys.ability.TempData().SpecialValueOverride) {
            let handler = keys.ability.TempData<{ [k: string]: IGHandler<number> }>().SpecialValueOverride[keys.ability_special_value];
            if (handler) {
                return handler.runWith([keys]);
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_ON_TAKEDAMAGE(event: ModifierInstanceEvent) {
        let attacker = event.attacker as IBaseNpc_Plus;
        let unit = event.unit as IBaseNpc_Plus;
        if (!IsValid(unit) || !attacker.IsRealUnit() || !unit.IsRealUnit() ||
            unit.IsBuilding() || unit.IsOther() || attacker == unit) {
            return
        }
        // 攻击吸血
        if (event.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
            let fValue = GPropertyCalculate.GetLifeStealPercent(attacker)
            if (fValue > 0) {
                let iParticleID = ParticleManager.CreateParticle(ResHelper.EParticleName.atk_lifesteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, attacker)
                ParticleManager.ReleaseParticleIndex(iParticleID);
                attacker.ApplyHeal(event.damage * fValue * 0.01, event.inflictor)
            }
        }
        // 技能吸血
        else if (event.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL &&
            bit.band(event.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
        ) {
            let fValue = GPropertyCalculate.GetSpellLifeStealPercent(attacker)
            if (fValue > 0) {
                let iParticleID = ParticleManager.CreateParticle(ResHelper.EParticleName.spell_lifesteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, attacker)
                ParticleManager.ReleaseParticleIndex(iParticleID);
                attacker.ApplyHeal(event.damage * fValue * 0.01, event.inflictor)
            }
        }
    }



}

