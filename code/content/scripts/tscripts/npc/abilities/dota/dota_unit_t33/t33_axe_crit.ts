import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t33_axe_crit extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t33_axe_crit"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t33_axe_crit extends BaseModifier_Plus {
    chance: number;
    aoe_radius: number;
    bonus_damage: number;
    slow_duration: number;
    bonus_damage_per_health: number;
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
    IsAttack_bonusDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.chance = this.GetSpecialValueFor("chance")
        this.aoe_radius = this.GetSpecialValueFor("aoe_radius")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.slow_duration = this.GetSpecialValueFor("slow_duration")
        this.bonus_damage_per_health = this.GetSpecialValueFor("bonus_damage_per_health")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    GetProcAttack_BonusDamage_Physical(params: IModifierTable) {
        if (!params.attacker.IsIllusion() && !params.attacker.PassivesDisabled() && !params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            if (GameFunc.mathUtil.PRD(this.chance, params.attacker, "t33_axe_crit")) {
                let hCaster = params.attacker
                let hTarget = params.target
                let hAbility = this.GetAbilityPlus()
                let fDamage = this.bonus_damage + hCaster.GetMaxHealth() * this.bonus_damage_per_health * 0.01

                hCaster.EmitSound("Hero_Centaur.DoubleEdge")

                modifier_t33_axe_crit_particle.apply(hCaster, hTarget, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                modifier_t33_axe_crit_slow.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), this.aoe_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
                for (let target of (tTargets)) {

                    if (target != hTarget) {
                        modifier_t33_axe_crit_slow.apply(target, hCaster, this.GetAbilityPlus(), { duration: this.slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                        let tDamageTable = {
                            victim: target,
                            attacker: hCaster,
                            damage: params.damage + fDamage,
                            damage_type: hAbility.GetAbilityDamageType(),
                            ability: hAbility,
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)
                    }
                }

                return fDamage
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t33_axe_crit_slow extends BaseModifier_Plus {
    slow_movespeed: number;
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
    Init(params: IModifierTable) {
        this.slow_movespeed = this.GetSpecialValueFor("slow_movespeed")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.slow_movespeed
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t33_axe_crit_particle extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hTarget = this.GetCasterPlus()
        let hCaster = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_double_edge.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 5, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}