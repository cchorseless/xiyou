
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_centaur_hoof_stomp = { "ID": "5514", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Centaur.HoofStomp", "AbilityCastPoint": "0.5 0.5 0.5 0.5", "AbilityCooldown": "18 16 14 12", "AbilityManaCost": "100 110 120 130", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "330" }, "02": { "var_type": "FIELD_FLOAT", "stun_duration": "1.7 2.0 2.3 2.6", "LinkedSpecialBonus": "special_bonus_unique_centaur_2" }, "03": { "var_type": "FIELD_INTEGER", "stomp_damage": "100 150 200 250" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_centaur_hoof_stomp extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "centaur_hoof_stomp";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_centaur_hoof_stomp = Data_centaur_hoof_stomp;
    Init() {
        this.SetDefaultSpecialValue("stun_per_strength", 0.01);
        this.SetDefaultSpecialValue("stomp_damage", [300, 600, 900, 1200, 1500, 2300]);
        this.SetDefaultSpecialValue("stun_duration_max", 6);
        this.SetDefaultSpecialValue("radius", 800);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let caster_point = caster.GetAbsOrigin()

        let radius = this.GetSpecialValueFor("radius")
        let stun_duration_max = this.GetSpecialValueFor("stun_duration_max")
        let stun_duration = this.GetSpecialValueFor("stun_per_strength") * caster.GetStrength()
        stun_duration = stun_duration > stun_duration_max && stun_duration_max || stun_duration
        let stomp_damage = this.GetSpecialValueFor("stomp_damage")

        modifier_centaur_1_particle_start.apply(caster, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Centaur.HoofStomp", caster))

        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster_point, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        for (let target of (targets)) {
            let damage_table = {
                ability: this,
                victim: target,
                attacker: caster,
                damage: stomp_damage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
            modifier_stunned.apply(target, caster, this, { duration: stun_duration * target.GetStatusResistanceFactor(caster) })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_centaur_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_centaur_1 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
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

// 特效
@registerModifier()
export class modifier_centaur_1_particle_start extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let caster = this.GetCasterPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_warstomp.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: caster
            });

            ParticleManager.SetParticleControl(particleID, 0, caster.GetAbsOrigin())
            ParticleManager.SetParticleControl(particleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }

}
