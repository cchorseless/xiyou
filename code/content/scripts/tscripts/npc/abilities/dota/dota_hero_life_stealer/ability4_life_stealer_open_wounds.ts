import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_bleeding } from "../../../modifier/effect/modifier_generic_bleeding";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_life_stealer_open_wounds = { "ID": "5251", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_LifeStealer.OpenWounds.Cast", "MaxLevel": "1", "IsGrantedByShard": "1", "AbilityCastPoint": "0.2", "AbilityCastRange": "800", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCooldown": "15", "AbilityDuration": "8", "AbilityManaCost": "75", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "slow_steps": "-50 -50 -40 -30 -20 -10 -10 -10" }, "02": { "var_type": "FIELD_INTEGER", "heal_percent": "50", "LinkedSpecialBonus": "special_bonus_unique_lifestealer_2" }, "03": { "var_type": "FIELD_INTEGER", "slow_tooltip": "50" }, "04": { "var_type": "FIELD_INTEGER", "duration": "8" } } };

@registerAbility()
export class ability4_life_stealer_open_wounds extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "life_stealer_open_wounds";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_life_stealer_open_wounds = Data_life_stealer_open_wounds;

    Init() {
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("heal_percent", 7);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("heal_limit", [25, 30, 35, 40, 45, 50]);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_1")
        let radius = this.GetSpecialValueFor("radius")
        if (!IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        // 音效
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_LifeStealer.OpenWounds.Cast", hCaster), hTarget)
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTarget as IBaseNpc_Plus[])) {
            if (IsValid(hTarget) && hTarget.IsAlive()) {
                modifier_life_stealer_4_buff.apply(hTarget, hCaster, this, { duration: hCaster.HasTalent("special_bonus_unique_life_stealer_custom_5") && duration || duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_life_stealer_4"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_4 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                ability.GetAbilityTargetTeam(),
                ability.GetAbilityTargetType(),
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_4_buff extends BaseModifier_Plus {
    heal_percent: number;
    duration: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        this.heal_percent = this.GetSpecialValueFor("heal_percent")
        this.duration = this.GetSpecialValueFor("duration")
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_life_stealer/life_stealer_open_wounds.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, 0, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_life_stealer_open_wounds.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.heal_percent = this.GetSpecialValueFor("heal_percent")
        this.duration = this.GetSpecialValueFor("duration")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    //   OnDamageCalculated(params: IModifierTable) {
    OnTakeDamage(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsValid(hCaster) && IsValid(params.attacker) && params.attacker.GetUnitLabel() == "HERO" && !params.attacker.IsIllusion() && !params.attacker.IsClone() && params.attacker.GetTeamNumber() == hCaster.GetTeamNumber() && params.unit == hParent && !BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_BLEEDING)) {
            let fMaxHealth = params.attacker.GetMaxHealth()
            let fCurHealth = params.attacker.GetHealth()
            let fLossHealth = fMaxHealth - fCurHealth
            let fRegenHealth = params.damage * this.heal_percent * 0.01
            if (fRegenHealth > fLossHealth) {
                let fOverflowHealth = fRegenHealth - fLossHealth
                fRegenHealth = fLossHealth
                // 溢出血量转换为临时最大生命值
                modifier_life_stealer_4_max_health.apply(params.attacker, hCaster, hAbility, { duration: this.duration, fOverflowHealth: fOverflowHealth })
            }
            if (fRegenHealth > 0) {
                params.attacker.ApplyHeal(fRegenHealth, hAbility)
                SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, params.attacker, fRegenHealth, null)
            }
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_lifesteal.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: params.attacker
            });

            ParticleManager.ReleaseParticleIndex(particleID)
            // 非技能伤害
            if (hCaster.HasTalent("special_bonus_unique_life_stealer_custom_3") && params.inflictor == null) {
                let duration = hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_3", "duration")
                modifier_life_stealer_4_reduce_armor.apply(hParent, hCaster, hAbility, { duration: duration })
            }
            // 天赋
            if (hCaster.HasTalent("special_bonus_unique_life_stealer_custom_6")) {
                let iTransforPct = hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_6")
                let blood_duration = hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_6", "duration")
                let fBloodDamage = params.damage * iTransforPct * 0.01
                modifier_generic_bleeding.Bleeding(params.unit, hCaster, hAbility, blood_duration, (tDamageTable) => {
                    return fBloodDamage
                }, true)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_4_max_health extends BaseModifier_Plus {
    heal_limit: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.heal_limit = this.GetSpecialValueFor("heal_limit")
        if (IsServer()) {
            let fHealth = params.fOverflowHealth || 0
            this.SetStackCount(math.min(this.GetStackCount() + fHealth, hCaster.GetStrength() * this.heal_limit))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_4_reduce_armor extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus() {
        if (IsValid(this.GetCasterPlus())) {
            return this.GetStackCount() * this.GetCasterPlus().GetTalentValue("special_bonus_unique_life_stealer_custom_3")
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_GetModifierMagicalArmorBonus() {
        if (IsValid(this.GetCasterPlus())) {
            return this.GetStackCount() * this.GetCasterPlus().GetTalentValue("special_bonus_unique_life_stealer_custom_3")
        }
        return 0
    }
}
