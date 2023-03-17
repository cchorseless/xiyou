
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_stunned } from "../../../modifier/effect/modifier_generic_stunned";
import { ability1_luna_lucent_beam } from "./ability1_luna_lucent_beam";

/** dota原技能数据 */
export const Data_luna_eclipse = { "ID": "5225", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Luna.Eclipse.Cast", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.5", "AbilityCastRange": "0", "AbilityDuration": "2.4 4.2 6.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "140.0", "AbilityManaCost": "150 200 250", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "cast_range_tooltip_scepter": "2500", "RequiresScepter": "1" }, "11": { "var_type": "FIELD_FLOAT", "night_duration": "10.0" }, "01": { "var_type": "FIELD_INTEGER", "beams": "6 9 12" }, "02": { "var_type": "FIELD_INTEGER", "hit_count": "5" }, "03": { "var_type": "FIELD_FLOAT", "beam_interval": "0.6 0.6 0.6" }, "04": { "var_type": "FIELD_FLOAT", "beam_interval_scepter": "0.3" }, "06": { "var_type": "FIELD_INTEGER", "radius": "675 675 675" }, "07": { "var_type": "FIELD_INTEGER", "beams_scepter": "6 12 18", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "hit_count_scepter": "6 12 18", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_FLOAT", "duration_tooltip_scepter": "1.8 3.6 5.4", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_luna_eclipse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "luna_eclipse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_luna_eclipse = Data_luna_eclipse;
    Init() {
        this.SetDefaultSpecialValue("beams", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("scepter_radius", 200);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_luna_custom_1")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let iPreParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_luna/luna_eclipse_precast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iPreParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iPreParticleID)
        return true
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        modifier_luna_6_thinker.apply(caster, caster, this)
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Luna.Eclipse.Cast", caster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_luna_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_luna_6 extends BaseModifier_Plus {
    shard_interval: number;
    ai_interval: number;
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
            this.shard_interval = this.GetSpecialValueFor("duration") + GameRules.GetGameTime()
            this.ai_interval = GameSetting.AI_TIMER_TICK_TIME_HERO + GameRules.GetGameTime()
            this.StartIntervalThink(0)
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

            let caster = ability.GetCasterPlus()
            if (GameRules.GetGameTime() >= this.ai_interval) {
                this.ai_interval = GameSetting.AI_TIMER_TICK_TIME_HERO + GameRules.GetGameTime()
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
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                if (targets[0] != null) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    })
                }
            }
            if (GameRules.GetGameTime() >= this.shard_interval && caster.HasShard()) {
                this.shard_interval = this.GetSpecialValueFor("duration") + GameRules.GetGameTime()
                modifier_luna_6_thinker.apply(caster, caster, this.GetAbilityPlus(), null)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_luna_6_thinker extends BaseModifier_Plus {
    damage: number;
    beams: number;
    hit_count: any;
    duration: number;
    radius: number;
    scepter_radius: number;
    beam_interval: number;
    count: number;
    targets: Array<any>;
    hit_counter: Array<any>;
    damage_type: DAMAGE_TYPES;
    position: any;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let extra_beams = this.GetCasterPlus().HasTalent("special_bonus_unique_luna_custom_4") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_custom_4") || 0
        this.damage = this.GetSpecialValueFor("damage")
        this.beams = this.GetSpecialValueFor("beams") + extra_beams
        this.hit_count = this.beams
        this.duration = this.GetSpecialValueFor("duration")
        this.radius = this.GetSpecialValueFor("radius")
        this.scepter_radius = this.GetSpecialValueFor("scepter_radius")
        this.beam_interval = this.duration / this.beams
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let carrier = this.GetParentPlus()
            this.count = 0
            this.targets = []
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            if (params.position != null) {
                this.position = GFuncVector.StringToVector(params.position)
            }
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/particle_sr/luna/luna_3.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            if (this.position != null) {
                ParticleManager.SetParticleControl(particleID, 0, this.position)
            } else {
                ParticleManager.SetParticleControlEnt(particleID, 0, carrier, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, carrier.GetAbsOrigin(), true)
            }
            ParticleManager.SetParticleControl(particleID, 1, Vector(this.radius, 0, 0))
            ParticleManager.SetParticleControlEnt(particleID, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)

            this.StartIntervalThink(FrameTime())
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            this.Hit()
            this.StartIntervalThink(this.beam_interval)
        }
    }
    Hit() {
        let caster = this.GetCasterPlus()
        let carrier = this.GetParentPlus()

        let position = this.position || carrier.GetAbsOrigin()

        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), position, this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0)
        for (let i = targets.length - 1; i >= 0; i--) {
            if (i >= this.hit_count) {
                table.remove(targets, i)
            }
        }
        if (targets[0] != null) {
            this.HitTarget(targets[0])
        } else {
            let randomVector = position + Vector(RandomFloat(-this.radius, this.radius), RandomFloat(-this.radius, this.radius), 0)
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_luna/luna_eclipse_impact_notarget.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 1, randomVector)
            ParticleManager.SetParticleControl(particleID, 5, randomVector)
            ParticleManager.ReleaseParticleIndex(particleID)
            EmitSoundOnLocationWithCaster(randomVector, ResHelper.GetSoundReplacement("Hero_Luna.Eclipse.NoTarget", caster), caster)
        }

        this.count = this.count + 1
        if (this.count >= this.beams) {
            this.Destroy()
        }
    }

    HitTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()

        let key = this.targets.indexOf(hTarget)
        if (key == null) {
            table.insert(this.targets, hTarget)
        }
        let particleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_luna/luna_eclipse_impact.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(particleID, 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(particleID, 5, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(particleID)

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Luna.Eclipse.Target", hCaster), hCaster)

        let luna_1 = ability1_luna_lucent_beam.findIn(hCaster)
        if (GFuncEntity.IsValid(luna_1) && luna_1.GetLevel() > 0) {
            let beam_damage = luna_1.GetSpecialValueFor("beam_damage")
            let beam_damage_per_agi = luna_1.GetSpecialValueFor("beam_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_luna_custom_3")

            let iAgi = hCaster.GetAgility != null && hCaster.GetAgility() || 0
            let fDamage = beam_damage + beam_damage_per_agi * iAgi
            if (hCaster.HasScepter()) {
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), this.scepter_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
                for (let hTarget of (tTargets)) {
                    BattleHelper.GoApplyDamage({
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage,
                        damage_type: this.damage_type
                    })
                }
            } else {
                BattleHelper.GoApplyDamage({
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: this.damage_type
                })
            }
            if (hCaster.HasTalent("special_bonus_unique_luna_custom_6")) {
                let duration = hCaster.GetTalentValue("special_bonus_unique_luna_custom_6")
                modifier_generic_stunned.apply(hTarget, hCaster, hAbility, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }
    }
}
