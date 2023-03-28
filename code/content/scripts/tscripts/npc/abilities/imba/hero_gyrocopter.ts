
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_gyrocopter_rocket_barrage extends BaseAbility_Plus {
    public responses: string[];
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Gyrocopter.Rocket_Barrage");
        if (this.GetCasterPlus().GetUnitName().includes("gyrocopter") && RollPercentage(75)) {
            if (!this.responses) {
                this.responses = ["gyrocopter_gyro_rocket_barrage_01", "gyrocopter_gyro_rocket_barrage_02", "gyrocopter_gyro_rocket_barrage_04"];
            }
            EmitSoundOnClient(this.responses[RandomInt(0, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_rocket_barrage", {
            duration: this.GetDuration()
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target) {
            target.EmitSound("Hero_Gyrocopter.Rocket_Barrage.Impact");
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_rocket_barrage_ballistic_suppression", {
                duration: this.GetSpecialValueFor("ballistic_duration") * (1 - target.GetStatusResistance())
            });
            ApplyDamage({
                victim: target,
                damage: this.GetTalentSpecialValueFor("rocket_damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            return true;
        }
    }

    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_rocket_barrage extends BaseModifier_Plus {
    public radius: number;
    public rockets_per_second: any;
    public ballistic_duration: number;
    public sniping_speed: number;
    public sniping_distance: number;
    public rocket_damage: number;
    public damage_type: number;
    public weapons: any;
    public lock_on_enemy: any;
    public barrage_particle: any;
    public enemies: IBaseNpc_Plus[];
    Init(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        this.rockets_per_second = this.GetSpecialValueFor("rockets_per_second");
        this.ballistic_duration = this.GetSpecialValueFor("ballistic_duration");
        this.sniping_speed = this.GetSpecialValueFor("sniping_speed");
        this.sniping_distance = this.GetSpecialValueFor("sniping_distance");
        if (!IsServer()) {
            return;
        }
        this.rocket_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("rocket_damage");
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.weapons = {
            "1": "attach_attack1",
            "2": "attach_attack2"
        }
        this.StartIntervalThink(1 / this.rockets_per_second);
    }

    OnIntervalThink(): void {
        if (!this.GetParentPlus().IsOutOfGame()) {
            this.GetParentPlus().EmitSound("Hero_Gyrocopter.Rocket_Barrage.Launch");

            let ability = this.GetCasterPlus().findAbliityPlus<imba_gyrocopter_homing_missile>("imba_gyrocopter_homing_missile");
            if (ability && ability.lock_on_modifier && (ability.lock_on_modifier.GetParent().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.sniping_distance + this.GetCasterPlus().GetCastRangeBonus() &&
                !ability.lock_on_modifier.GetParent().IsMagicImmune() && !ability.lock_on_modifier.GetParent().IsOutOfGame()) {
                this.lock_on_enemy = ability.lock_on_modifier.GetParent();
                if ((this.lock_on_enemy.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.radius) {
                    this.lock_on_enemy.EmitSound("Hero_Gyrocopter.Rocket_Barrage.Impact");
                    this.barrage_particle = ResHelper.CreateParticleEx("particles/econ/items/gyrocopter/hero_gyrocopter_gyrotechnics/gyro_rocket_barrage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                    ParticleManager.SetParticleControlEnt(this.barrage_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.weapons[RandomInt(1, GameFunc.GetCount(this.weapons))], this.GetParentPlus().GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.barrage_particle, 1, this.lock_on_enemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.lock_on_enemy.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(this.barrage_particle);
                    this.lock_on_enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_rocket_barrage_ballistic_suppression", {
                        duration: this.ballistic_duration * (1 - this.lock_on_enemy.GetStatusResistance())
                    });
                    ApplyDamage({
                        victim: this.lock_on_enemy,
                        damage: this.rocket_damage,
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                } else {
                    ProjectileManager.CreateLinearProjectile({
                        EffectName: "particles/base_attacks/ranged_tower_bad_linear.vpcf",
                        Ability: this.GetAbilityPlus(),
                        Source: this.GetCasterPlus(),
                        vSpawnOrigin: this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_hitloc")),
                        vVelocity: (this.lock_on_enemy.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.sniping_speed * Vector(1, 1, 0) as Vector,
                        vAcceleration: undefined,
                        fMaxSpeed: undefined,
                        fDistance: this.sniping_distance + this.GetCasterPlus().GetCastRangeBonus(),
                        fStartRadius: 25,
                        fEndRadius: 25,
                        fExpireTime: undefined,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        bIgnoreSource: true,
                        bHasFrontalCone: false,
                        bDrawsOnMinimap: false,
                        bVisibleToEnemies: true,
                        bProvidesVision: false,
                        iVisionRadius: undefined,
                        iVisionTeamNumber: undefined,
                        ExtraData: {}
                    });
                }
            } else {
                this.enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
                if (GameFunc.GetCount(this.enemies) >= 1) {
                    for (const [_, enemy] of GameFunc.iPair(this.enemies)) {
                        enemy.EmitSound("Hero_Gyrocopter.Rocket_Barrage.Impact");
                        this.barrage_particle = ResHelper.CreateParticleEx("particles/econ/items/gyrocopter/hero_gyrocopter_gyrotechnics/gyro_rocket_barrage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                        ParticleManager.SetParticleControlEnt(this.barrage_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.weapons[RandomInt(1, GameFunc.GetCount(this.weapons))], this.GetParentPlus().GetAbsOrigin(), true);
                        ParticleManager.SetParticleControlEnt(this.barrage_particle, 1, enemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(this.barrage_particle);
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_rocket_barrage_ballistic_suppression", {
                            duration: this.ballistic_duration * (1 - enemy.GetStatusResistance())
                        });
                        ApplyDamage({
                            victim: enemy,
                            damage: this.rocket_damage,
                            damage_type: this.damage_type,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                            attacker: this.GetCasterPlus(),
                            ability: this.GetAbilityPlus()
                        });
                        return;
                    }
                } else {
                    ProjectileManager.CreateLinearProjectile({
                        EffectName: "particles/base_attacks/ranged_tower_bad_linear.vpcf",
                        Ability: this.GetAbilityPlus(),
                        Source: this.GetCasterPlus(),
                        vSpawnOrigin: this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_hitloc")),
                        vVelocity: this.GetParentPlus().GetForwardVector() * this.sniping_speed * Vector(1, 1, 0) as Vector,
                        vAcceleration: undefined,
                        fMaxSpeed: undefined,
                        fDistance: this.sniping_distance + this.GetCasterPlus().GetCastRangeBonus(),
                        fStartRadius: 25,
                        fEndRadius: 25,
                        fExpireTime: undefined,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        bIgnoreSource: true,
                        bHasFrontalCone: false,
                        bDrawsOnMinimap: false,
                        bVisibleToEnemies: true,
                        bProvidesVision: false,
                        iVisionRadius: undefined,
                        iVisionTeamNumber: undefined,
                        ExtraData: {}
                    });
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1;
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_rocket_barrage_ballistic_suppression extends BaseModifier_Plus {
    public ballistic_spell_amp_reduction: any;
    Init(p_0: any,): void {
        this.ballistic_spell_amp_reduction = this.GetSpecialValueFor("ballistic_spell_amp_reduction") * (-1);
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.ballistic_spell_amp_reduction * this.GetStackCount();
    }
}
@registerAbility()
export class imba_gyrocopter_homing_missile extends BaseAbility_Plus {
    public responses: any;
    public lock_on_modifier: modifier_imba_gyrocopter_lock_on;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_gyrocopter_homing_missile_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_gyrocopter_homing_missile_handler", this.GetCasterPlus()) == 0) {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_gyrocopter_homing_missile_handler", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target);
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        if (target) {
            if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
        }
        if (this.GetCasterPlus().GetUnitName().includes("gyrocopter")) {
            if (!this.responses) {
                this.responses = {
                    "1": "gyrocopter_gyro_homing_missile_fire_02",
                    "2": "gyrocopter_gyro_homing_missile_fire_03",
                    "3": "gyrocopter_gyro_homing_missile_fire_04",
                    "4": "gyrocopter_gyro_homing_missile_fire_06",
                    "5": "gyrocopter_gyro_homing_missile_fire_07"
                }
            }
            EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
        }
        let missile_starting_position = undefined as Vector;
        let pre_flight_time = this.GetSpecialValueFor("pre_flight_time");
        if (!this.GetAutoCastState()) {
            missile_starting_position = this.GetCasterPlus().GetAbsOrigin() + ((this.GetCursorTarget().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * 150) as Vector;
            if (this.lock_on_modifier && this.lock_on_modifier.GetParent() == this.GetCursorTarget()) {
                pre_flight_time = 0;
            }
        } else {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized());
            }
            missile_starting_position = this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 150) as Vector;
        }
        let missile = this.GetCasterPlus().CreateSummon("npc_imba_gyrocopter_homing_missile", missile_starting_position, -1, true);
        missile.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_homing_missile_pre_flight", {
            duration: pre_flight_time,
            bAutoCast: this.GetAutoCastState()
        });
        missile.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_homing_missile", {
            bAutoCast: this.GetAutoCastState()
        });
        if (!this.GetAutoCastState()) {
            missile.SetForwardVector((this.GetCursorTarget().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized());
        } else {
            missile.SetForwardVector((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized());
            // missile.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
        }
        let fuse_particle = ResHelper.CreateParticleEx("particles/econ/items/gyrocopter/hero_gyrocopter_gyrotechnics/gyro_homing_missile_fuse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, missile);
        ParticleManager.SetParticleControlForward(fuse_particle, 0, missile.GetForwardVector() * (-1) as Vector);
        ParticleManager.ReleaseParticleIndex(fuse_particle);
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_gyrocopter_homing_missile_charges") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_gyrocopter_homing_missile_charges")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_gyrocopter_homing_missile_charges"), "modifier_special_bonus_imba_gyrocopter_homing_missile_charges", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_homing_missile_handler extends BaseModifier_Plus {
    public bAttackingLockOn: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().GetAttackTarget() && this.GetParentPlus().GetAttackTarget().FindModifierByNameAndCaster("modifier_imba_gyrocopter_lock_on", this.GetCasterPlus())) {
            this.bAttackingLockOn = true;
        } else {
            this.bAttackingLockOn = false;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus()) {
            return;
        }
        if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO && keys.ability == this.GetAbilityPlus()) {
            if (this.GetAbilityPlus().GetAutoCastState()) {
                this.SetStackCount(0);
            } else {
                this.SetStackCount(1);
            }
        }
        if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET && keys.target && keys.target.FindModifierByNameAndCaster("modifier_imba_gyrocopter_lock_on", this.GetCasterPlus())) {
            this.bAttackingLockOn = true;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.bAttackingLockOn) {
            return this.GetSpecialValueFor("lock_on_attack_range_bonus");
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_homing_missile_pre_flight extends BaseModifier_Plus {
    public speed: number;
    public interval: number;
    public bAutoCast: any;
    public target: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        this.speed = this.GetSpecialValueFor("speed");
        this.interval = 1 / this.GetSpecialValueFor("acceleration");
        if (!IsServer()) {
            return;
        }
        this.bAutoCast = keys.bAutoCast;
        this.GetParentPlus().EmitSound("Hero_Gyrocopter.HomingMissile.Enemy");
        if (keys.bAutoCast == 0) {
            this.target = this.GetAbilityPlus().GetCursorTarget();
        } else {
            this.target = undefined;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsAlive()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Gyrocopter.HomingMissile.Enemy");
        if (this.GetParentPlus().HasModifier("modifier_imba_gyrocopter_homing_missile")) {
            // this.GetParentPlus().SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
            if (this.target && !this.target.IsNull() && this.target.IsAlive()) {
                this.GetParentPlus().MoveToNPC(this.target);
            } else if (this.bAutoCast == 0) {
                let explosion_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_guided_missile_death.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
                ParticleManager.SetParticleControl(explosion_particle, 0, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(explosion_particle);
                this.GetParentPlus().EmitSound("Hero_Gyrocopter.HomingMissile.Destroy");
                this.GetParentPlus().ForceKill(false);
                this.GetParentPlus().AddNoDraw();
                return;
            }
            this.GetParentPlus().findBuff<modifier_imba_gyrocopter_homing_missile>("modifier_imba_gyrocopter_homing_missile").StartIntervalThink(this.interval);
            let missile_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_guided_missile.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(missile_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_fuse", this.GetParentPlus().GetAbsOrigin(), true);
            this.GetParentPlus().findBuff<modifier_imba_gyrocopter_homing_missile>("modifier_imba_gyrocopter_homing_missile").AddParticle(missile_particle, false, false, -1, false, false);
        } else {
            this.GetParentPlus().ForceKill(false);
            this.GetParentPlus().AddNoDraw();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (this.target && keys.unit == this.target) {
            let nearby_targets = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.target.GetAbsOrigin(), undefined, 700, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
            if (GameFunc.GetCount(nearby_targets) >= 1) {
                this.target = nearby_targets[0];
                let buff = this.GetParentPlus().findBuff<modifier_imba_gyrocopter_homing_missile>("modifier_imba_gyrocopter_homing_missile");
                buff.target = nearby_targets[0];
                ParticleManager.ClearParticle(buff.target_particle, false);
                buff.target_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_gyrocopter/gyro_guided_missile_target.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.target, this.GetCasterPlus().GetTeamNumber());
                buff.AddParticle(buff.target_particle, false, false, -1, false, false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_homing_missile extends BaseModifier_Plus {
    public hits_to_kill_tooltip: any;
    public tower_hits_to_kill_tooltip: any;
    public attack_speed_bonus_pct: number;
    public min_damage: number;
    public max_distance: number;
    public pre_flight_time: number;
    public hero_damage: number;
    public speed: number;
    public acceleration: any;
    public enemy_vision_time: number;
    public propulsion_speed_pct: number;
    public propulsion_duration_pct: number;
    public lock_on_duration: number;
    public lock_on_attack_range_bonus: number;
    public rc_turn_speed_degrees: number;
    public stun_duration: number;
    public damage: number;
    public damage_type: number;
    public bAutoCast: any;
    public target: IBaseNpc_Plus;
    public interval: number;
    public speed_counter: number;
    public target_particle: any;
    public rocket_orders: any;
    public differential: any;
    public turn_counter: number;
    public angle: any;
    public responses: any;
    public selected_pos: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        this.hits_to_kill_tooltip = this.GetSpecialValueFor("hits_to_kill_tooltip");
        this.tower_hits_to_kill_tooltip = this.GetSpecialValueFor("tower_hits_to_kill_tooltip");
        this.attack_speed_bonus_pct = this.GetSpecialValueFor("attack_speed_bonus_pct");
        this.min_damage = this.GetSpecialValueFor("min_damage");
        this.max_distance = this.GetSpecialValueFor("max_distance");
        this.pre_flight_time = this.GetSpecialValueFor("pre_flight_time");
        this.hero_damage = this.GetSpecialValueFor("hero_damage");
        this.speed = this.GetSpecialValueFor("speed");
        this.acceleration = this.GetSpecialValueFor("acceleration");
        this.enemy_vision_time = this.GetSpecialValueFor("enemy_vision_time");
        this.propulsion_speed_pct = this.GetSpecialValueFor("propulsion_speed_pct");
        this.propulsion_duration_pct = this.GetSpecialValueFor("propulsion_duration_pct");
        this.lock_on_duration = this.GetSpecialValueFor("lock_on_duration");
        this.lock_on_attack_range_bonus = this.GetSpecialValueFor("lock_on_attack_range_bonus");
        this.rc_turn_speed_degrees = this.GetSpecialValueFor("rc_turn_speed_degrees");
        if (!IsServer()) {
            return;
        }
        this.stun_duration = this.GetAbilityPlus().GetTalentSpecialValueFor("stun_duration");
        this.damage = this.GetAbilityPlus().GetAbilityDamage();
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.bAutoCast = keys.bAutoCast;
        if (this.bAutoCast == 0) {
            this.target = this.GetAbilityPlus().GetCursorTarget();
        } else {
            this.target = undefined;
        }
        if (this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier && this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier.GetParent() == this.GetAbilityPlus().GetCursorTarget()) {
            this.pre_flight_time = 0;
        }
        this.interval = 1 / this.acceleration;
        this.speed_counter = 0;
        if (this.target) {
            this.target_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_gyrocopter/gyro_guided_missile_target.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.target, this.GetCasterPlus().GetTeamNumber());
            this.AddParticle(this.target_particle, false, false, -1, false, false);
        }
        this.rocket_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_STOP]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION]: true
        }
    }
    OnIntervalThink(): void {
        this.speed_counter = this.speed_counter + 1;
        this.SetStackCount(this.speed_counter);
        if (this.target) {
            if (this.target.IsNull() || !this.target.IsAlive()) {
                let nearby_targets = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.target.GetAbsOrigin(), undefined, 700, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(nearby_targets) >= 1) {
                    this.target = nearby_targets[0];
                    this.target = nearby_targets[0];
                    ParticleManager.ClearParticle(this.target_particle, false);
                    this.target_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_gyrocopter/gyro_guided_missile_target.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.target, this.GetCasterPlus().GetTeamNumber());
                    this.AddParticle(this.target_particle, false, false, -1, false, false);
                } else {
                    let explosion_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_guided_missile_explosion.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
                    ParticleManager.SetParticleControl(explosion_particle, 0, this.GetParentPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(explosion_particle);
                    this.GetParentPlus().EmitSound("Hero_Gyrocopter.HomingMissile.Destroy");
                    this.GetParentPlus().ForceKill(false);
                    this.GetParentPlus().AddNoDraw();
                    return;
                }
            }
            if ((this.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() > 250) {
                this.GetParentPlus().MoveToNPC(this.target);
            } else {
                this.GetParentPlus().MoveToPosition(this.target.GetAbsOrigin());
            }
        } else {
            if (!this.angle || this.angle == 0) {
                this.differential = 0;
            } else if (this.angle > 0) {
                this.differential = this.rc_turn_speed_degrees * this.interval;
            } else if (this.angle < 0) {
                this.differential = this.rc_turn_speed_degrees * this.interval * (-1);
            }
            this.GetParentPlus().MoveToPosition(this.GetParentPlus().GetAbsOrigin() + RotatePosition(Vector(0, 0, 0), QAngle(0, this.differential * (-1), 0), this.GetParentPlus().GetForwardVector() * this.GetParentPlus().GetIdealSpeed() as Vector) as Vector);
            if (this.turn_counter) {
                this.turn_counter = this.turn_counter + math.min(math.abs(this.differential), math.abs(this.angle) - this.turn_counter);
                if (this.turn_counter >= math.abs(this.angle)) {
                    this.turn_counter = undefined;
                    this.angle = 0;
                    this.differential = 0;
                }
            }
        }
        if (this.bAutoCast == 1) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().GetHullRadius(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false))) {
                this.target = enemy;
                return;
            }
        }
        if (this.target && (this.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetParentPlus().GetHullRadius() && !(this.GetParentPlus().HasModifier("modifier_item_imba_force_staff_active") || this.GetParentPlus().HasModifier("modifier_item_imba_hurricane_pike_force_ally") || this.GetParentPlus().HasModifier("modifier_item_imba_hurricane_pike_force_enemy") || this.GetParentPlus().HasModifier("modifier_item_imba_lance_of_longinus_force_ally") || this.GetParentPlus().HasModifier("modifier_item_imba_lance_of_longinus_force_enemy_melee"))) {
            this.target.EmitSound("Hero_Gyrocopter.HomingMissile.Target");
            this.target.EmitSound("Hero_Gyrocopter.HomingMissile.Destroy");
            if (!this.target.IsMagicImmune()) {
                this.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                    duration: this.stun_duration * (1 - this.target.GetStatusResistance())
                });
                ApplyDamage({
                    victim: this.target,
                    damage: this.damage + (this.GetParentPlus().GetIdealSpeed() * this.propulsion_speed_pct * 0.01) + (math.max(this.GetElapsedTime() - this.pre_flight_time, 0) * this.propulsion_duration_pct * 0.01),
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                if (!this.target.IsAlive() && this.GetCasterPlus().GetUnitName().includes("gyrocopter")) {
                    if (!this.responses) {
                        this.responses = {
                            "1": "gyrocopter_gyro_homing_missile_impact_01",
                            "2": "gyrocopter_gyro_homing_missile_impact_02",
                            "3": "gyrocopter_gyro_homing_missile_impact_05",
                            "4": "gyrocopter_gyro_homing_missile_impact_06",
                            "5": "gyrocopter_gyro_homing_missile_impact_07",
                            "6": "gyrocopter_gyro_homing_missile_impact_08"
                        }
                    }
                    EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
                }
                if (this.target.IsAlive()) {
                    this.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_lock_on", {
                        duration: this.lock_on_duration * (1 - this.target.GetStatusResistance())
                    });
                }
            }
            let blast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_jakiro/jakiro_liquid_fire_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.target);
            ParticleManager.SetParticleControl(blast_particle, 1, Vector(this.GetParentPlus().GetIdealSpeed() * this.propulsion_speed_pct * 0.01, this.GetParentPlus().GetIdealSpeed() * this.propulsion_speed_pct * 0.01, this.GetParentPlus().GetIdealSpeed() * this.propulsion_speed_pct * 0.01));
            ParticleManager.ReleaseParticleIndex(blast_particle);
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.target.GetAbsOrigin(), undefined, (this.GetParentPlus().GetIdealSpeed() * this.propulsion_speed_pct * 0.01) + (math.max(this.GetElapsedTime() - this.pre_flight_time, 0) * this.propulsion_duration_pct * 0.01), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != this.target) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                        duration: this.stun_duration * (1 - enemy.GetStatusResistance())
                    });
                    ApplyDamage({
                        victim: enemy,
                        damage: this.damage + (this.GetParentPlus().GetIdealSpeed() * this.propulsion_speed_pct * 0.01) + (math.max(this.GetElapsedTime() - this.pre_flight_time, 0) * this.propulsion_duration_pct * 0.01),
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                }
            }
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.target.GetAbsOrigin(), 400, this.enemy_vision_time, false);
            let explosion_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_guided_missile_explosion.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(explosion_particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(explosion_particle);
            this.StartIntervalThink(-1);
            this.GetParentPlus().ForceKill(false);
            this.GetParentPlus().AddNoDraw();
        }
        if (this.GetParentPlus().GetAbsOrigin().z < 0) {
            this.StartIntervalThink(-1);
            this.GetParentPlus().ForceKill(false);
            this.GetParentPlus().AddNoDraw();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Gyrocopter.HomingMissile.Enemy");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS]: (!this.bAutoCast || this.bAutoCast == 0) || this.GetParentPlus().HasModifier("modifier_imba_gyrocopter_homing_missile_pre_flight"),
            [modifierstate.MODIFIER_STATE_IGNORING_STOP_ORDERS]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            6: Enum_MODIFIER_EVENT.ON_ATTACKED,
            7: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        if (this.GetParentPlus().HasModifier("modifier_imba_gyrocopter_homing_missile_pre_flight")) {
            return 0;
        } else {
            return this.speed + this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        if (this.GetParentPlus().HasModifier("modifier_imba_gyrocopter_homing_missile_pre_flight")) {
            return -0.01;
        } else {
            return this.speed + this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus()) {
            if (keys.attacker.IsRealUnit() || keys.attacker.IsIllusion()) {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - this.hero_damage);
            } else if (keys.attacker.IsBuilding()) {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - (this.hero_damage / 2));
            }
            if (this.GetParentPlus().GetHealth() <= 0) {
                this.GetParentPlus().EmitSound("Hero_Gyrocopter.HomingMissile.Destroy");
                this.GetParentPlus().Kill(undefined, keys.attacker);
                this.GetParentPlus().AddNoDraw();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && this.rocket_orders[keys.order_type]) {
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_STOP || keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION) {
                this.angle = 0;
            } else {
                this.selected_pos = keys.new_pos;
                if (keys.target) {
                    this.selected_pos = keys.target.GetAbsOrigin();
                }
                this.angle = AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(this.selected_pos - this.GetParentPlus().GetAbsOrigin() as Vector).y);
                this.turn_counter = 0;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_lock_on extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/hero/gyrocopter/gyrocopter_lock_on.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            if (this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier) {
                this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier.Destroy();
            }
            this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier = this;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_gyrocopter_homing_missile_handler")) {
            this.GetCasterPlus().findBuff<modifier_imba_gyrocopter_homing_missile_handler>("modifier_imba_gyrocopter_homing_missile_handler").StartIntervalThink(FrameTime());
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier) {
            this.GetAbilityPlus<imba_gyrocopter_homing_missile>().lock_on_modifier = undefined;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_gyrocopter_homing_missile_handler")) {
            this.GetCasterPlus().findBuff<modifier_imba_gyrocopter_homing_missile_handler>("modifier_imba_gyrocopter_homing_missile_handler").StartIntervalThink(-1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            if (!GFuncEntity.IsValid(this.GetCasterPlus()) || !GFuncEntity.IsValid(this.GetParentPlus())) {
                this.Destroy();
                return;
            }
            if (!this.GetCasterPlus().CanEntityBeSeenByMyTeam(this.GetParentPlus())) {
                this.Destroy();
                return;
            }

        }
        return {
            [modifierstate.MODIFIER_STATE_EVADE_DISABLED]: true
        };
    }
}
@registerAbility()
export class imba_gyrocopter_flak_cannon extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_gyrocopter_flak_cannon_side_gunner";
    }
    OnInventoryContentsChanged(): void {
        if (this.GetIntrinsicModifierName() && this.GetCasterPlus().HasModifier(this.GetIntrinsicModifierName())) {
            if (this.GetCasterPlus().HasScepter()) {
                this.GetCasterPlus().FindModifierByName(this.GetIntrinsicModifierName()).StartIntervalThink(this.GetSpecialValueFor("fire_rate"));
            } else {
                this.GetCasterPlus().FindModifierByName(this.GetIntrinsicModifierName()).StartIntervalThink(-1);
            }
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Gyrocopter.FlackCannon.Activate");
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_gyrocopter_flak_cannon");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_flak_cannon", {
            duration: this.GetDuration()
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_flak_cannon extends BaseModifier_Plus {
    public radius: number;
    public max_attacks: any;
    public projectile_speed: number;
    public fresh_rounds: any;
    public weapons: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_gyrocopter/gyro_flak_cannon_overhead.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.max_attacks = this.GetAbilityPlus().GetTalentSpecialValueFor("max_attacks");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        this.fresh_rounds = this.GetSpecialValueFor("fresh_rounds");
        if (!IsServer()) {
            return;
        }
        this.weapons = {
            "1": "attach_attack1",
            "2": "attach_attack2"
        }
        this.SetStackCount(this.max_attacks);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !keys.no_attack_cooldown) {
            this.GetParentPlus().EmitSound("Hero_Gyrocopter.FlackCannon");
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != keys.target && !enemy.IsCourier()) {
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_flak_cannon_speed_handler", {
                        projectile_speed: this.projectile_speed
                    });
                    this.GetParentPlus().PerformAttack(enemy, false, this.GetStackCount() > this.max_attacks - this.fresh_rounds, true, true, true, false, false);
                    this.GetParentPlus().RemoveModifierByName("modifier_imba_gyrocopter_flak_cannon_speed_handler");
                }
            }
            this.DecrementStackCount();
            if (this.GetStackCount() <= 0) {
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_flak_cannon_speed_handler extends BaseModifier_Plus {
    public projectile_speed: number;
    public projectile_speed_base: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.projectile_speed = keys.projectile_speed;
        this.projectile_speed_base = this.GetParentPlus().GetProjectileSpeed();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        if (this.projectile_speed && this.projectile_speed_base) {
            return this.projectile_speed - this.projectile_speed_base;
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_flak_cannon_side_gunner extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().HasScepter() && !this.GetParentPlus().IsOutOfGame() && !this.GetParentPlus().IsInvisible() && !this.GetParentPlus().PassivesDisabled() && this.GetParentPlus().IsAlive()) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("scepter_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_FARTHEST, false))) {
                if (!enemy.IsCourier()) {
                    this.GetParentPlus().PerformAttack(enemy, false, false, true, true, true, false, false);
                    return;
                }
            }
        }
    }
}
@registerAbility()
export class imba_gyrocopter_gatling_guns extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_gyrocopter_gatling_guns_handler";
    }

    OnToggle(): void {
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_gatling_guns_wind_up", {
                duration: this.GetSpecialValueFor("wind_up_time")
            });
        } else {
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_gyrocopter_gatling_guns_wind_up");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_gyrocopter_gatling_guns");
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target) {
            ApplyDamage({
                victim: target,
                damage: this.GetCasterPlus().GetAverageTrueAttackDamage(target) * this.GetSpecialValueFor("attack_damage_pct") * 0.01,
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            return true;
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_gyrocopter_gatling_guns_activate") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_gyrocopter_gatling_guns_activate")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_gyrocopter_gatling_guns_activate"), "modifier_special_bonus_imba_gyrocopter_gatling_guns_activate", {});
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_gatling_guns_handler extends BaseModifier_Plus {
    public initialized: any;
    IsHidden(): boolean {
        return !this.GetCasterPlus().HasTalent("special_bonus_imba_gyrocopter_gatling_guns_activate");
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (!this.initialized) {
            this.SetStackCount(this.GetAbilityPlus().GetLevelSpecialValueFor("initial_ammo", 1));
            this.initialized = true;
        }
    }
    OnIntervalThink(): void {
        if (this.GetCasterPlus().IsAlive() && !this.GetParentPlus().HasModifier("modifier_imba_gyrocopter_gatling_guns_wind_up")) {
            this.SetStackCount(math.min(this.GetStackCount() + this.GetSpecialValueFor("ammo_restore_per_second"), this.GetSpecialValueFor("initial_ammo")));
        } else {
            this.StartIntervalThink(-1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && (keys.ability.GetAbilityName() == "item_refresher" || keys.ability.GetAbilityName() == "item_refresher_shard")) {
            if (this.GetParentPlus().HasModifier("modifier_imba_gyrocopter_gatling_guns") && this.GetStackCount() <= 0) {
                this.GetParentPlus().findBuff<modifier_imba_gyrocopter_gatling_guns>("modifier_imba_gyrocopter_gatling_guns").StartIntervalThink(this.GetSpecialValueFor("fire_interval"));
                this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
                this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Empty");
            }
            this.SetStackCount(this.GetAbilityPlus().GetLevelSpecialValueFor("initial_ammo", 1));
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_gatling_guns_wind_up extends BaseModifier_Plus {
    public wind_up_time: number;
    public max_move_speed: number;
    public incoming_damage_pct: number;
    public ammo_modifier: any;
    DestroyOnExpire(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return this.GetRemainingTime() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus() || !this.GetCasterPlus().HasModifier("modifier_imba_gyrocopter_gatling_guns_handler")) {
            return;
        }
        this.wind_up_time = this.GetSpecialValueFor("wind_up_time");
        this.max_move_speed = this.GetSpecialValueFor("max_move_speed");
        this.incoming_damage_pct = this.GetSpecialValueFor("incoming_damage_pct");
        if (!IsServer()) {
            return;
        }
        this.ammo_modifier = this.GetCasterPlus().findBuff<modifier_imba_gyrocopter_gatling_guns_handler>("modifier_imba_gyrocopter_gatling_guns_handler");
        this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Wind_Up");
        this.StartIntervalThink(this.GetRemainingTime());
    }
    OnIntervalThink(): void {
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_gatling_guns", {});
        this.StartIntervalThink(-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Wind_Up");
        this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Wind_Down");
        if (this.ammo_modifier) {
            this.ammo_modifier.StartIntervalThink(1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_TETHERED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        return this.max_move_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.incoming_damage_pct;
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_gatling_guns extends BaseModifier_Plus {
    public max_move_speed: number;
    public fire_interval: number;
    public attack_range_bonus_pct: number;
    public spread_angle: any;
    public ammo_modifier: any;
    public projectile_info: any;
    public firing_sound: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus() || !this.GetCasterPlus().HasModifier("modifier_imba_gyrocopter_gatling_guns_handler")) {
            return;
        }
        this.max_move_speed = this.GetSpecialValueFor("max_move_speed");
        if (!IsServer()) {
            return;
        }
        this.fire_interval = this.GetSpecialValueFor("fire_interval");
        this.attack_range_bonus_pct = this.GetSpecialValueFor("attack_range_bonus_pct");
        this.spread_angle = this.GetSpecialValueFor("spread_angle");
        this.ammo_modifier = this.GetCasterPlus().findBuff<modifier_imba_gyrocopter_gatling_guns_handler>("modifier_imba_gyrocopter_gatling_guns_handler");
        this.projectile_info = {
            EffectName: "particles/base_attacks/ranged_tower_good_linear.vpcf",
            Ability: this.GetAbilityPlus(),
            Source: this.GetCasterPlus(),
            vSpawnOrigin: this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack1")),
            vVelocity: RotatePosition(Vector(0, 0, 0), QAngle(0, RandomFloat(this.spread_angle * (-1), this.spread_angle), 0), this.GetParentPlus().GetForwardVector()) * this.GetParentPlus().GetProjectileSpeed() * Vector(1, 1, 0),
            vAcceleration: undefined,
            fMaxSpeed: undefined,
            fDistance: this.GetParentPlus().Script_GetAttackRange() * this.attack_range_bonus_pct * 0.01,
            fStartRadius: 25,
            fEndRadius: 25,
            fExpireTime: undefined,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bIgnoreSource: true,
            bHasFrontalCone: false,
            bDrawsOnMinimap: false,
            bVisibleToEnemies: true,
            bProvidesVision: false,
            iVisionRadius: undefined,
            iVisionTeamNumber: undefined,
            ExtraData: {}
        }
        this.firing_sound = true;
        if (this.ammo_modifier && this.ammo_modifier.GetStackCount() > 0) {
            this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
        }
        this.OnIntervalThink();
        this.StartIntervalThink(this.fire_interval);
    }
    OnIntervalThink(): void {
        if (!this.ammo_modifier || this.ammo_modifier.IsNull()) {
            this.StartIntervalThink(-1);
            return;
        }
        if (this.GetParentPlus().IsDisarmed()) {
            if (this.firing_sound) {
                this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
                this.firing_sound = false;
            }
            return;
        } else if (!this.GetParentPlus().IsDisarmed() && !this.firing_sound) {
            this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
            this.firing_sound = true;
        }
        if (this.ammo_modifier.GetStackCount() > 0) {
            this.projectile_info.vSpawnOrigin = this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack1"));
            this.projectile_info.vVelocity = RotatePosition(Vector(0, 0, 0), QAngle(0, RandomFloat(this.spread_angle * (-1), this.spread_angle), 0), this.GetParentPlus().GetForwardVector()) * this.GetParentPlus().GetProjectileSpeed() * Vector(1, 1, 0);
            ProjectileManager.CreateLinearProjectile(this.projectile_info);
            this.ammo_modifier.DecrementStackCount();
        } else {
            this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
            this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Empty");
            this.StartIntervalThink(-1);
            return;
        }
        if (this.ammo_modifier.GetStackCount() > 0) {
            this.projectile_info.vSpawnOrigin = this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack2"));
            this.projectile_info.vVelocity = RotatePosition(Vector(0, 0, 0), QAngle(0, RandomFloat(this.spread_angle * (-1), this.spread_angle), 0), this.GetParentPlus().GetForwardVector()) * this.GetParentPlus().GetProjectileSpeed() * Vector(1, 1, 0);
            ProjectileManager.CreateLinearProjectile(this.projectile_info);
            this.ammo_modifier.DecrementStackCount();
        } else {
            this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
            this.GetParentPlus().EmitSound("Hero_Gyrocopter.Gatling_Guns_Empty");
            this.StartIntervalThink(-1);
            return;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Shoot");
        this.GetParentPlus().StopSound("Hero_Gyrocopter.Gatling_Guns_Empty");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        return this.max_move_speed;
    }
}
@registerAbility()
export class imba_gyrocopter_call_down extends BaseAbility_Plus {
    public responses: any;
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return super.GetCastRange(location, target);
        }
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_gyrocopter_call_down_cooldown");
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Gyrocopter.CallDown.Fire");
        if (this.GetCasterPlus().GetUnitName().includes("gyrocopter")) {
            if (!this.responses) {
                this.responses = {
                    "1": "gyrocopter_gyro_call_down_03",
                    "2": "gyrocopter_gyro_call_down_04",
                    "3": "gyrocopter_gyro_call_down_05",
                    "4": "gyrocopter_gyro_call_down_06",
                    "5": "gyrocopter_gyro_call_down_09"
                }
            }
            EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
        }
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_gyrocopter_call_down_thinker", {
            duration: this.GetSpecialValueFor("missile_delay_tooltip") * 2
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_gyrocopter_call_down_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_gyrocopter_call_down_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_gyrocopter_call_down_cooldown"), "modifier_special_bonus_imba_gyrocopter_call_down_cooldown", {});
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_call_down_thinker extends BaseModifier_Plus {
    public slow_duration_first: number;
    public slow_duration_second: number;
    public damage_first: number;
    public damage_second: number;
    public slow_first: any;
    public slow_second: any;
    public radius: number;
    public missile_delay_tooltip: number;
    public cast_range_standard: number;
    public damage_type: number;
    public first_missile_impact: any;
    public second_missile_impact: any;
    public marker_particle: any;
    BeCreated(p_0: any,): void {
        this.slow_duration_first = this.GetSpecialValueFor("slow_duration_first");
        this.slow_duration_second = this.GetSpecialValueFor("slow_duration_second");
        this.damage_first = this.GetSpecialValueFor("damage_first");
        this.damage_second = this.GetSpecialValueFor("damage_second");
        this.slow_first = this.GetSpecialValueFor("slow_first");
        this.slow_second = this.GetSpecialValueFor("slow_second");
        this.radius = this.GetSpecialValueFor("radius");
        this.missile_delay_tooltip = this.GetSpecialValueFor("missile_delay_tooltip");
        this.cast_range_standard = this.GetSpecialValueFor("cast_range_standard");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.first_missile_impact = false;
        this.second_missile_impact = false;
        if ((this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.cast_range_standard || this.GetCasterPlus().GetLevel() >= 25) {
            this.marker_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_gyrocopter/gyro_calldown_marker.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
        } else {
            this.marker_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_calldown_marker.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.marker_particle, 0, this.GetParentPlus().GetAbsOrigin());
        }
        ParticleManager.SetParticleControl(this.marker_particle, 1, Vector(this.radius, 1, this.radius * (-1)));
        this.AddParticle(this.marker_particle, false, false, -1, false, false);
        let calldown_first_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_calldown_first.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(calldown_first_particle, 0, this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_rocket1")));
        ParticleManager.SetParticleControl(calldown_first_particle, 1, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(calldown_first_particle, 5, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(calldown_first_particle);
        let calldown_second_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_gyrocopter/gyro_calldown_second.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(calldown_second_particle, 0, this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_rocket2")));
        ParticleManager.SetParticleControl(calldown_second_particle, 1, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(calldown_second_particle, 5, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(calldown_second_particle);
        this.StartIntervalThink(this.missile_delay_tooltip);
    }
    OnIntervalThink(): void {
        EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_Gyrocopter.CallDown.Damage", this.GetCasterPlus());
        if (!this.first_missile_impact) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_call_down_slow", {
                    duration: this.slow_duration_first * (1 - enemy.GetStatusResistance()),
                    slow: this.slow_first
                });
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage_first,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                if (this.GetCasterPlus().GetUnitName().includes("gyrocopter") && (enemy.IsRealUnit() || enemy.IsClone()) && !enemy.IsAlive()) {
                    EmitSoundOnClient("gyrocopter_gyro_call_down_1" + RandomInt(1, 2), this.GetCasterPlus().GetPlayerOwner());
                }
            }
            this.first_missile_impact = true;
        } else if (!this.second_missile_impact) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyrocopter_call_down_slow", {
                    duration: this.slow_duration_second * (1 - enemy.GetStatusResistance()),
                    slow: this.slow_second
                });
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage_second,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                if (this.GetCasterPlus().GetUnitName().includes("gyrocopter") && (enemy.IsRealUnit() || enemy.IsClone()) && !enemy.IsAlive()) {
                    EmitSoundOnClient("gyrocopter_gyro_call_down_1" + RandomInt(1, 2), this.GetCasterPlus().GetPlayerOwner());
                }
            }
            this.second_missile_impact = true;
        }
    }
}
@registerModifier()
export class modifier_imba_gyrocopter_call_down_slow extends BaseModifier_Plus {
    BeCreated(keys: any): void {
        if (keys && keys.slow) {
            this.SetStackCount(keys.slow * (-1));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_gyrocopter_flak_cannon_attacks extends BaseModifier_Plus {
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
@registerModifier()
export class modifier_special_bonus_imba_gyrocopter_rocket_barrage_damage extends BaseModifier_Plus {
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
@registerModifier()
export class modifier_special_bonus_imba_gyrocopter_call_down_cooldown extends BaseModifier_Plus {
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
@registerModifier()
export class modifier_special_bonus_imba_gyrocopter_gatling_guns_activate extends BaseModifier_Plus {
    public gatling_guns_ability: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.gatling_guns_ability = this.GetCasterPlus().findAbliityPlus<imba_gyrocopter_gatling_guns>("imba_gyrocopter_gatling_guns");
        if (this.gatling_guns_ability) {
            this.gatling_guns_ability.SetHidden(false);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.gatling_guns_ability) {
            this.gatling_guns_ability.SetHidden(true);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_gyrocopter_homing_missile_charges extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_gyrocopter_homing_missile>("imba_gyrocopter_homing_missile"), "modifier_generic_charges", {});
    }
}
