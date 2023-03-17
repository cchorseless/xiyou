
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_nian_frenzy_swipes extends BaseAbility_Plus {
    OnToggle(): void {
        let frenzy_swipes_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_nian_frenzy_swipes", this.GetCasterPlus());
        if (this.GetToggleState() && !frenzy_swipes_modifier) {
            this.GetCasterPlus().EmitSound("Hero_Nian.Frenzy_Swipes_Cast");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_nian_frenzy_swipes", {});
        } else if (!this.GetToggleState()) {
            if (frenzy_swipes_modifier && frenzy_swipes_modifier.GetElapsedTime() >= 0.25) {
                this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_nian_frenzy_swipes", this.GetCasterPlus());
            } else {
                this.ToggleAbility();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_nian_frenzy_swipes extends BaseModifier_Plus {
    public attack_damage_multiplier: number;
    public attack_speed_multiplier: number;
    public mana_per_attack: any;
    public attack_angle: any;
    public bonus_attack_range: number;
    public move_speed_slow_duration: number;
    public attack_point: any;
    public slash_rate: any;
    public wind_up: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.attack_damage_multiplier = this.GetSpecialValueFor("attack_damage_multiplier");
        this.attack_speed_multiplier = this.GetSpecialValueFor("attack_speed_multiplier");
        this.mana_per_attack = this.GetSpecialValueFor("mana_per_attack");
        this.attack_angle = this.GetSpecialValueFor("attack_angle");
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range");
        this.move_speed_slow_duration = this.GetSpecialValueFor("move_speed_slow_duration");
        if (!IsServer()) {
            return;
        }
        this.attack_point = this.GetParentPlus().GetAttackAnimationPoint() / (1 + this.GetParentPlus().GetIncreasedAttackSpeed());
        this.slash_rate = this.GetParentPlus().GetSecondsPerAttack() / this.GetSpecialValueFor("attack_speed_multiplier");
        this.wind_up = true;
        let glow_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_nian/frenzy_swipes_glow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(glow_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(glow_particle, true, false, -1, true, false);
        let glow_particle_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_nian/frenzy_swipes_glow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(glow_particle_2, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(glow_particle_2, true, false, -1, true, false);
        this.OnIntervalThink();
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.wind_up) {
            if (this.GetParentPlus().GetMana() >= this.mana_per_attack && this.GetAbilityPlus()) {
                if (!this.GetParentPlus().IsStunned() && !this.GetParentPlus().IsOutOfGame()) {
                    this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_ATTACK);
                    this.GetParentPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_ATTACK, this.GetParentPlus().GetDisplayAttackSpeed() / 200);
                }
                this.wind_up = false;
                this.StartIntervalThink(this.slash_rate - this.attack_point);
            } else {
                this.StartIntervalThink(-1);
                if (this.GetAbilityPlus() && this.GetAbilityPlus().GetToggleState()) {
                    this.GetAbilityPlus().ToggleAbility();
                }
                this.Destroy();
            }
        } else {
            if (!this.GetParentPlus().IsStunned() && !this.GetParentPlus().IsOutOfGame() && !this.GetParentPlus().IsHexed() && !this.GetParentPlus().IsNightmared()) {
                let frenzy_swipe_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_nian/frenzy_swipes.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(frenzy_swipe_particle);
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().Script_GetAttackRange() + this.bonus_attack_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.attack_angle) {
                        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_nian_frenzy_swipes_suppression", {});
                        this.GetParentPlus().PerformAttack(enemy, false, true, true, false, true, false, false);
                        this.GetParentPlus().RemoveModifierByNameAndCaster("modifier_imba_nian_frenzy_swipes_suppression", this.GetCasterPlus());
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_nian_frenzy_swipes_slow", {
                            duration: this.move_speed_slow_duration * (1 - enemy.GetStatusResistance())
                        });
                        if (this.GetCasterPlus().HasTalent("special_bonus_imba_nian_frenzy_swipes_upgrade")) {
                            enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_nian_frenzy_swipes_armor_reduction", {
                                duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_nian_frenzy_swipes_upgrade", "duration") * (1 - enemy.GetStatusResistance())
                            });
                        }
                    }
                }
            }
            this.wind_up = true;
            this.slash_rate = this.GetParentPlus().GetSecondsPerAttack() / this.GetSpecialValueFor("attack_speed_multiplier");
            this.StartIntervalThink(this.attack_point);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_ATTACK);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_nian_frenzy_swipes_suppression extends BaseModifier_Plus {
    public attack_damage_multiplier: number;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.attack_damage_multiplier = this.GetSpecialValueFor("attack_damage_multiplier");
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SUPPRESS_CLEAVE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return (this.attack_damage_multiplier - 1) * 100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SUPPRESS_CLEAVE)
    CC_GetSuppressCleave() {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (!keys.no_attack_cooldown && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) {
            return -100;
        }
    }
}
@registerModifier()
export class modifier_imba_nian_frenzy_swipes_slow extends BaseModifier_Plus {
    public move_speed_slow_pct: number;
    BeCreated(p_0: any,): void {
        this.move_speed_slow_pct = this.GetSpecialValueFor("move_speed_slow_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed_slow_pct * (-1);
    }
}
@registerModifier()
export class modifier_imba_nian_frenzy_swipes_armor_reduction extends BaseModifier_Plus {
    Init(p_0: any,): void {
        if (!IsServer() || !this.GetCasterPlus().GetTalentValue("special_bonus_imba_nian_frenzy_swipes_upgrade")) {
            return;
        }
        this.SetStackCount(this.GetStackCount() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_nian_frenzy_swipes_upgrade"));
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_nian_crushing_leap extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsServer()) {
            return 999999;
        } else {
            return this.GetTalentSpecialValueFor("max_distance");
        }
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_nian_crushing_leap_cooldown");
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_LEAP_STUN;
    }
    GetPlaybackRateOverride(): number {
        return 0.8;
    }
    OnSpellStart(): void {
        let direction_vector = this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector;
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_nian_crushing_leap_movement", {
            distance: math.min(direction_vector.Length2D(), this.GetTalentSpecialValueFor("max_distance") + this.GetCasterPlus().GetCastRangeBonus()),
            direction_x: direction_vector.x,
            direction_y: direction_vector.y,
            direction_z: direction_vector.z,
            duration: this.GetSpecialValueFor("duration"),
            height: this.GetSpecialValueFor("min_height") + ((this.GetSpecialValueFor("max_height") - this.GetSpecialValueFor("min_height")) * (1 - (math.min(direction_vector.Length2D(), this.GetTalentSpecialValueFor("max_distance") + this.GetCasterPlus().GetCastRangeBonus())) / (this.GetTalentSpecialValueFor("max_distance") + this.GetCasterPlus().GetCastRangeBonus()))),
            bGroundStop: true,
            bDecelerate: false,
            bInterruptible: false,
            treeRadius: this.GetSpecialValueFor("radius")
        });
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_nian_crushing_leap_cast_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_nian_crushing_leap_cast_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_nian_crushing_leap_cast_range"), "modifier_special_bonus_imba_nian_crushing_leap_cast_range", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_nian_crushing_leap_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_nian_crushing_leap_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_nian_crushing_leap_cooldown"), "modifier_special_bonus_imba_nian_crushing_leap_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_nian_crushing_leap_movement extends BaseModifierMotionBoth_Plus {
    public radius: number;
    public damage: number;
    public root_duration: number;
    public scepter_duration: number;
    public damage_type: number;
    public distance: number;
    public direction: any;
    public duration: number;
    public height: any;
    public bInterruptible: any;
    public bGroundStop: any;
    public bDecelerate: any;
    public bIgnoreTenacity: any;
    public treeRadius: any;
    public velocity: any;
    public horizontal_velocity: any;
    public horizontal_acceleration: any;
    public vertical_velocity: any;
    public vertical_acceleration: any;
    IgnoreTenacity() {
        return this.bIgnoreTenacity == 1;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.damage = this.GetSpecialValueFor("damage");
        this.root_duration = this.GetSpecialValueFor("root_duration");
        this.scepter_duration = this.GetSpecialValueFor("scepter_duration");
        if (!IsServer()) {
            return;
        }
        if (!this.BeginMotionOrDestroy()) { return };
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.distance = params.distance;
        this.direction = Vector(params.direction_x, params.direction_y, params.direction_z).Normalized();
        this.duration = params.duration;
        this.height = params.height;
        this.bInterruptible = params.bInterruptible;
        this.bGroundStop = params.bGroundStop;
        this.bDecelerate = params.bDecelerate;
        this.bIgnoreTenacity = params.bIgnoreTenacity;
        this.treeRadius = params.treeRadius;
        this.velocity = this.direction * this.distance / this.duration;
        if (this.bDecelerate && this.bDecelerate == 1) {
            this.horizontal_velocity = (2 * this.distance / this.duration) * this.direction;
            this.horizontal_acceleration = -(2 * this.distance) / (this.duration * this.duration);
        }
        if (this.height) {
            this.vertical_velocity = 4 * this.height / this.duration;
            this.vertical_acceleration = -(8 * this.height) / (this.duration * this.duration);
        }

    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().InterruptMotionControllers(true);
        if (this.GetParentPlus().IsAlive()) {
            if (this.GetRemainingTime() <= 0 && this.treeRadius) {
                GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), this.treeRadius, true);
            }
            this.GetParentPlus().EmitSound("Roshan.Slam");
            let slam_particle = ResHelper.CreateParticleEx("particles/neutral_fx/roshan_slam.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(slam_particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(slam_particle, 1, Vector(this.radius, this.radius, this.radius));
            ParticleManager.ReleaseParticleIndex(slam_particle);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    damage: this.damage,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetParentPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
                if (!enemy.IsMagicImmune()) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_rooted", {
                        duration: this.root_duration * (1 - enemy.GetStatusResistance())
                    });
                    if (this.GetCasterPlus().HasScepter()) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_nian_crushing_leap_strength", {
                            duration: this.scepter_duration * (1 - enemy.GetStatusResistance())
                        });
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_nian_crushing_leap_agility", {
                            duration: this.scepter_duration * (1 - enemy.GetStatusResistance())
                        });
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_nian_crushing_leap_intellect", {
                            duration: this.scepter_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        if (!this.bDecelerate || this.bDecelerate == 0) {
            me.SetOrigin(me.GetOrigin() + this.velocity * dt as Vector);
        } else {
            me.SetOrigin(me.GetOrigin() + (this.horizontal_velocity * dt) as Vector);
            this.horizontal_velocity = this.horizontal_velocity + (this.direction * this.horizontal_acceleration * dt);
        }
        if (this.bInterruptible == 1 && this.GetParentPlus().IsStunned()) {
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.height) {
            me.SetOrigin(me.GetOrigin() + Vector(0, 0, this.vertical_velocity) * dt as Vector);
            if (this.bGroundStop == 1 && GetGroundHeight(this.GetParentPlus().GetAbsOrigin(), undefined) > this.GetParentPlus().GetAbsOrigin().z) {
                this.Destroy();
            } else {
                this.vertical_velocity = this.vertical_velocity + (this.vertical_acceleration * dt);
            }
        } else {
            me.SetOrigin(GetGroundPosition(me.GetOrigin(), undefined));
        }
    }
    OnVerticalMotionInterrupted(): void {
        this.Destroy();
    }
}
@registerModifier()
export class modifier_imba_nian_crushing_leap_strength extends BaseModifier_Plus {
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
        if (this.GetParentPlus().GetStrength) {
            this.SetStackCount(this.GetParentPlus().GetStrength() * this.GetSpecialValueFor("scepter_stat_reduction") * 0.01);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_nian_crushing_leap_agility extends BaseModifier_Plus {
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
        if (this.GetParentPlus().GetAgility) {
            this.SetStackCount(this.GetParentPlus().GetAgility() * this.GetSpecialValueFor("scepter_stat_reduction") * 0.01);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_nian_crushing_leap_intellect extends BaseModifier_Plus {
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
        if (this.GetParentPlus().GetIntellect) {
            this.SetStackCount(this.GetParentPlus().GetIntellect() * this.GetSpecialValueFor("scepter_stat_reduction") * 0.01);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_nian_tail_spin extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_5;
    }
    GetPlaybackRateOverride(): number {
        return 2;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnSpellStart(): void {
        let spin_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_nian/tail_spin.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(spin_particle);
        GridNav.DestroyTreesAroundPoint(this.GetCasterPlus().GetOrigin(), this.GetSpecialValueFor("radius"), true);
        this.GetCasterPlus().EmitSound("Hero_Nian.Tail_Spin_Swoosh");
        let target_flag = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_nian_tail_spin_pierces_spell_immunity")) {
            target_flag = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, target_flag, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) >= 1) {
            this.GetCasterPlus().EmitSound("Hero_Nian.Tail_Spin_Impact");
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                damage: this.GetSpecialValueFor("damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_stunned", {
                duration: this.GetSpecialValueFor("stun_duration") * (1 - enemy.GetStatusResistance())
            });
            let direction_vector = Vector(0, 0, 0);
            if (this.GetAutoCastState()) {
                direction_vector = enemy.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector;
            }
            let knockback_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
                distance: this.GetSpecialValueFor("knockback_distance"),
                direction_x: direction_vector.x,
                direction_y: direction_vector.y,
                direction_z: direction_vector.z,
                duration: this.GetSpecialValueFor("duration"),
                height: this.GetSpecialValueFor("knockback_height"),
                bGroundStop: true,
                bDecelerate: false,
                bInterruptible: false,
                bIgnoreTenacity: true,
                treeRadius: this.GetSpecialValueFor("tree_radius")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_nian_tail_spin extends BaseModifier_Plus {
}
@registerAbility()
export class imba_nian_tail_stomp extends BaseAbility_Plus {
}
@registerModifier()
export class modifier_imba_nian_tail_stomp extends BaseModifier_Plus {
}
@registerAbility()
export class imba_nian_volcanic_burster extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_NIAN_PIN_END;
    }
    GetPlaybackRateOverride(): number {
        return 0.8;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.GetCasterPlus().EmitSound("Hero_Nian.Volcanic_Burster_Cast");
        let volcanic_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_nian_volcanic_burster_tracker", {}, this.GetCasterPlus().GetAbsOrigin() + this.GetCasterPlus().GetForwardVector() * this.GetSpecialValueFor("projectile_spawn_distance") as Vector, this.GetCasterPlus().GetTeamNumber(), false);
        volcanic_dummy.EmitSound("Hero_Nian.Volcanic_Burster_Flight");
        let velocity = (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("projectile_speed") as Vector;
        let linear_projectile: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_nian/volcanic_burster_main.vpcf",
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin() + this.GetCasterPlus().GetForwardVector() * this.GetSpecialValueFor("projectile_spawn_distance") as Vector,
            fDistance: this.GetCastRange(this.GetCursorPosition(), this.GetCasterPlus()) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()),
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 20.0,
            // bDeleteOnHit: true,
            vVelocity: Vector(velocity.x, velocity.y, 0),
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("radius"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                direction_x: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).x,
                direction_y: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).y,
                direction_z: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).z,
                volcanic_dummy: volcanic_dummy.entindex()
            }
        }
        ProjectileManager.CreateLinearProjectile(linear_projectile);
    }
    SecondaryProjectiles(location: Vector, direction: Vector) {
        let linear_projectile: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_nian/volcanic_burster_secondary.vpcf",
            vSpawnOrigin: location,
            fDistance: this.GetSpecialValueFor("secondary_distance"),
            fStartRadius: this.GetSpecialValueFor("secondary_radius"),
            fEndRadius: this.GetSpecialValueFor("secondary_radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            // bDeleteOnHit: true,
            vVelocity: direction.Normalized() * this.GetSpecialValueFor("secondary_speed") as Vector,
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("secondary_radius"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                bSecondary: true
            }
        }
        ProjectileManager.CreateLinearProjectile(linear_projectile);
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (!IsServer() || data.bSecondary == 1) {
            return;
        }
        if (data.volcanic_dummy) {
            EntIndexToHScript(data.volcanic_dummy).SetAbsOrigin(location);
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.FindModifierByNameAndCaster("modifier_imba_nian_volcanic_burster_cooldown", this.GetCasterPlus())) {
                enemy.EmitSound("BodyImpact_Common.Heavy");
                let damageTable = {
                    victim: enemy,
                    damage: this.GetSpecialValueFor("damage_per_tick"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                }
                ApplyDamage(damageTable);
                let push_vector = this.GetSpecialValueFor("projectile_speed") * Vector(data.direction_x, data.direction_y, data.direction_z).Normalized() * (this.GetSpecialValueFor("stun_on") + this.GetSpecialValueFor("stun_off"));
                let suction_vector = (location - enemy.GetAbsOrigin() + push_vector) * this.GetSpecialValueFor("suction_pct") * 0.01;
                let final_vector = push_vector + suction_vector as Vector;
                let knockback_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
                    distance: final_vector.Length2D(),
                    direction_x: final_vector.x,
                    direction_y: final_vector.y,
                    direction_z: final_vector.z,
                    duration: this.GetSpecialValueFor("stun_on"),
                    bGroundStop: false,
                    bDecelerate: false,
                    bInterruptible: false,
                    bIgnoreTenacity: true,
                    bStun: false,
                    bTreeRadius: this.GetSpecialValueFor("tree_radius")
                });
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_nian_volcanic_burster", {
                    duration: this.GetSpecialValueFor("burn_duration") * (1 - enemy.GetStatusResistance())
                });
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_nian_volcanic_burster_cooldown", {
                    duration: this.GetSpecialValueFor("stun_on") + this.GetSpecialValueFor("stun_off")
                });
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target && data.bSecondary == 1) {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_nian_volcanic_burster", {
                duration: this.GetSpecialValueFor("burn_duration") * (1 - target.GetStatusResistance())
            });
        } else if (!target && data.volcanic_dummy) {
            EntIndexToHScript(data.volcanic_dummy).RemoveSelf();
        }
    }
}
@registerModifier()
export class modifier_imba_nian_volcanic_burster extends BaseModifier_Plus {
    public burn_tick_rate: any;
    public burn_damage: number;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_chaos_meteor_burn_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.burn_tick_rate = this.GetSpecialValueFor("burn_tick_rate");
        this.burn_damage = this.GetSpecialValueFor("burn_damage");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.burn_tick_rate * (1 - this.GetParentPlus().GetStatusResistance()));
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let damageTable = {
            victim: this.GetParentPlus(),
            damage: this.GetSpecialValueFor("burn_damage"),
            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_nian_volcanic_burster_cooldown extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_nian_volcanic_burster_tracker extends BaseModifier_Plus {
    public radius: number;
    public projectiles_per_tick: any;
    public extra_projectile_tick_timer: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.projectiles_per_tick = this.GetSpecialValueFor("projectiles_per_tick");
        this.extra_projectile_tick_timer = this.GetSpecialValueFor("stun_on") + this.GetSpecialValueFor("stun_off");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.extra_projectile_tick_timer);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            for (let projectile = 1; projectile <= this.projectiles_per_tick; projectile++) {
                let random_vector = RandomVector(this.radius);
                let spawn_vector = GetGroundPosition(this.GetParentPlus().GetAbsOrigin() + random_vector as Vector, undefined);
                spawn_vector.z = spawn_vector.z + 50;
                this.GetAbilityPlus<imba_nian_volcanic_burster>().SecondaryProjectiles(spawn_vector, random_vector);
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_nian_frenzy_swipes_upgrade extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nian_tail_spin_pierces_spell_immunity extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nian_crushing_leap_cast_range extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nian_crushing_leap_cooldown extends BaseModifier_Plus {
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
