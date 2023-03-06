
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_bristleback_viscous_nasal_goo extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public goo_speed: number;
    public goo_duration: number;
    public base_armor: any;
    public armor_per_stack: number;
    public base_move_slow: any;
    public move_slow_per_stack: number;
    public goo_duration_creep: number;
    public radius_scepter: number;
    public disgust_knockback: any;
    public disgust_knockup: any;
    public base_disgust_duration: number;
    public disgust_duration_per_stack: number;
    public disgust_radius: number;
    public target: IBaseNpc_Plus;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_bristleback_viscous_nasal_goo_autocaster";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        } else {
            return super.GetBehavior();
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("radius_scepter") - this.GetCasterPlus().GetCastRangeBonus();
        } else {
            return super.GetCastRange(location, target);
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.goo_speed = this.GetSpecialValueFor("goo_speed");
        this.goo_duration = this.GetSpecialValueFor("goo_duration");
        this.base_armor = this.GetSpecialValueFor("base_armor");
        this.armor_per_stack = this.GetSpecialValueFor("armor_per_stack");
        this.base_move_slow = this.GetSpecialValueFor("base_move_slow");
        this.move_slow_per_stack = this.GetSpecialValueFor("move_slow_per_stack");
        this.goo_duration_creep = this.GetSpecialValueFor("goo_duration_creep");
        this.radius_scepter = this.GetSpecialValueFor("radius_scepter");
        this.disgust_knockback = this.GetSpecialValueFor("disgust_knockback");
        this.disgust_knockup = this.GetSpecialValueFor("disgust_knockup");
        this.base_disgust_duration = this.GetSpecialValueFor("base_disgust_duration");
        this.disgust_duration_per_stack = this.GetSpecialValueFor("disgust_duration_per_stack");
        this.disgust_radius = this.GetSpecialValueFor("disgust_radius");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("Hero_Bristleback.ViscousGoo.Cast");
        if (this.caster.HasScepter()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius_scepter, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let projectile = {
                    Target: enemy,
                    Source: this.caster,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo.vpcf",
                    iMoveSpeed: this.goo_speed,
                    vSourceLoc: this.caster.GetAbsOrigin(),
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10,
                    bProvidesVision: false,
                    iVisionRadius: 0,
                    iVisionTeamNumber: this.caster.GetTeamNumber()
                }
                ProjectileManager.CreateTrackingProjectile(projectile);
            }
        } else {
            this.target = this.GetCursorTarget();
            let projectile = {
                Target: this.target,
                Source: this.caster,
                Ability: this,
                EffectName: "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo.vpcf",
                iMoveSpeed: this.goo_speed,
                vSourceLoc: this.caster.GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: true,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 10,
                bProvidesVision: false,
                iVisionRadius: 0,
                iVisionTeamNumber: this.caster.GetTeamNumber()
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
        }
        if (this.caster.GetName() == "npc_dota_hero_bristleback" && RollPercentage(40)) {
            this.caster.EmitSound("bristleback_bristle_nasal_goo_0" + math.random(1, 7));
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (hTarget != undefined && hTarget.IsAlive() && !hTarget.IsMagicImmune()) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return;
            }
            let goo_modifier = hTarget.AddNewModifier(this.caster, this, "modifier_imba_bristleback_viscous_nasal_goo", {
                duration: this.goo_duration * (1 - hTarget.GetStatusResistance())
            });
            hTarget.EmitSound("Hero_Bristleback.ViscousGoo.Target");
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), hTarget.GetAbsOrigin(), undefined, this.disgust_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != hTarget) {
                    let knockback = {
                        should_stun: 0,
                        knockback_distance: this.disgust_knockback * goo_modifier.GetStackCount(),
                        knockback_height: this.disgust_knockup * goo_modifier.GetStackCount(),
                        center_x: hTarget.GetAbsOrigin().x,
                        center_y: hTarget.GetAbsOrigin().y,
                        center_z: hTarget.GetAbsOrigin().z,
                        knockback_duration: this.base_disgust_duration + (this.disgust_duration_per_stack * goo_modifier.GetStackCount())
                    }
                    enemy.AddNewModifier(this.caster, this, "modifier_knockback", knockback).SetDuration(this.base_disgust_duration + (this.disgust_duration_per_stack * goo_modifier.GetStackCount()), true);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_bristleback_viscous_nasal_goo extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public goo_speed: number;
    public goo_duration: number;
    public base_armor: any;
    public armor_per_stack: number;
    public base_move_slow: any;
    public move_slow_per_stack: number;
    public stack_limit: number;
    public goo_duration_creep: number;
    public radius_scepter: number;
    public particle: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_goo.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.goo_speed = this.ability.GetSpecialValueFor("goo_speed");
        this.goo_duration = this.ability.GetSpecialValueFor("goo_duration");
        this.base_armor = this.ability.GetSpecialValueFor("base_armor");
        this.armor_per_stack = this.ability.GetSpecialValueFor("armor_per_stack");
        this.base_move_slow = this.ability.GetSpecialValueFor("base_move_slow");
        this.move_slow_per_stack = this.ability.GetSpecialValueFor("move_slow_per_stack");
        this.stack_limit = this.ability.GetSpecialValueFor("stack_limit") + this.caster.GetTalentValue("special_bonus_unique_bristleback");
        this.goo_duration_creep = this.ability.GetSpecialValueFor("goo_duration_creep");
        this.radius_scepter = this.ability.GetSpecialValueFor("radius_scepter");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(1);
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_stack.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle, 1, Vector(0, this.GetStackCount(), 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() < this.stack_limit) {
            this.IncrementStackCount();
            ParticleManager.SetParticleControl(this.particle, 1, Vector(0, this.GetStackCount(), 0));
        }
        this.SetDuration(this.goo_duration * (1 - this.parent.GetStatusResistance()), true);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return ((this.base_move_slow + (this.move_slow_per_stack * this.GetStackCount())) * (-1));
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return ((this.base_armor + (this.armor_per_stack * this.GetStackCount())) * (-1));
    }
}
@registerModifier()
export class modifier_imba_bristleback_viscous_nasal_goo_autocaster extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }

    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(-1);
        this.StartIntervalThink(0.1);

    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.ability.GetAutoCastState() && this.ability.IsFullyCastable() && !this.ability.IsInAbilityPhase() && !this.caster.IsHexed() && !this.caster.IsNightmared() && !this.caster.IsOutOfGame() && !this.caster.IsSilenced() && !this.caster.IsStunned() && !this.caster.IsChanneling()) {
            if (this.caster.HasScepter()) {
                if (this.caster.GetPlayerID) {
                    this.caster.CastAbilityNoTarget(this.ability, this.caster.GetPlayerID());
                } else if (this.caster.GetPlayerOwner && this.caster.GetPlayerOwner().GetPlayerID) {
                    this.caster.CastAbilityNoTarget(this.ability, this.caster.GetPlayerOwner().GetPlayerID());
                }
            } else {
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.ability.GetCastRange(this.caster.GetAbsOrigin(), this.caster) + this.caster.GetCastRangeBonus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(enemies) > 0) {
                    if (this.caster.GetPlayerID) {
                        this.caster.CastAbilityOnTarget(enemies[0], this.ability, this.caster.GetPlayerID());
                    } else if (this.caster.GetPlayerOwner && this.caster.GetPlayerOwner().GetPlayerID) {
                        this.caster.CastAbilityOnTarget(enemies[0], this.ability, this.caster.GetPlayerOwner().GetPlayerID());
                    }
                    this.AddTimer(this.ability.GetBackswingTime(), () => {
                        if (!this.ability.IsNull() && this.ability.GetCooldownTimeRemaining() > this.ability.GetBackswingTime()) {
                            this.caster.MoveToPositionAggressive(this.caster.GetAbsOrigin());
                        }
                    });
                }
            }
        }
    }
}
@registerAbility()
export class imba_bristleback_quill_spray extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public radius: number;
    public projectile_speed: number;
    public duration: number;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_bristleback_quill_spray_autocaster";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.radius = this.GetSpecialValueFor("radius");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        this.duration = this.radius / this.projectile_speed;
        if (!IsServer()) {
            return;
        }
        CreateModifierThinker(this.caster, this, "modifier_imba_bristleback_quillspray_thinker", {
            duration: this.duration
        }, this.caster.GetAbsOrigin(), this.caster.GetTeamNumber(), false);
        this.caster.EmitSound("Hero_Bristleback.QuillSpray.Cast");
    }
}
@registerModifier()
export class modifier_imba_bristleback_quillspray_thinker extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public radius: number;
    public quill_base_damage: number;
    public quill_stack_damage: number;
    public quill_stack_duration: number;
    public max_damage: number;
    public particle: any;
    public hit_enemies: any;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.quill_base_damage = this.ability.GetSpecialValueFor("quill_base_damage");
        this.quill_stack_damage = this.ability.GetSpecialValueFor("quill_stack_damage") + this.caster.GetTalentValue("special_bonus_unique_bristleback_2");
        this.quill_stack_duration = this.ability.GetSpecialValueFor("quill_stack_duration");
        this.max_damage = this.ability.GetSpecialValueFor("max_damage");
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_quill_spray.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
        ParticleManager.SetParticleControl(this.particle, 60, Vector(RandomInt(0, 255), RandomInt(0, 255), RandomInt(0, 255)));
        ParticleManager.SetParticleControl(this.particle, 61, Vector(1, 0, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.hit_enemies = {}
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let radius_pct = math.min((this.GetDuration() - this.GetRemainingTime()) / this.GetDuration(), 1);
        let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius * radius_pct, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let hit_already = false;
            for (const [_, hit_enemy] of GameFunc.iPair(this.hit_enemies)) {
                if (hit_enemy == enemy) {
                    hit_already = true;
                    return;
                }
            }
            if (!hit_already) {
                let quill_spray_stacks = 0;
                let quill_spray_modifier = enemy.findBuff<modifier_imba_bristleback_quill_spray>("modifier_imba_bristleback_quill_spray");
                if (quill_spray_modifier) {
                    quill_spray_stacks = quill_spray_modifier.GetStackCount();
                }
                let damageTable = {
                    victim: enemy,
                    damage: math.min(this.quill_base_damage + (this.quill_stack_damage * quill_spray_stacks), this.max_damage),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.caster,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_quill_spray_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                ParticleManager.SetParticleControl(particle, 1, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle);
                enemy.EmitSound("Hero_Bristleback.QuillSpray.Target");
                enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_bristleback_quill_spray", {
                    duration: this.quill_stack_duration * (1 - enemy.GetStatusResistance())
                });
                table.insert(this.hit_enemies, enemy);
                if (!enemy.IsAlive() && enemy.IsRealHero() && (enemy.IsReincarnating && !enemy.IsReincarnating())) {
                    this.caster.EmitSound("bristleback_bristle_quill_spray_0" + math.random(1, 6));
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.RemoveSelf();
    }
}
@registerModifier()
export class modifier_imba_bristleback_quill_spray extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public radius: number;
    public quill_base_damage: number;
    public quill_stack_damage: number;
    public quill_stack_duration: number;
    public max_damage: number;
    public projectile_speed: number;
    public particle: any;
    IsPurgable(): boolean {
        return false;
    }
    Init(p_0: IModifierTable): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.quill_base_damage = this.ability.GetSpecialValueFor("quill_base_damage");
        this.quill_stack_damage = this.ability.GetSpecialValueFor("quill_stack_damage");
        this.quill_stack_duration = this.ability.GetSpecialValueFor("quill_stack_duration");
        this.max_damage = this.ability.GetSpecialValueFor("max_damage");
        this.projectile_speed = this.ability.GetSpecialValueFor("projectile_speed");
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_quill_spray_hit_creep.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.AddTimer(this.quill_stack_duration * (1 - this.parent.GetStatusResistance()), () => {
            if (this != undefined && !this.IsNull() && !this.ability.IsNull() && !this.parent.IsNull() && !this.caster.IsNull()) {
                this.DecrementStackCount();
            }
        });
        if (p_0.IsOnRefresh) {
            this.SetDuration(this.quill_stack_duration * (1 - this.parent.GetStatusResistance()), true);
        }
    }

}
@registerModifier()
export class modifier_imba_bristleback_quill_spray_stack extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_bristleback_quill_spray_autocaster extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public cardio_threshold: any;
    public last_position: any;
    public distance: number;
    IsHidden(): boolean {
        return true;
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.cardio_threshold = this.ability.GetSpecialValueFor("cardio_threshold");
        this.last_position = this.caster.GetAbsOrigin();
        this.distance = this.distance || 0;
        this.StartIntervalThink(-1);
        this.StartIntervalThink(0.1);
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.ability.GetAutoCastState() && this.ability.IsFullyCastable() && !this.caster.IsHexed() && !this.caster.IsNightmared() && !this.caster.IsOutOfGame() && !this.caster.IsSilenced() && !this.caster.IsStunned() && !this.caster.IsChanneling()) {
            if (this.caster.GetPlayerID) {
                this.caster.CastAbilityImmediately(this.ability, this.caster.GetPlayerID());
            } else if (this.caster.GetPlayerOwner && this.caster.GetPlayerOwner().GetPlayerID) {
                this.caster.CastAbilityImmediately(this.ability, this.caster.GetPlayerOwner().GetPlayerID());
            }
        }
        if (this.ability.GetAutoCastState() && !this.caster.IsOutOfGame() && !this.caster.IsInvulnerable()) {
            this.distance = this.distance + GFuncVector.AsVector(this.caster.GetAbsOrigin() - this.last_position).Length();
            if (this.distance >= this.cardio_threshold && !this.parent.IsIllusion() && !this.parent.PassivesDisabled()) {
                this.ability.OnSpellStart();
                this.distance = 0;
            }
        }
        this.last_position = this.caster.GetAbsOrigin();
    }
}
@registerAbility()
export class imba_bristleback_bristleback extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    IsStealable(): boolean {
        return false;
    }
    ResetToggleOnRespawn(): boolean {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_bristleback_bristleback";
    }
    OnToggle(): void {
        this.caster = this.GetCasterPlus();
        if (this.GetToggleState()) {
            this.caster.AddNewModifier(this.caster, this, "modifier_imba_bristleback_bristleback_has", {});
        } else {
            this.caster.RemoveModifierByName("modifier_imba_bristleback_bristleback_has");
        }
    }
}
@registerModifier()
export class modifier_imba_bristleback_bristleback extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public front_damage_reduction: number;
    public side_damage_reduction: number;
    public back_damage_reduction: number;
    public side_angle: any;
    public back_angle: any;
    public quill_release_threshold: any;
    public cumulative_damage: number;
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.front_damage_reduction = 0;
        this.side_damage_reduction = this.ability.GetSpecialValueFor("side_damage_reduction");
        this.back_damage_reduction = this.ability.GetSpecialValueFor("back_damage_reduction");
        this.side_angle = this.ability.GetSpecialValueFor("side_angle");
        this.back_angle = this.ability.GetSpecialValueFor("back_angle");
        this.quill_release_threshold = this.ability.GetSpecialValueFor("quill_release_threshold");
        this.cumulative_damage = this.cumulative_damage || 0;
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (this.parent.PassivesDisabled() || bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION || bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            return 0;
        }
        let forwardVector = this.caster.GetForwardVector();
        let forwardAngle = math.deg(math.atan2(forwardVector.x, forwardVector.y));
        let reverseEnemyVector = (this.caster.GetAbsOrigin() - keys.attacker.GetAbsOrigin() as Vector).Normalized();
        let reverseEnemyAngle = math.deg(math.atan2(reverseEnemyVector.x, reverseEnemyVector.y));
        let difference = math.abs(forwardAngle - reverseEnemyAngle);
        if (this.caster.HasModifier("modifier_imba_bristleback_bristleback_has")) {
            this.front_damage_reduction = this.ability.GetSpecialValueFor("HAS_damage_reduction_inc");
            this.side_damage_reduction = this.ability.GetSpecialValueFor("side_damage_reduction") + this.ability.GetSpecialValueFor("HAS_damage_reduction_inc");
            this.back_damage_reduction = this.ability.GetSpecialValueFor("back_damage_reduction") + this.ability.GetSpecialValueFor("HAS_damage_reduction_inc");
            this.quill_release_threshold = this.ability.GetSpecialValueFor("HAS_quill_release_threshold");
        } else {
            this.front_damage_reduction = 0;
            this.side_damage_reduction = this.ability.GetSpecialValueFor("side_damage_reduction");
            this.back_damage_reduction = this.ability.GetSpecialValueFor("back_damage_reduction");
            this.quill_release_threshold = this.ability.GetSpecialValueFor("quill_release_threshold");
        }
        if ((difference <= (this.back_angle / 2)) || (difference >= (360 - (this.back_angle / 2)))) {
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_back_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(particle, 1, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(particle, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle);
            let particle2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_back_lrg_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(particle2, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle2);
            this.parent.EmitSound("Hero_Bristleback.Bristleback");
            return this.back_damage_reduction * (-1);
        } else if ((difference <= (this.side_angle / 2)) || (difference >= (360 - (this.side_angle / 2)))) {
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_back_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(particle, 1, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(particle, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle);
            return this.side_damage_reduction * (-1);
        } else {
            return this.front_damage_reduction * (-1);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.parent) {
            if (this.parent.PassivesDisabled() || bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION || bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS || !this.parent.HasAbility("imba_bristleback_quill_spray") || !this.parent.findAbliityPlus<imba_bristleback_quill_spray>("imba_bristleback_quill_spray").IsTrained()) {
                return;
            }
            let forwardVector = this.caster.GetForwardVector();
            let forwardAngle = math.deg(math.atan2(forwardVector.x, forwardVector.y));
            let reverseEnemyVector = (this.caster.GetAbsOrigin() - keys.attacker.GetAbsOrigin() as Vector).Normalized();
            let reverseEnemyAngle = math.deg(math.atan2(reverseEnemyVector.x, reverseEnemyVector.y));
            let difference = math.abs(forwardAngle - reverseEnemyAngle);
            if ((difference <= (this.back_angle / 2)) || (difference >= (360 - (this.back_angle / 2)))) {
                this.SetStackCount(this.GetStackCount() + keys.damage);
                let quill_spray_ability = this.parent.findAbliityPlus<imba_bristleback_quill_spray>("imba_bristleback_quill_spray");
                if (quill_spray_ability && quill_spray_ability.IsTrained() && this.GetStackCount() >= this.quill_release_threshold) {
                    quill_spray_ability.OnSpellStart();
                    this.SetStackCount(this.GetStackCount() - this.quill_release_threshold);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_bristleback_bristleback_has extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public particle: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.parent = this.GetParentPlus();
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/econ/items/pangolier/pangolier_ti8_immortal/pangolier_ti8_immortal_shield_buff.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle, 3, Vector(50, 0, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.parent.EmitSound("Imba.BristlebackHASStart");
    }
    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
}
@registerAbility()
export class imba_bristleback_warpath extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_bristleback_warpath";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bristleback_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_bristleback_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_bristleback_3"), "modifier_special_bonus_imba_bristleback_3", {});
        }
    }
}
@registerModifier()
export class modifier_imba_bristleback_warpath extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public damage_per_stack: number;
    public move_speed_per_stack: number;
    public stack_duration: number;
    public max_stacks: number;
    public counter: number;
    public particle_table: any;
    IsHidden(): boolean {
        if (this.GetStackCount() >= 1) {
            return false;
        } else {
            return true;
        }
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    GetEffectName(): string {
        if (this.GetStackCount() >= 1) {
            return "particles/units/heroes/hero_bristleback/bristleback_warpath_dust.vpcf";
        }
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.damage_per_stack = this.ability.GetSpecialValueFor("damage_per_stack") + this.caster.GetTalentValue("special_bonus_imba_bristleback_3");
        this.move_speed_per_stack = this.ability.GetSpecialValueFor("move_speed_per_stack");
        this.stack_duration = this.ability.GetSpecialValueFor("stack_duration");
        this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
        this.counter = this.counter || 0;
        this.particle_table = this.particle_table || {}
        if (!IsServer()) {
            return;
        }
        if (this.parent.IsIllusion()) {
            let owners = Entities.FindAllByNameWithin("npc_dota_hero_bristleback", this.parent.GetAbsOrigin(), 100) as IBaseNpc_Plus[];
            for (const [_, owner] of GameFunc.iPair(owners)) {
                if (!owner.IsIllusion() && owner.HasModifier("modifier_imba_bristleback_warpath") && owner.GetTeam() == this.parent.GetTeam()) {
                    this.SetStackCount(owner.findBuff<modifier_imba_bristleback_warpath>("modifier_imba_bristleback_warpath").GetStackCount());
                    this.SetDuration(this.stack_duration, true);
                    this.AddTimer(this.stack_duration, () => {
                        if (this != undefined && !this.IsNull() && !this.ability.IsNull() && !this.parent.IsNull() && !this.caster.IsNull() && this.GetStackCount() > 0) {
                            this.SetStackCount(0);
                        }
                    });
                    return;
                }
            }
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
            5: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** keys */): number {
        if (!this.parent.IsIllusion()) {
            this.damage_per_stack = this.ability.GetSpecialValueFor("damage_per_stack") + this.caster.GetTalentValue("special_bonus_imba_bristleback_3");
            return this.damage_per_stack * this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage( /** keys */): number {
        return this.move_speed_per_stack * this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.ability && keys.unit == this.parent && !this.parent.PassivesDisabled() && !keys.ability.IsItem() && keys.ability.GetName() != "ability_capture") {
            this.counter = this.counter + 1;
            this.SetStackCount(math.min(this.counter, this.max_stacks));
            if (this.GetStackCount() < this.max_stacks) {
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bristleback/bristleback_warpath.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControlEnt(particle, 3, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 4, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
                table.insert(this.particle_table, particle);
            }
            this.SetDuration(this.stack_duration, true);
            this.AddTimer(this.stack_duration, () => {
                if (this != undefined && !this.IsNull() && !this.ability.IsNull() && !this.parent.IsNull() && !this.caster.IsNull() && this.GetStackCount() > 0) {
                    this.counter = this.counter - 1;
                    this.SetStackCount(math.min(this.counter, this.max_stacks));
                    if (GameFunc.GetCount(this.particle_table) > 0) {
                        ParticleManager.DestroyParticle(this.particle_table[0], false);
                        ParticleManager.ReleaseParticleIndex(this.particle_table[0]);
                        table.remove(this.particle_table, 1);
                    }
                }
            });
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return this.GetStackCount() * 5;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (keys.target == this.caster && keys.attacker != this.caster) {
            keys.attacker.AddNewModifier(this.caster, this.ability, "modifier_imba_bristleback_warpath_revenge", {});
        }
    }
}
@registerModifier()
export class modifier_imba_bristleback_warpath_stack extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_bristleback_warpath_revenge extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public revenge_inc_dmg_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.revenge_inc_dmg_pct = this.ability.GetSpecialValueFor("revenge_inc_dmg_pct");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.revenge_inc_dmg_pct);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetStackCount() + this.revenge_inc_dmg_pct);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_DEATH,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (keys.target == this.parent) {
            if (keys.attacker == this.caster) {
                return this.GetStackCount();
            } else {
                return 0;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.parent && keys.attacker == this.caster) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_bristleback_3 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
