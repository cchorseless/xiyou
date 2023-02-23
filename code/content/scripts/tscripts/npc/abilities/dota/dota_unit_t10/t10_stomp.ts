import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t10_stomp extends BaseAbility_Plus {

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        this.GetCasterPlus().EmitSound("n_creep_Centaur.Stomp")
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().StopSound("n_creep_Centaur.Stomp")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()

        let radius = this.GetSpecialValueFor("radius")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let stomp_damage = this.GetSpecialValueFor("stomp_damage")
        modifier_t10_stomp_particle_neutral_centaur_khan_war_stomp.apply(caster, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        // let combination_t10_barbaric_stomp  = combination_t10_barbaric_stomp.findIn(  caster )
        // let has_combination_t10_barbaric_stomp = GameFunc.IsValid(combination_t10_barbaric_stomp) && combination_t10_barbaric_stomp.IsActivated()

        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let target of (targets)) {
            // if (has_combination_t10_barbaric_stomp) {
            //     combination_t10_barbaric_stomp.BarbaricStomp(target)
            // }
            modifier_stunned.apply(target, caster, this, { duration: stun_duration * target.GetStatusResistanceFactor(caster) })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_t10_stomp"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t10_stomp extends BaseModifier_Plus {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t10_stomp_particle_neutral_centaur_khan_war_stomp extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/neutral_fx/neutral_centaur_khan_war_stomp.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(particleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }

}