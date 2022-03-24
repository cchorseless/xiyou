import { GameEnum } from "../../GameEnum";
import { GameFunc } from "../../GameFunc";
import { BattleHelper } from "../../helper/BattleHelper";
import { LogHelper } from "../../helper/LogHelper";
import { ResHelper } from "../../helper/ResHelper";
import { BaseModifier_Plus, Modifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../entityPlus/BaseNpc_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, modifier_event } from "./modifier_event";


/**
 * 自定义属性计算
 */
@registerModifier()
export class modifier_property extends BaseModifier_Plus {

    /**最大血量 */
    static MAX_HEALTH = 2147483000
    /**最大蓝量 */
    static MAX_MANA = 2 ^ 16 - 1

    /**最小攻速 */
    static MINIMUM_ATTACK_SPEED = 20
    /**最大攻速 */
    static MAXIMUM_ATTACK_SPEED = 500


    /**减伤 = FACTOR x 护甲 / ( 1 + (FACTOR  x |护甲|)) */
    static PHYSICAL_ARMOR_FACTOR = 0.06;
    static MAGICAL_ARMOR_FACTOR = 0.06;
    /**基础攻击暴击伤害百分比 */
    static BASE_ATTACK_CRITICALSTRIKE_DAMAGE = 150
    /**基础技能暴击伤害百分比 */
    static BASE_SPELL_CRITICALSTRIKE_DAMAGE = 150
    /**
     * 计算属性
     * @param target 计算NPC
     * @param event 事件数据
     * @param k 属性类型
     * @returns
     */
    static SumProps(target: BaseNpc_Plus, event: any, ...k: Array<GameEnum.Property.Enum_MODIFIER_PROPERTY>): number {
        let _r = 0;
        if (!GameFunc.IsValid(target)) {
            return _r
        }
        let info = BaseModifier_Plus.GetAllModifiersInfo(target)
        if (info == null) return 0;
        for (let ModifierName in info) {
            let allM: Array<Modifier_Plus> = info[ModifierName];
            for (let m of allM) {
                let _Property = m.__AllRegisterProperty
                let _Function = m.__AllRegisterFunction
                while (k.length > 0) {
                    let _k = k.shift();
                    let _sum = (GameEnum.Property.UNIQUE_PROPERTY.indexOf(_k) == -1);
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
    /**
     * 计算魔法抵抗
     * @param target
     * @param event
     */
    static GetMagicalReduction(target: BaseNpc_Plus, event: ModifierAttackEvent) {
        let iDamageFlags = event.damage_flags;
        // 无视魔法护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR) {
            return 0
        }
        let fValue = modifier_property.GetMagicalArmor(target)
        if (event && GameFunc.IsValid(event.attacker) && fValue > 0) {
            fValue = fValue - math.min(modifier_property.SumProps(target, event, GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR), fValue)
            fValue = fValue - math.max(fValue * modifier_property.GetIgnoreMagicalArmorPercentage(event.attacker as BaseNpc_Plus) * 0.01, 0)
        }
        return modifier_property.MAGICAL_ARMOR_FACTOR * fValue / (1 + modifier_property.MAGICAL_ARMOR_FACTOR * math.abs(fValue))
    }
    /**
     * 计算魔法护甲
     * @param target
     */
    static GetMagicalArmor(target: BaseNpc_Plus) {
        let BaseMagicalArmor = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BASE);
        let BaseMagicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BASE_PERCENTAGE);
        let MagicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_PERCENTAGE);
        let BonusMagicalArmor = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS);
        return (BaseMagicalArmor * (1 + BaseMagicalArmorPercentage * 0.01) + BonusMagicalArmor) * (1 + MagicalArmorPercentage * 0.01)
    }

    /**
     * 无视魔法护甲百分比
     * @param target
     * @returns
     */
    static GetIgnoreMagicalArmorPercentage(target: BaseNpc_Plus) {
        let IGNORE_MAGICAL_ARMOR_PERCENTAGE = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE);
        let IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE);
        return -((1 - IGNORE_MAGICAL_ARMOR_PERCENTAGE * 0.01) * (1 - IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE * 0.01) - 1) * 100
    }

    /**
     * 物理护甲减免
     * @param target
     * @param event
     */
    static GetPhysicalReduction(target: BaseNpc_Plus, event: ModifierAttackEvent) {
        let iDamageFlags = event.damage_flags;
        // 无视魔法护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR) {
            return 0
        }
        let fValue = modifier_property.GetPhysicalArmor(target);
        // 无视基础物理护甲
        if (iDamageFlags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_BASE_PHYSICAL_ARMOR) {
            fValue -= modifier_property.GetPhysicalArmor_Base(target);
        }
        let fValue_active = modifier_property.GetPhysicalArmor_Active(target);
        // 负甲的时候不计算无视护甲
        if (fValue > 0) {
            if (event && GameFunc.IsValid(event.attacker)) {
                let fIgnore = modifier_property.SumProps(event.attacker, event, GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR);
                fValue = math.max(fValue - fIgnore, 0);
                if (fValue > 0) {
                    let fIgnorePect = modifier_property.GetIgnorePhysicalArmorPercentage(event.attacker);
                    fValue = fValue - math.max(fValue * fIgnorePect * 0.01, 0);
                }
            }
        }
        fValue = math.max(fValue, fValue_active)
        return modifier_property.PHYSICAL_ARMOR_FACTOR * fValue / (1 + modifier_property.PHYSICAL_ARMOR_FACTOR * math.abs(fValue))
    }

    /**
     * 基础物理护甲
     * @param target
     * @returns
     */
    static GetPhysicalArmor_Base(target: BaseNpc_Plus) {
        let BasePhysicalArmor = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE);
        let BasePhysicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE);
        let PhysicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        return BasePhysicalArmor * (1 + BasePhysicalArmorPercentage * 0.01) * (1 + PhysicalArmorPercentage * 0.01)
    }

    /**
     * 计算物理护甲
     * @param target
     */
    static GetPhysicalArmor(target: BaseNpc_Plus) {
        let BasePhysicalArmor = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE);
        let BasePhysicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE);
        let PhysicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        let BonusPhysicalArmor = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS);
        // 唯一值
        let BonusPhysicalArmor_UNIQU = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE);
        // 无法被无视
        let BonusPhysicalArmor_UNIQUE_ACTIVE = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE);
        return (BasePhysicalArmor * (1 + BasePhysicalArmorPercentage * 0.01) + BonusPhysicalArmor + BonusPhysicalArmor_UNIQU + BonusPhysicalArmor_UNIQUE_ACTIVE) * (1 + PhysicalArmorPercentage * 0.01)
    }
    /**
     * 计算无法被无视的护甲值
     * @param target
     * @returns
     */
    static GetPhysicalArmor_Active(target: BaseNpc_Plus) {
        let BonusPhysicalArmor_UNIQUE_ACTIVE = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE);
        let PhysicalArmorPercentage = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_TOTAL_PERCENTAGE);
        return BonusPhysicalArmor_UNIQUE_ACTIVE * (1 + PhysicalArmorPercentage * 0.01)
    }


    /**
     * 无视物理护甲百分比
     * @param target
     */
    static GetIgnorePhysicalArmorPercentage(target: BaseNpc_Plus) {
        let IGNORE_PHYSICAL_ARMOR_PERCENTAGE = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE);
        let IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE = modifier_property.SumProps(target, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE);
        return -((1 - IGNORE_PHYSICAL_ARMOR_PERCENTAGE * 0.01) * (1 - IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE * 0.01) - 1) * 100
    }







    OnCreated(params: object) {
        super.OnCreated(params);
        if (IsServer()) {
            this.SetHasCustomTransmitterData(true)
            this.addFrameTimer(1, () => {
                this.Calculate_Hp()
                return 1
            })
        }
    }
    /**最大气血 */
    currentMaxHp: number;
    /**用于计算气血属性 */
    Calculate_Hp() {
        let parent = this.GetParentPlus();
        if (parent == null) { return }
        let fHealthPercent = parent.GetHealth() / parent.GetMaxHealth();
        let extraHp = modifier_property.SumProps(parent, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.HP_BONUS)
        let extraPect = modifier_property.SumProps(parent, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.HP_BONUS_PERCENTAGE)
        let hpPect = modifier_property.SumProps(parent, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.HP_PERCENTAGE)
        let baseMaxHealth = parent.GetBaseMaxHealth();
        let maxhp = (baseMaxHealth + extraHp * (1 + extraPect * 0.01)) * (1 + hpPect * 0.01);
        let fCorrectHealth = math.floor(maxhp);
        if (this.currentMaxHp != fCorrectHealth) {
            this.currentMaxHp = fCorrectHealth;
            parent.SetMaxHealth(fCorrectHealth);
            parent.ModifyHealth(math.floor(fHealthPercent * fCorrectHealth), null, false, 0)
        }

    }


    DeclareFunctions(): modifierfunction[] {
        return GameFunc.ArrayFunc.FromSet(GameEnum.Property.CustomDeclarePropertyEvent);
    }
    /**
     * 额外基础攻击力
     * @returns
     */
    GetModifierBaseAttack_BonusDamage(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GameEnum.Property.Enum_MODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    }
    /**
     * 技能CD减少
     */
    GetModifierPercentageCooldown(event: ModifierAbilityEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), event, GameEnum.Property.Enum_MODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    }

    /**闪避 */
    GetModifierEvasion_Constant(event: ModifierAttackEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), event, GameEnum.Property.Enum_MODIFIER_PROPERTY.EVASION_CONSTANT)
    }

    /**气血恢复 */
    GetModifierConstantHealthRegen(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    }
    /**
     * 额外魔法值
     * @returns
     */
    GetModifierManaBonus(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_BONUS)
    }

    /**
     * 魔法恢复
     * @returns
     */
    GetModifierConstantManaRegen(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_REGEN_CONSTANT);
    }
    /**
     * 技能增伤
     * @param event
     * @returns
     */
    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), null,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_CREEP,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
        );
    }

    /**
     * 最大攻速上限
     * @returns
     */
    GetModifierAttackSpeedBaseOverride(): number {
        let parent = this.GetParentPlus()
        let fBonus = modifier_property.SumProps(parent, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
        let current = 1 + parent.GetIncreasedAttackSpeed();
        let minpect = modifier_property.MINIMUM_ATTACK_SPEED * 0.01;
        let maxpect = (modifier_property.MAXIMUM_ATTACK_SPEED + fBonus) * 0.01
        return GameFunc.mathUtil.Clamp(current, minpect, maxpect)
    }
    /**额外攻速 */
    GetModifierAttackSpeedBonus_Constant(): number {
        return modifier_property.SumProps(this.GetParentPlus(), null, GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    }

    /**
     * 伤害倍率，发生暴击在这里返回暴击伤害
     * @param event
     * @returns
     */
    GetModifierPreAttack_CriticalStrike(event: ModifierAttackEvent): number {
        if (IsServer()) {
            let hAttacker = event.attacker as BaseNpc_Plus;
            let hTarget = event.target as BaseNpc_Plus;
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
                        _damage_r = (modifier_property.BASE_SPELL_CRITICALSTRIKE_DAMAGE + modifier_property.SumProps(hAttacker, event, GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE))
                        break
                    // 普攻
                    case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                        _damage_r = (modifier_property.BASE_ATTACK_CRITICALSTRIKE_DAMAGE + modifier_property.SumProps(hAttacker, event, GameEnum.Property.Enum_MODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE))
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
                            _chanceEnum = GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE;
                            break
                        // 普攻
                        case DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK:
                            _chanceEnum = GameEnum.Property.Enum_MODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE
                            break
                    }
                    // 我方主动攻击暴击概率
                    let fChance = modifier_property.SumProps(hAttacker, event, _chanceEnum);
                    // 目标受击暴击概率
                    let tChance = modifier_property.SumProps(hTarget, event, GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
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
        return modifier_property.SumProps(this.GetParentPlus(), null, GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE);
    }



    // GetModifierTotalDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
    //     return 100
    // }
    GetModifierDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        return modifier_property.SumProps(this.GetParentPlus(), event,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
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
        let hTarget = params.target as BaseNpc_Plus;
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
                        _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  受到额外毒伤害 NOTE:若是以后毒伤害不是魔法伤害了，记得改到其他位置上
                    if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_POISON)) {
                        _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_POISON_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
                    fPercent = fPercent * (1 - modifier_property.GetPhysicalReduction(hTarget, params))
                    //  物理护甲
                    if (bDamageAmplify) {
                        _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
                    if (bDamageAmplify) {
                        _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    //  流血伤害加深
                    if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_BLEEDING)) {
                        _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE)
                        fPercent = fPercent * (1 + _tmp * 0.01)
                    }
                    break
                case DAMAGE_TYPES.DAMAGE_TYPE_ALL:
                case DAMAGE_TYPES.DAMAGE_TYPE_HP_REMOVAL:
                    break
            }

            //  全伤害
            if (bDamageAmplify) {
                _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
            //  敌方的减伤，例如无尽的减伤
            // fPercent = fPercent * (1 + GetIncomingDamagePercentEnemy(hTarget, params) * 0.01)
            //  受到额外持续伤害
            if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT)) {
                _tmp = modifier_property.SumProps(hTarget, params, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DOT_DAMAGE_PERCENTAGE)
                fPercent = fPercent * (1 + _tmp * 0.01)
            }
        }
        return fPercent - 100
    }



    // GetModifierIncomingSpellDamageConstant(event: ModifierAttackEvent): number { return 0 }


}



