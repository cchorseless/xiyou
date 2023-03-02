
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability3_lion_mana_drain } from "./ability3_lion_mana_drain";

/** dota原技能数据 */
export const Data_lion_voodoo = { "ID": "5045", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Lion.Voodoo", "AbilityCastRange": "500", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "30.0 24.0 18.0 12.0", "AbilityManaCost": "125 150 175 200", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "2.5 3 3.5 4" }, "02": { "var_type": "FIELD_INTEGER", "movespeed": "120" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_lion_voodoo extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lion_voodoo";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lion_voodoo = Data_lion_voodoo;
    Init() {
        this.SetDefaultSpecialValue("duration", [2.5, 3, 3.5, 4, 4.5, 5]);
        this.SetDefaultSpecialValue("movespeed", 140);
        this.SetDefaultSpecialValue("mana", [150, 240, 350, 480, 630, 800]);
        this.SetDefaultSpecialValue("overflow_duration", 5);
        this.SetDefaultSpecialValue("radius", 325);

    }

    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        return this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_lion_custom")
    }
    Voodoo(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        modifier_lion_2_debuff.apply(hTarget, hCaster, this, { duration: duration * (100 - hTarget.GetStatusResistance()) * 0.01 })
        hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_Lion.Hex.Target", hCaster))

        let hAbility4 = ability3_lion_mana_drain.findIn(hCaster)
        if (GFuncEntity.IsValid(hAbility4) && hAbility4.GetTargetMana != null) {
            hAbility4.GetTargetMana(hTarget)
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GFuncEntity.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        let duration = this.GetSpecialValueFor("duration")
        let radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_lion_custom")
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
        for (let hTarget of (tTargets)) {
            this.Voodoo(hTarget)
        }
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Lion.Voodoo", hCaster), hCaster)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lion_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lion_2 extends BaseModifier_Plus {
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
            if (!GFuncEntity.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        if (IsServer()) {
            let hAttacker = params.attacker
            let hTarget = params.target
            if (GFuncEntity.IsValid(hAttacker) && GFuncEntity.IsValid(hTarget)) {
                if (hTarget.IsHexed()) {
                    return hAttacker.GetTalentValue("special_bonus_unique_lion_custom_7")
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_2_debuff extends BaseModifier_Plus {
    movespeed: number;
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lion/lion_spell_voodoo.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lion/lion_spell_voodoo_ambient.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.movespeed = this.GetSpecialValueFor("movespeed")
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_HEXED]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_NO_ALL_ARMOR)
    G_STATS_NO_ALL_ARMOR() {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    GetMoveSpeedOverride(params: IModifierTable) {
        return this.movespeed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/props_gameplay/frog.vmdl", this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PRESERVE_PARTICLES_ON_MODEL_CHANGE)
    G_PreserveParticlesOnModelChanged() {
        return 1
    }
}
