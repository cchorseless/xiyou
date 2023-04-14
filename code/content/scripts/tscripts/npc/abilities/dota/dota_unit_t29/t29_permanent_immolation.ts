import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t29_permanent_immolation extends BaseAbility_Plus {
    // 用的火猫的烈火罩改的
    // 暂时没发现什么bug
    // Abilities

    GetIntrinsicModifierName() {
        return "modifier_t29_permanent_immolation"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t29_permanent_immolation extends BaseModifier_Plus {
    radius: any;
    iParticleID: ParticleID;
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
        return !this.GetCasterPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
    }
    GetAura() {
        return "modifier_t29_permanent_immolation_debuff"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    BeCreated(params: IModifierTable) {

        this.radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t29_permanent_immolation.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(this.iParticleID, 2, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(this.iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            if (this.iParticleID != null) {
                ParticleManager.SetParticleControl(this.iParticleID, 2, Vector(this.radius, this.radius, this.radius))
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t29_permanent_immolation_debuff extends BaseModifier_Plus {
    mana_damage_per_second: number;
    tick_interval: number;
    damage_type: DAMAGE_TYPES;
    IsHidden() {
        return true
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

        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.mana_damage_per_second = this.GetSpecialValueFor("mana_damage_per_second")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            let caster = this.GetCasterPlus()
            let target = this.GetParentPlus()
            //  let particleID = ResHelper.CreateParticle({
            //     resPath: "particles/units/heroes/hero_brewmaster/brewmaster_fire_immolation_child.vpcf",
            //     resNpc: null,
            //     iAttachment:   ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
            //     owner:  target
            // });

            //  ParticleManager.SetParticleControlEnt(particleID, 1, caster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, caster.GetAbsOrigin(), true)
            //  this.AddParticle(particleID, false, false, -1, false, false)

            this.StartIntervalThink(this.tick_interval)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.mana_damage_per_second = this.GetSpecialValueFor("mana_damage_per_second")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let target = this.GetParentPlus()
            let ability = this.GetAbilityPlus()
            if (!IsValid(caster) || !IsValid(ability) || caster.PassivesDisabled()) {
                this.Destroy()
                return
            }

            let damage = (caster.GetMana() * this.mana_damage_per_second * 0.01) * this.tick_interval

            let damage_table = {
                ability: ability,
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: this.damage_type
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }

}