import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_queenofpain_shadow_strike = { "ID": "5173", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_QueenOfPain.ShadowStrike", "AbilityCastRange": "450 500 550 600", "AbilityCastPoint": "0.4", "AbilityCooldown": "16.0 12.0 8.0 4.0", "AbilityDuration": "15.0", "AbilityManaCost": "110 120 130 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "strike_damage": "30 60 90 120" }, "02": { "var_type": "FIELD_INTEGER", "duration_damage": "30 50 70 90" }, "03": { "var_type": "FIELD_INTEGER", "movement_slow": "-20 -35 -50 -65" }, "04": { "var_type": "FIELD_INTEGER", "projectile_speed": "900" }, "06": { "var_type": "FIELD_FLOAT", "damage_interval": "3.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_queenofpain_shadow_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "queenofpain_shadow_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_queenofpain_shadow_strike = Data_queenofpain_shadow_strike;
    Init() {
        this.SetDefaultSpecialValue("strike_damage", [500, 750, 1000, 1300, 1600, 2000]);
        this.SetDefaultSpecialValue("poison_active_percnet", 50);
        this.SetDefaultSpecialValue("movement_slow", -20);
        this.SetDefaultSpecialValue("projectile_speed", 900);
        this.SetDefaultSpecialValue("extra_targets", [1, 1, 2, 2, 3, 4]);
        this.SetDefaultSpecialValue("scepter_chance", 35);

    }

    Init_old() {
        this.SetDefaultSpecialValue("strike_damage", [500, 750, 1000, 1300, 1600, 2000]);
        this.SetDefaultSpecialValue("poisons", [100, 300, 500, 700, 900, 1100]);
        this.SetDefaultSpecialValue("movement_slow", -20);
        this.SetDefaultSpecialValue("projectile_speed", 900);
        this.SetDefaultSpecialValue("extra_targets", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("scepter_castpoint_reduction", 90);

    }



    GetPlaybackRateOverride() {
        if (this.GetCasterPlus().HasScepter()) {
            return 1 / math.max(FrameTime(), 1 - this.GetSpecialValueFor("scepter_castpoint_reduction") * 0.01)
        }
        return super.GetPlaybackRateOverride()
    }
    GetCastPoint() {
        if (this.GetCasterPlus().HasScepter()) {
            return super.GetCastPoint() * (1 - this.GetSpecialValueFor("scepter_castpoint_reduction") * 0.01)
        }
        return super.GetCastPoint()
    }
    ShadowStrike(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let projectile_speed = this.GetSpecialValueFor("projectile_speed")

        modifier_queenofpain_1_particle_cast.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        let tHashtable = HashTableHelper.CreateHashtable()
        tHashtable.hModifier = modifier_queenofpain_1_particle_projectile.apply(hCaster, hTarget, this, null)

        let tInfo: CreateTrackingProjectileOptions = {
            Ability: this,
            EffectName: "",
            Source: hCaster,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            vSourceLoc: hCaster.GetAbsOrigin(),
            Target: hTarget,
            iMoveSpeed: projectile_speed,
            ExtraData: {
                hashtable_index: tHashtable.__hashuuid__
            }
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget() as BaseNpc_Plus
        this.ShadowStrike(hTarget)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_QueenOfPain.ShadowStrike", hCaster))
        let extra_targets = this.GetSpecialValueFor("extra_targets")
        let fCastRange = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        let iTeamFilter = this.GetAbilityTargetTeam()
        let iTypeFilter = this.GetAbilityTargetType()
        let iFlagFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        let iOrder = FindOrder.FIND_CLOSEST
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fCastRange, null, iTeamFilter, iTypeFilter, iFlagFilter, iOrder)
        let n = 0
        for (let hUnit of (tTargets)) {
            if (hUnit != hTarget) {
                this.ShadowStrike(hUnit)
                n += 1;
                if (n >= extra_targets) {
                    break
                }
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GameFunc.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let fDuration = this.GetDuration()
            let strike_damage = this.GetSpecialValueFor("strike_damage")
            let strike_damage_per_int = this.GetSpecialValueFor("strike_damage_per_int") + hCaster.GetTalentValue("special_bonus_unique_queenofpain_custom_4")
            let poison_active_percnet = this.GetSpecialValueFor("poison_active_percnet")
            let poisons = this.GetSpecialValueFor("poisons")
            let stack_percent = hCaster.GetTalentValue("special_bonus_unique_queenofpain_custom_3")
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_QueenOfPain.ShadowStrike.Target", hCaster), hCaster)

            let iStackCount = modifier_queenofpain_1_debuff.GetStackIn(hTarget, hCaster)
            let fExtarPercent = iStackCount * stack_percent * 0.01

            modifier_queenofpain_1_debuff.apply(hTarget, hCaster, this, { duration: fDuration })

            let iInt = 0
            if (hCaster.GetIntellect != null) {
                iInt = hCaster.GetIntellect()
            }
            modifier_poison.PoisonActive(hTarget, hCaster, this, poison_active_percnet * 0.01 * (1 + fExtarPercent))
            BattleHelper.GoApplyDamage({
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: (strike_damage + iInt * strike_damage_per_int) * (1 + fExtarPercent),
                damage_type: this.GetAbilityDamageType(),
            })
        }

        if (ExtraData && ExtraData.hashtable_index != null) {
            let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index || -1)
            if (tHashtable != null) {
                if (GameFunc.IsValid(tHashtable.hModifier)) {
                    tHashtable.hModifier.Destroy()
                }
            }
        }

        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_queenofpain_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_queenofpain_1 extends BaseModifier_Plus {
    scepter_chance: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: ModifierTable) {
        this.scepter_chance = this.GetSpecialValueFor("scepter_chance")
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }

        let hParent = this.GetParentPlus()
        if (params.attacker == hParent && !hParent.PassivesDisabled() && !hParent.IsIllusion() && hParent.HasScepter()) {
            if (GameFunc.mathUtil.PRD(this.scepter_chance, hParent, "queenofpain_1")) {
                (this.GetAbilityPlus() as ability1_queenofpain_shadow_strike).ShadowStrike(params.target as BaseNpc_Plus)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_queenofpain_1_debuff extends BaseModifier_Plus {
    movement_slow: number;
    stack_percent: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let sParticlePath = "particles/units/heroes/hero_queenofpain/queen_shadow_strike_debuff_creep.vpcf"
        if (hParent.IsConsideredHero()) {
            sParticlePath = "particles/units/heroes/hero_queenofpain/queen_shadow_strike_debuff.vpcf"
        }
        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: sParticlePath,
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: sParticlePath,
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.movement_slow = this.GetSpecialValueFor("movement_slow")
        this.stack_percent = hCaster.GetTalentValue("special_bonus_unique_queenofpain_custom_3")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return this.movement_slow * (1 + this.GetStackCount() * this.stack_percent * 0.01) * (math.ceil(this.GetRemainingTime()) / this.GetDuration()) * this.GetParentPlus().GetStatusResistanceFactor(this.GetCasterPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.stack_percent * this.GetStackCount()
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_queenofpain_1_particle_projectile extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let hCaster = this.GetParentPlus()
            let hParent = this.GetCasterPlus()
            let projectile_speed = this.GetSpecialValueFor("projectile_speed")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_queenofpain/queen_shadow_strike.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(projectile_speed, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_queenofpain_1_particle_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetParentPlus()
        let hParent = this.GetCasterPlus()
        if (IsClient()) {
            let projectile_speed = this.GetSpecialValueFor("projectile_speed")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_queenofpain/queen_shadow_strike_body.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 3, Vector(projectile_speed, 0, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
