import { GameFunc } from "../../GameFunc";
import { BattleHelper } from "../../helper/BattleHelper";
import { ResHelper } from "../../helper/ResHelper";
import { PropertyConfig } from "../../shared/PropertyConfig";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, modifier_event } from "../propertystat/modifier_event";
import { PropertyCalculate } from "./PropertyCalculate";



/**
 * 自定义属性计算
 */
@registerModifier()
export class modifier_property extends BaseModifier_Plus {

    GetTexture(): string {
        if (GPropertyCalculate.call_ability != null) {
            let hAbility = EntIndexToHScript(GPropertyCalculate.call_ability) as IBaseAbility_Plus;
            let iLevel = GPropertyCalculate.call_ability!;
            let sKeyName = GPropertyCalculate.call_key!;
            GPropertyCalculate.call_ability = null;
            GPropertyCalculate.call_ability = null;
            GPropertyCalculate.call_key = null;
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
        if (GPropertyCalculate.call_unit != null) {
            let hUnit = EntIndexToHScript(GPropertyCalculate.call_unit) as IBaseNpc_Plus;
            let sFunctionName = GPropertyCalculate.call_func!;
            GPropertyCalculate.call_unit = null;
            GPropertyCalculate.call_func = null;
            let func = (GPropertyCalculate as any)[sFunctionName];
            if (GameFunc.IsValid(hUnit) && func != null && typeof func == "function") {
                let r = tostring(func(hUnit))
                return r;
            }
            GLogHelper.error(`cant find func:${sFunctionName} in PropertyCalculate`)
            return "";
        }
        return "";
    }

    BeCreated(params: object) {

        this.SetHasCustomTransmitterData(true)
        if (IsServer()) {
            this.Calculate_Hp();
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                this.Calculate_Hp()
                return 1
            }))
        }
    }
    /**用于计算气血属性 */
    Calculate_Hp() {
        let parent = this.GetParentPlus();
        if (parent == null) { return }
        let fHealthPercent = parent.GetHealth() / parent.GetMaxHealth();
        let extraHp = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
        let extraPect = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS_PERCENTAGE)
        let hpPect = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
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
        return Array.from(PropertyConfig.CustomDeclarePropertyEvent);
    }
    /**
     * 额外基础攻击力
     * @returns
     */
    GetModifierBaseAttack_BonusDamage(): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    }
    /**
     * 技能CD减少
     */
    GetModifierPercentageCooldown(event: ModifierAbilityEvent): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), event, GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    }

    /**闪避 */
    GetModifierEvasion_Constant(event: ModifierAttackEvent): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), event, GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    }

    /**气血恢复 */
    GetModifierConstantHealthRegen(): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    }
    /**
     * 额外魔法值
     * @returns
     */
    GetModifierManaBonus(): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    }

    /**
     * 魔法恢复
     * @returns
     */
    GetModifierConstantManaRegen(): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT);
    }
    /**
     * 技能增伤
     * @param event
     * @returns
     */
    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null,
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
        let fBonus = PropertyCalculate.SumProps(parent, null, GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
        let current = 1 + parent.GetIncreasedAttackSpeed();
        let minpect = GPropertyConfig.MINIMUM_ATTACK_SPEED * 0.01;
        let maxpect = (GPropertyConfig.MAXIMUM_ATTACK_SPEED + fBonus) * 0.01
        return GameFunc.mathUtil.Clamp(current, minpect, maxpect)
    }
    /**额外攻速 */
    GetModifierAttackSpeedBonus_Constant(): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
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
                        _damage_r = (GPropertyConfig.BASE_SPELL_CRITICALSTRIKE_DAMAGE + PropertyCalculate.SumProps(hAttacker, event, GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE))
                        break
                    // 普攻
                    case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                        _damage_r = (GPropertyConfig.BASE_ATTACK_CRITICALSTRIKE_DAMAGE + PropertyCalculate.SumProps(hAttacker, event, GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE))
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
                    let fChance = PropertyCalculate.SumProps(hAttacker, event, _chanceEnum);
                    // 目标受击暴击概率
                    let tChance = PropertyCalculate.SumProps(hTarget, event, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
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
        return PropertyCalculate.SumProps(this.GetParentPlus(), null, GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
    }



    // GetModifierTotalDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
    //     return 100
    // }
    GetModifierDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        return PropertyCalculate.SumProps(this.GetParentPlus(), event,
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
        if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_BEFORE_TRANSFORMED_DAMAGE)) {
            return 0
        }
        // 技能暴击特效
        if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_SPELL_CRIT) && params.original_damage > 0) {
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
            let bDamageAmplify = !BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY);
            let _tmp = 0
            switch (iDamageType) {
                case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
                    fPercent = fPercent * (1 - PropertyCalculate.GetMagicalReduction(hTarget, params))
                    //  魔法伤害加深
                    if (bDamageAmplify) {
                        _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  受到额外毒伤害 NOTE:若是以后毒伤害不是魔法伤害了，记得改到其他位置上
                    if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_POISON)) {
                        _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
                    fPercent = fPercent * (1 - PropertyCalculate.GetPhysicalReduction(hTarget, params))
                    //  物理护甲
                    if (bDamageAmplify) {
                        _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
                    if (bDamageAmplify) {
                        _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  流血伤害加深
                    if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_BLEEDING)) {
                        _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_ALL:
                case DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL:
                    break
            }

            //  全伤害
            if (bDamageAmplify) {
                _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
            //  敌方的减伤，例如无尽的减伤
            // fPercent = fPercent * (1 + GetIncomingDamagePercentEnemy(hTarget, params) * 0.01)
            //  受到额外持续伤害
            if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT)) {
                _tmp = PropertyCalculate.SumProps(hTarget, params, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DOT_DAMAGE_PERCENTAGE)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
        }
        return fPercent - 100
    }



    // GetModifierIncomingSpellDamageConstant(event: ModifierAttackEvent): number { return 0 }


}

