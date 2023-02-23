import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";


@registerAbility()
export class t34_avalanche extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("obstacle_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let obstacle_radius = this.GetSpecialValueFor("obstacle_radius")
        let obstacle_duration = this.GetSpecialValueFor("obstacle_duration")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let damage = this.GetSpecialValueFor("damage")
        let vPosition = this.GetCursorPosition()

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, obstacle_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })

            let tDamageTable = {
                victim: hTarget,
                attacker: hCaster,
                damage: damage,
                damage_type: this.GetAbilityDamageType(),
                ability: this,
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }

        let hThinker = modifier_t34_avalanche_stone.applyThinker(vPosition, hCaster, this, { duration: obstacle_duration }, hCaster.GetTeamNumber(), false)
        EmitSoundOnLocationWithCaster(vPosition, "Hero_EarthShaker.Fissure.Cast", hCaster)
    }


    GetIntrinsicModifierName() {
        return "modifier_t34_avalanche"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t34_avalanche extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(),
                range,
                hCaster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE,
                FindOrder.FIND_CLOSEST
            )

            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t34_avalanche_stone extends BaseModifier_Plus {
    obstacle_radius: number;
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
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.obstacle_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraDuration() {
        return 0.25
    }
    GetAura() {
        return "modifier_t34_avalanche_rooted"
    }
    BeCreated(params: IModifierTable) {

        this.obstacle_radius = this.GetSpecialValueFor("obstacle_radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t34_avalanche.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.obstacle_radius, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_EarthShaker.FissureDestroy", this.GetCasterPlus())
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t34_avalanche_rooted extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
        }
    }

}