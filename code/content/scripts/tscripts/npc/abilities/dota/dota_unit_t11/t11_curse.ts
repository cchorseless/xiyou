import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t11_curse extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("aoe_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let thinker_duration = this.GetSpecialValueFor("thinker_duration")

        hCaster.EmitSound("Hero_WitchDoctor.Maledict_Cast")

        modifier_t11_curse_thinker.applyThinker(vPosition, hCaster, this, { duration: thinker_duration }, hCaster.GetTeamNumber(), false)
    }


    GetIntrinsicModifierName() {
        return "modifier_t11_curse"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t11_curse extends BaseModifier_Plus {
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
            if (!IsValid(ability)) {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)

            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t11_curse_thinker extends BaseModifier_Plus {
    thinker_duration: number;
    think_interval: number;
    curse_duration: number;
    curse_chance: number;
    aoe_radius: number;
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
    BeCreated(params: IModifierTable) {

        let thinker_duration = this.thinker_duration
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetParentPlus().GetAbsOrigin()
        let aoe_radius = this.aoe_radius
        if (IsServer()) {
            this.StartIntervalThink(this.think_interval)
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t13/curse.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(particleID, 0, vPosition)
            ParticleManager.SetParticleControl(particleID, 1, Vector(aoe_radius, 0, 0))
            ParticleManager.SetParticleControl(particleID, 2, Vector(thinker_duration, 0, 0))
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }

    Init(params: IModifierTable) {
        this.thinker_duration = this.GetSpecialValueFor("thinker_duration")
        this.think_interval = this.GetSpecialValueFor("think_interval")
        this.curse_chance = this.GetSpecialValueFor("curse_chance")
        this.curse_duration = this.GetSpecialValueFor("curse_duration")
        this.aoe_radius = this.GetSpecialValueFor("aoe_radius")
    }
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!IsValid(hCaster)) {
                return
            }
            let hAbility = this.GetAbilityPlus()
            // let combination_t11_corrode_curse  = combination_t11_corrode_curse.findIn(  hCaster )
            // let has_combination_t11_corrode_curse = IsValid(combination_t11_corrode_curse) && combination_t11_corrode_curse.IsActivated()

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.aoe_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                if (GFuncMath.PRD(this.curse_chance, hCaster, "t11_curse")) {
                    modifier_t11_curse_debuff.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.curse_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                    // if (has_combination_t11_corrode_curse && combination_t11_corrode_curse.CorrodeCurse) {
                    //     combination_t11_corrode_curse.CorrodeCurse(hTarget, this.curse_duration)
                    // }

                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "n_creep_Spawnlord.Freeze", hCaster)
                }
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t11_curse_debuff extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
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

        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/neutral_fx/prowler_shaman_shamanistic_ward.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }

}