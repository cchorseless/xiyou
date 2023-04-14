
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_stunned } from "../../../modifier/effect/modifier_generic_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_sven_6_buff } from "./ability6_sven_gods_strength";

/** dota原技能数据 */
export const Data_sven_storm_bolt = { "ID": "5094", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Sven.StormBoltImpact", "HasScepterUpgrade": "1", "HasShardUpgrade": "1", "AbilityCastRange": "600", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "18 16 14 12", "AbilityDamage": "110 180 250 320", "AbilityManaCost": "110 120 130 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bolt_speed": "1000" }, "02": { "var_type": "FIELD_FLOAT", "bolt_stun_duration": "1.25 1.5 1.75 2.0", "LinkedSpecialBonus": "special_bonus_unique_sven_4" }, "03": { "var_type": "FIELD_INTEGER", "bolt_aoe": "255" }, "04": { "var_type": "FIELD_INTEGER", "vision_radius": "225" }, "05": { "var_type": "FIELD_INTEGER", "cast_range_bonus_scepter": "350", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_sven_storm_bolt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sven_storm_bolt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sven_storm_bolt = Data_sven_storm_bolt;
    Init() {
        this.SetDefaultSpecialValue("bolt_speed", 1600);
        this.SetDefaultSpecialValue("bolt_stun_duration", 2);
        this.SetDefaultSpecialValue("bolt_aoe", 400);
        this.SetDefaultSpecialValue("vision_radius", 400);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bolt_speed", 1600);
        this.SetDefaultSpecialValue("bolt_stun_duration", 2);
        this.SetDefaultSpecialValue("bolt_aoe", 400);
        this.SetDefaultSpecialValue("vision_radius", 400);

    }

    hBuffPtcl: IBaseAbility_Plus;

    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue('special_bonus_unique_sven_custom_6')
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("bolt_aoe")
    }
    OnAbilityPhaseStart() {
        this.hBuffPtcl = modifier_sven_1_particle_pre.apply(this.GetCasterPlus(), this.GetCasterPlus(), this, {}) as any;
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (IsValid(this.hBuffPtcl)) {
            this.hBuffPtcl.Destroy()
        }
    }
    OnSpellStart() {
        if (IsValid(this.hBuffPtcl)) {
            this.hBuffPtcl.Destroy()
        }

        let caster = this.GetCasterPlus()
        let target = this.GetCursorTarget()

        let bolt_speed = this.GetSpecialValueFor("bolt_speed")
        let vision_radius = this.GetSpecialValueFor("vision_radius")

        let info = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_sven/sven_spell_storm_bolt.vpcf", caster),
            vSourceLoc: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_attack2")),
            iMoveSpeed: bolt_speed,
            Target: target,
            Source: caster,
            bProvidesVision: true,
            iVisionTeamNumber: caster.GetTeamNumber(),
            iVisionRadius: vision_radius,
        }
        ProjectileManager.CreateTrackingProjectile(info)
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Sven.StormBolt", caster))
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus

        if (hTarget != null && hTarget.TriggerSpellAbsorb(this)) {
            return true
        }
        let bolt_aoe = this.GetSpecialValueFor("bolt_aoe")
        let bolt_stun_duration = this.GetSpecialValueFor("bolt_stun_duration")
        let damage = this.GetAbilityDamage()

        //  天赋风暴之拳力量伤害系数
        if (hCaster.GetStrength) {
            damage = damage + hCaster.GetTalentValue('special_bonus_unique_sven_custom_4') * hCaster.GetStrength()
        }
        //  天赋风暴之拳攻击力伤害
        damage = damage + hCaster.GetTalentValue("special_bonus_unique_sven_custom_7") * hCaster.GetAverageTrueAttackDamage(hTarget) * 0.01
        //  天赋大招期间风暴之拳额外伤害
        if (modifier_sven_6_buff.exist(hCaster)) {
            damage = damage * (1 + hCaster.GetTalentValue("special_bonus_unique_sven_custom_1") / 100)
        }

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_Sven.StormBoltImpact", hCaster), hCaster)

        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vLocation, bolt_aoe, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 1)
        for (let target of (targets)) {
            // 纯粹，无视状态抗性
            if (hCaster.HasShard()) {
                let damage_table = {
                    ability: this,
                    attacker: hCaster,
                    victim: target,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                }
                BattleHelper.GoApplyDamage(damage_table)
                modifier_generic_stunned.apply(target, hCaster, this, { duration: bolt_stun_duration })
            } else {
                let damage_table = {
                    ability: this,
                    attacker: hCaster,
                    victim: target,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)
                modifier_generic_stunned.apply(target, hCaster, this, { duration: bolt_stun_duration * target.GetStatusResistanceFactor(hCaster) })
            }
        }

        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_sven_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sven_1 extends BaseModifier_Plus {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                ability.GetAbilityTargetTeam(),
                ability.GetAbilityTargetType(),
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}

// 特效
@registerModifier()
export class modifier_sven_1_particle_pre extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_spell_storm_bolt_lightning.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_sword", this.GetCasterPlus().GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
