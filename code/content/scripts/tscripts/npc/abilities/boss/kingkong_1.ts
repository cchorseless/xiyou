import { AI_ability } from "../../../ai/AI_ability";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { ParticleModifierThinker } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class kingkong_1 extends BaseAbility_Plus {
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let iProjectileSpeed = this.GetSpecialValueFor("projectile_speed")
        let hThinker = modifier_kingkong_1_thinker.applyThinker(vPosition, hCaster, this, { duration: 10 }, hCaster.GetTeamNumber(), false)
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

    AutoSpellSelf(): boolean {
        return AI_ability.POSITION_if_enemy(this)
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kingkong_1_thinker extends ParticleModifierThinker { }