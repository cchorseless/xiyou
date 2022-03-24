
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";

/** dota原技能数据 */
export const Data_snapfire_scatterblast = { "ID": "6480", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Snapfire.Shotgun.Fire", "HasShardUpgrade": "1", "AbilityCastRange": "800", "AbilityCastPoint": "0.4", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AnimationPlaybackRate": "1.2", "AbilityCooldown": "13 12 11 10", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "80 150 220 290", "LinkedSpecialBonus": "special_bonus_unique_snapfire_7" }, "02": { "var_type": "FIELD_INTEGER", "blast_speed": "3000" }, "03": { "var_type": "FIELD_INTEGER", "blast_width_initial": "225" }, "04": { "var_type": "FIELD_INTEGER", "blast_width_end": "400" }, "05": { "var_type": "FIELD_FLOAT", "debuff_duration": "1.0" }, "06": { "var_type": "FIELD_INTEGER", "movement_slow_pct": "100" }, "07": { "var_type": "FIELD_INTEGER", "attack_slow_pct": "100" }, "08": { "var_type": "FIELD_INTEGER", "point_blank_range": "450" }, "09": { "var_type": "FIELD_FLOAT", "point_blank_dmg_bonus_pct": "50.0" } } };

@registerAbility()
export class ability1_snapfire_scatterblast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "snapfire_scatterblast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_snapfire_scatterblast = Data_snapfire_scatterblast;
    Init() {
        this.SetDefaultSpecialValue("projectile_speed", 1000);
        this.SetDefaultSpecialValue("jump_duration", 0.484);
        this.SetDefaultSpecialValue("jump_height", 257);
        this.SetDefaultSpecialValue("jump_horizontal_distance", 450);
        this.SetDefaultSpecialValue("impact_radius", 300);
        this.SetDefaultSpecialValue("impact_damage", [550, 1000, 1700, 2400, 3500, 5000]);
        this.SetDefaultSpecialValue("impact_stun_duration", 3);
        this.SetDefaultSpecialValue("str_factor_damage", [5, 6, 7, 8, 9, 10]);

    }

    GetIntrinsicModifierName() {
        return "modifier_snapfire_1"
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            let hCaster = this.GetCasterPlus()
            let debuff_duration = this.GetSpecialValueFor("debuff_duration")
            let point_blank_range = this.GetSpecialValueFor("point_blank_range")
            let damage = this.GetSpecialValueFor("damage")
            let point_blank_dmg_bonus_pct = this.GetSpecialValueFor("point_blank_dmg_bonus_pct")
            // 减速
            modifier_snapfire_1_debuff.apply(hTarget, hCaster, this, { duration: debuff_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            // 伤害
            let fDamage = damage * hCaster.GetAverageTrueAttackDamage(hCaster) * 0.01
            let damage_table = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            if (((hTarget.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector).Length2D() < point_blank_range) {
                let iPtclID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_slow.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(iPtclID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iPtclID)
            } else {
                if (!hCaster.HasShard()) {
                    damage_table.damage = damage_table.damage * point_blank_dmg_bonus_pct * 0.01
                }
            }

            // 特效
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_impact.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iPtclID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iPtclID)

            BattleHelper.GoApplyDamage(damage_table)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_1 extends BaseModifier_Plus {
    attack_count: number;
    crit_shard: number;
    IsHidden() {
        return this.GetStackCount() == 0
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

    Init(params: ModifierTable) {
        this.attack_count = this.GetSpecialValueFor("attack_count")
        this.crit_shard = this.GetSpecialValueFor("crit_shard")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_CRITICALSTRIKE)
    EOM_GetModifierSpellCriticalStrike(params: ModifierTable) {
        if (IsServer()) {
            if (params.inflictor == this.GetAbilityPlus() && this.GetCasterPlus().HasShard()) {
                return this.crit_shard
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == hParent) {
            this.IncrementStackCount()
            if (this.GetStackCount() >= this.attack_count + hParent.GetTalentValue("special_bonus_unique_snapfire_custom_4")) {
                let vTarget = params.target.GetAbsOrigin()
                hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.Shotgun.Fire", hParent))
                let blast_speed = this.GetSpecialValueFor("blast_speed")
                let blast_width_initial = this.GetSpecialValueFor("blast_width_initial")
                let blast_width_end = this.GetSpecialValueFor("blast_width_end")
                let iRange = hAbility.GetCastRange(hParent.GetAbsOrigin(), hParent)
                let vDir = ((vTarget - hParent.GetAbsOrigin()) as Vector).Normalized()
                let info = {
                    Ability: hAbility,
                    Source: hParent,
                    EffectName: "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun.vpcf",
                    vSpawnOrigin: hParent.GetAbsOrigin(),
                    vVelocity: (vDir * blast_speed) as Vector,
                    fDistance: iRange,
                    fStartRadius: blast_width_initial,
                    fEndRadius: blast_width_end,
                    iUnitTargetTeam: hAbility.GetAbilityTargetTeam(),
                    iUnitTargetType: hAbility.GetAbilityTargetType(),
                }
                ProjectileManager.CreateLinearProjectile(info)
                this.SetStackCount(0)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_1_debuff extends BaseModifier_Plus {
    reduce_move_speed_percent: number;
    IsHidden() {
        return false
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

    Init(params: ModifierTable) {
        this.reduce_move_speed_percent = this.GetSpecialValueFor("reduce_move_speed_percent")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.reduce_move_speed_percent
    }

}
