
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_skywrath_mage_arcane_bolt = { "ID": "5581", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_SkywrathMage.ArcaneBolt.Cast", "HasScepterUpgrade": "1", "AbilityCastRange": "875", "AbilityCastPoint": "0.1 0.1 0.1 0.1", "AbilityCooldown": "5.0 4.0 3.0 2.0", "AbilityManaCost": "90", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bolt_speed": "500" }, "02": { "var_type": "FIELD_INTEGER", "bolt_vision": "325" }, "03": { "var_type": "FIELD_FLOAT", "bolt_damage": "60 85 110 135" }, "04": { "var_type": "FIELD_FLOAT", "int_multiplier": "1.4", "CalculateSpellDamageTooltip": "1" }, "05": { "var_type": "FIELD_FLOAT", "vision_duration": "3.34" }, "06": { "var_type": "FIELD_INTEGER", "scepter_radius": "700", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_skywrath_mage_arcane_bolt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skywrath_mage_arcane_bolt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skywrath_mage_arcane_bolt = Data_skywrath_mage_arcane_bolt;
    Init() {
        this.SetDefaultSpecialValue("bolt_speed", 600);
        this.SetDefaultSpecialValue("bolt_vision", 325);
        this.SetDefaultSpecialValue("bolt_damage", [240, 480, 720, 960, 1200, 1440]);
        this.SetDefaultSpecialValue("int_multiplier", [5, 5.5, 6, 6.5, 7, 8]);
        this.SetDefaultSpecialValue("scepter_radius", 700);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bolt_speed", 600);
        this.SetDefaultSpecialValue("bolt_vision", 325);
        this.SetDefaultSpecialValue("bolt_damage", [240, 480, 720, 960, 1200, 1440]);
        this.SetDefaultSpecialValue("int_multiplier", [7.0, 7.6, 8.2, 8.8, 9.2, 9.6]);
        this.SetDefaultSpecialValue("scepter_radius", 700);

    }


    GetCastPoint() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_skywrath_mage_custom_3")) {
            return 0
        }
        return super.GetCastPoint()
    }
    ArcaneBolt(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        this.HitTarget(hTarget)
        if (hCaster.HasTalent("special_bonus_unique_skywrath_mage_custom_8")) {
            let count = hCaster.GetTalentValue("special_bonus_unique_skywrath_mage_custom_8")
            this.addTimer(0.2, () => {
                this.HitTarget(hTarget)
                count = count - 1
                if (count > 0) {
                    return 0.2
                }
            })
        }
    }
    HitTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let bolt_speed = this.GetSpecialValueFor("bolt_speed")
        let tHashtable = HashTableHelper.CreateHashtable()
        tHashtable.hModifier = modifier_skywrath_mage_1_projectile.apply(hCaster, hTarget, this, null)
        let info: CreateTrackingProjectileOptions = {
            Source: hCaster,
            Ability: this,
            EffectName: "",
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            vSourceLoc: hCaster.GetAbsOrigin(),
            iMoveSpeed: bolt_speed,
            Target: hTarget,
            ExtraData: {
                hashtable_index: tHashtable.__hashuuid__
            }
        }
        ProjectileManager.CreateTrackingProjectile(info)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let bolt_damage = this.GetSpecialValueFor("bolt_damage")
        let int_multiplier = this.GetSpecialValueFor("int_multiplier")
        let tDamageTable = {
            victim: hTarget,
            attacker: hCaster,
            damage: bolt_damage + int_multiplier * hCaster.GetIntellect(),
            damage_type: this.GetAbilityDamageType(),
            ability: this,
        }
        BattleHelper.GoApplyDamage(tDamageTable)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_SkywrathMage.ArcaneBolt.Impact", hCaster))
        hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_SkywrathMage.ArcaneBolt.Cast", hCaster))
        if (ExtraData && ExtraData.hashtable_index != null) {
            let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index || -1)
            if (tHashtable != null) {
                if (GameFunc.IsValid(tHashtable.hModifier)) {
                    tHashtable.hModifier.Destroy()
                }
            }
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (!hTarget.TriggerSpellAbsorb(this)) {
            this.ArcaneBolt(hTarget)
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_SkywrathMage.ArcaneBolt.Cast", hCaster))
        }
        let extra_count = hCaster.GetTalentValue("special_bonus_unique_skywrath_mage_custom_1")
        if (hCaster.HasScepter()) {
            extra_count = extra_count + 1 + hCaster.GetTalentValue("special_bonus_unique_skywrath_mage_custom_7")
        }
        if (extra_count > 0) {
            let scepter_radius = this.GetSpecialValueFor("scepter_radius")
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), scepter_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
            for (let hUnit of (tTargets)) {
                if (extra_count > 0) {
                    if (GameFunc.IsValid(hUnit) && hUnit != hTarget) {
                        extra_count = extra_count - 1
                        this.ArcaneBolt(hUnit)
                    }
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_skywrath_mage_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skywrath_mage_1 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
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
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skywrath_mage_1_projectile extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let bolt_speed = this.GetSpecialValueFor("bolt_speed")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(bolt_speed, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
