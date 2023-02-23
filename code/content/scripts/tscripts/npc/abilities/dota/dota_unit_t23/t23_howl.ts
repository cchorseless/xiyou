import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_feared } from "../../../modifier/effect/modifier_feared";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t23_howl extends BaseAbility_Plus {

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")

        hCaster.EmitSound("Hero_Lycan.Howl")

        modifier_t23_howl_particle.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        //  唤醒光环
        // let combination_t23_wakeup  = combination_t23_wakeup.findIn(  hCaster )
        // let has_combination_t23_wakeup = GameFunc.IsValid(combination_t23_wakeup) && combination_t23_wakeup.IsActivated()
        // if (has_combination_t23_wakeup) {
        //     // combination_t23_wakeup.WakeUp()
        // }

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let target of (tTargets)) {
            let hModifier = modifier_feared.apply(target, hCaster, this, { duration: duration * target.GetStatusResistanceFactor(hCaster) })
        }
    }


    GetIntrinsicModifierName() {
        return "modifier_t23_howl"
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t23_howl extends BaseModifier_Plus {
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
            let flagFilter = ability.GetAbilityTargetFlags()
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t23_howl_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_dark_willow/dark_willow_wisp_spell.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, 2, radius * 2))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}