import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_dragon_knight_6_form } from "./ability6_dragon_knight_elder_dragon_form";

/** dota原技能数据 */
export const Data_dragon_knight_dragon_tail = { "ID": "5227", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_DragonKnight.DragonTail.Target", "AbilityCastRange": "150", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "16 14 12 10", "AbilityDamage": "70 100 130 160", "AbilityManaCost": "70 80 90 100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "stun_duration": "2.5 2.75 3.0 3.25", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight_2" }, "02": { "var_type": "FIELD_INTEGER", "dragon_cast_range": "400" }, "03": { "var_type": "FIELD_INTEGER", "projectile_speed": "1600" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_dragon_knight_dragon_tail extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dragon_knight_dragon_tail";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dragon_knight_dragon_tail = Data_dragon_knight_dragon_tail;
    Init() {
        this.SetDefaultSpecialValue("shard_health_damage_pct", 200);
        this.SetDefaultSpecialValue("health_damage", [12, 18, 24, 30, 38, 48]);
        this.SetDefaultSpecialValue("stun_duration", [2, 2.25, 2.5, 2.75, 3, 3.25]);
        this.SetDefaultSpecialValue("dragon_cast_range", 1050);
        this.SetDefaultSpecialValue("projectile_speed", 1600);
        this.SetDefaultSpecialValue("poison_damage", 4);
        this.SetDefaultSpecialValue("extra_targets", 2);
        this.SetDefaultSpecialValue("extra_stun_duration", 1);
        this.SetDefaultSpecialValue("health_percent", 10);
        this.SetDefaultSpecialValue("health_duration", 7);

    }



    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (modifier_dragon_knight_6_form.exist(this.GetCasterPlus())) {
            return this.GetSpecialValueFor("dragon_cast_range")
        }
        return super.GetCastRange(vLocation, hTarget)
    }
    DragonTail(hTarget: IBaseNpc_Plus, iDragonLevel: number) {
        let hCaster = this.GetCasterPlus()
        if (!iDragonLevel) {
            let hModifier = modifier_dragon_knight_6_form.findIn(hCaster)
            if (GFuncEntity.IsValid(hModifier)) {
                iDragonLevel = hModifier.iLevel || 0
            }
        }

        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let health_damage = this.GetSpecialValueFor("health_damage")
        let poison_damage = this.GetSpecialValueFor("poison_damage")
        let extra_stun_duration = this.GetSpecialValueFor("extra_stun_duration")
        let health_duration = this.GetSpecialValueFor("health_duration")
        let shard_health_damage_pct = this.GetSpecialValueFor("shard_health_damage_pct")
        if (hCaster.HasShard()) {
            health_damage = health_damage + shard_health_damage_pct
        }
        let fDamage = hCaster.GetMaxHealth() * health_damage * 0.01

        if (iDragonLevel >= 1) {
            modifier_poison.PoisonActive(hTarget, hCaster, this, poison_damage)
        }
        if (iDragonLevel >= 5) {
            stun_duration = stun_duration + extra_stun_duration
        }

        let tDamageTable =
        {
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType()
        }
        BattleHelper.GoApplyDamage(tDamageTable)

        modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DragonKnight.DragonTail.Cast", hCaster))

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_DragonKnight.DragonTail.Target", hCaster), hCaster)

        if (iDragonLevel >= 7) {
            modifier_dragon_knight_2_health.apply(hCaster, hCaster, this, { duration: health_duration })
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let projectile_speed = this.GetSpecialValueFor("projectile_speed")
        if (!GFuncEntity.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let iDragonLevel = 0
        let hModifier = modifier_dragon_knight_6_form.findIn(hCaster)
        if (GFuncEntity.IsValid(hModifier)) {
            iDragonLevel = hModifier.iLevel || iDragonLevel
        }

        if (modifier_dragon_knight_6_form.exist(hCaster)) {
            let tInfo =
            {
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail_dragonform_proj.vpcf", hCaster),
                iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack2"),
                iMoveSpeed: projectile_speed,
                Target: hTarget,
                Source: hCaster,
                ExtraData: {
                    dragon_level: iDragonLevel,
                }
            }
            ProjectileManager.CreateTrackingProjectile(tInfo)

            modifier_dragon_knight_2_particle_start_1.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DragonKnight.DragonTail.DragonFormCast", hCaster))

            if (iDragonLevel >= 3 && this.GetCursorTarget() == hTarget) {
                let extra_targets = this.GetSpecialValueFor("extra_targets")
                let range = this.GetCastRange(hCaster.GetAbsOrigin(), hTarget)

                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER)
                for (let hUnit of (tTargets)) {
                    if (hUnit != hTarget) {
                        tInfo.Target = hUnit
                        ProjectileManager.CreateTrackingProjectile(tInfo)

                        modifier_dragon_knight_2_particle_start_1.apply(hCaster, hUnit, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                        // if (n >= extra_targets) {
                        //     break
                        // }
                    }
                }
            }

        } else {
            if (!hTarget.TriggerSpellAbsorb(this)) {
                this.DragonTail(hTarget, iDragonLevel)
                modifier_dragon_knight_2_particle_start_2.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null && !hTarget.TriggerSpellAbsorb(this)) {
            this.DragonTail(hTarget, ExtraData.dragon_level)
        }

        return true
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_dragon_knight_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers

@registerModifier()
export class modifier_dragon_knight_2 extends BaseModifier_Plus {
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
            if (!GFuncEntity.IsValid(ability)) {
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
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
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
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_2_health extends BaseModifier_Plus {
    health_percent: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    BeCreated(params: IModifierTable) {

        this.health_percent = this.GetSpecialValueFor("health_percent")

        if (IsServer()) {
            this.IncrementStackCount()
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.DecrementStackCount()
            }))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    CC_GetModifierHealthPercentage() {
        return this.GetStackCount() * this.health_percent
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount() * this.health_percent
    }
}

// 特效
@registerModifier()
export class modifier_dragon_knight_2_particle_start_1 extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hTarget = this.GetCasterPlus()
            let hCaster = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail_dragonform.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 4, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}

// 特效
@registerModifier()
export class modifier_dragon_knight_2_particle_start_2 extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hTarget = this.GetCasterPlus()
            let hCaster = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail_knightform.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 4, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }

}
