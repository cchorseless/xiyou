import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, ParticleModifierThinker } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class kingkong_1 extends BaseAbility_Plus {
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let iProjectileSpeed = this.GetSpecialValueFor("projectile_speed")
        let hThinker = modifier_kingkong_1_thinker.applyThinker(vPosition,hCaster, this,  { duration: 10 },  hCaster.GetTeamNumber(), false)
        let info = {
            EffectName: "particles/units/boss/kingkong/kingkong_1.vpcf",
            Ability: this,
            iMoveSpeed: iProjectileSpeed,
            Source: hCaster,
            Target: hThinker,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2,
            vSourceLoc: hCaster.GetAbsOrigin(),
            bDodgeable: true,
            ExtraData: {}
        }
        ProjectileManager.CreateTrackingProjectile(info)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let flRadius = this.GetSpecialValueFor("radius")
            let flDamage = this.GetAbilityDamage()
            let iDamageType = this.GetAbilityDamageType()
            let flDuration = this.GetSpecialValueFor("stun_duration")
            hTarget.RemoveModifierByName("modifier_kingkong_1_thinker")
            let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), vLocation, null, flRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
            for (let hUnit of (tTargets)) {
                let tDamageInfo = {
                    attacker: hCaster,
                    victim: hUnit,
                    ability: this,
                    damage: flDamage,
                    damage_type: iDamageType
                }
                ApplyDamage(tDamageInfo)
                if (IsValid(hUnit) && hUnit.IsAlive()) {
                    hUnit.ApplyStunned(this, hCaster, flDuration)
                }

            }
            //  落地特效
            let iParticleID = ParticleManager.CreateParticle("particles/econ/items/brewmaster/brewmaster_offhand_elixir/brewmaster_thunder_clap_elixir.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null)
            ParticleManager.SetParticleControl(iParticleID, 0, vLocation)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(flRadius, flRadius, flRadius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
            hCaster.EmitSound("n_creep_Thunderlizard_Big.Stomp")
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_kingkong_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers

@registerModifier()
export class modifier_kingkong_1 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    BeCreated(params: IModifierTable) {
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }
    OnIntervalThink() {
        if (this.GetAbilityPlus().IsAbilityReady()) {
            let radius = this.GetAbilityPlus().GetCastRange(this.GetCasterPlus().GetAbsOrigin(), null)
            let tTargets = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), null, radius, this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), this.GetAbilityPlus().GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false)
            if (IsValid(tTargets[0])) {
                ExecuteOrderFromTable({
                    UnitIndex: this.GetParentPlus().entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: this.GetAbilityPlus().entindex(),
                    Position: tTargets[0].GetAbsOrigin()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kingkong_1_thinker extends ParticleModifierThinker { }