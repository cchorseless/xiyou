
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_arc_warden_flux extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_arc_warden_flux_cast_range");
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!target.TriggerSpellAbsorb(this)) {
            this.GetCasterPlus().EmitSound("Hero_ArcWarden.Flux.Cast");
            target.EmitSound("Hero_ArcWarden.Flux.Target");
            let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_arc_warden/arc_warden_flux_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(cast_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(cast_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(cast_particle, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_arc_warden_flux", {
                duration: this.GetTalentSpecialValueFor("duration")
            });
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
export class modifier_imba_arc_warden_flux extends BaseModifier_Plus {
    public damage_per_second: number;
    public search_radius: number;
    public think_interval: number;
    public move_speed_slow_pct: number;
    public damage_per_interval: number;
    public damage_type: number;
    public flux_particle: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
        this.search_radius = this.GetSpecialValueFor("search_radius");
        this.think_interval = this.GetSpecialValueFor("think_interval");
        this.move_speed_slow_pct = this.GetSpecialValueFor("move_speed_slow_pct");
        if (!IsServer()) {
            return;
        }
        this.damage_per_interval = this.damage_per_second * this.think_interval;
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.flux_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_arc_warden/arc_warden_flux_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.flux_particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.flux_particle, false, false, -1, false, false);
        this.OnIntervalThink();
        this.StartIntervalThink(this.think_interval);
    }
    OnIntervalThink(): void {
        if (GameFunc.GetCount(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false)) <= 1) {
            ParticleManager.SetParticleControl(this.flux_particle, 4, Vector(1, 0, 0));
            this.SetStackCount(this.move_speed_slow_pct * (1 - this.GetParentPlus().GetStatusResistance()) * (-1));
            ApplyDamage({
                victim: this.GetParentPlus(),
                damage: this.damage_per_interval,
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
        } else {
            ParticleManager.SetParticleControl(this.flux_particle, 4, Vector(0, 0, 0));
            this.SetStackCount(0);
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
@registerAbility()
export class imba_arc_warden_magnetic_field extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_ArcWarden.MagneticField.Cast");
        let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_arc_warden/arc_warden_magnetic_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(cast_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(cast_particle);
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_arc_warden_magnetic_field_thinker_attack_speed", {
            duration: this.GetSpecialValueFor("duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_arc_warden_magnetic_field_thinker_evasion", {
            duration: this.GetSpecialValueFor("duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.POSITION_if_friend(this, null, (unit, index, count) => {
            if (count == 1) {
                return true
            }
            return unit != this.GetCasterPlus() && unit.IsRealUnit();
        }, FindOrder.FIND_FARTHEST);
    }
}
@registerModifier()
export class modifier_imba_arc_warden_magnetic_field_thinker_attack_speed extends BaseModifier_Plus {
    public radius: number;
    public attack_speed_bonus: number;
    public magnetic_particle: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        this.attack_speed_bonus = this.GetSpecialValueFor("attack_speed_bonus");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_ArcWarden.MagneticField");
        this.magnetic_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_arc_warden/arc_warden_magnetic.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.magnetic_particle, 1, Vector(this.radius, 1, 1));
        this.AddParticle(this.magnetic_particle, false, false, 1, false, false);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_ArcWarden.MagneticField");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return "modifier_imba_arc_warden_magnetic_field_attack_speed";
    }
}
@registerModifier()
export class modifier_imba_arc_warden_magnetic_field_thinker_evasion extends BaseModifier_Plus {
    public radius: number;
    public evasion_chance: number;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        this.evasion_chance = this.GetSpecialValueFor("evasion_chance");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return "modifier_imba_arc_warden_magnetic_field_evasion";
    }
}
@registerModifier()
export class modifier_imba_arc_warden_magnetic_field_attack_speed extends BaseModifier_Plus {
    public attack_speed_bonus: number;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.attack_speed_bonus = this.GetSpecialValueFor("attack_speed_bonus");
        } else if (this.GetAuraOwner() && this.GetAuraOwner().HasModifier("modifier_imba_arc_warden_magnetic_field_thinker_attack_speed")) {
            this.attack_speed_bonus = this.GetAuraOwner().findBuff<modifier_imba_arc_warden_magnetic_field_thinker_attack_speed>("modifier_imba_arc_warden_magnetic_field_thinker_attack_speed").attack_speed_bonus;
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_bonus;
    }
}
@registerModifier()
export class modifier_imba_arc_warden_magnetic_field_evasion extends BaseModifier_Plus {
    public evasion_chance: number;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.evasion_chance = this.GetSpecialValueFor("evasion_chance");
        } else if (this.GetAuraOwner() && this.GetAuraOwner().HasModifier("modifier_imba_arc_warden_magnetic_field_thinker_evasion")) {
            this.evasion_chance = this.GetAuraOwner().findBuff<modifier_imba_arc_warden_magnetic_field_thinker_evasion>("modifier_imba_arc_warden_magnetic_field_thinker_evasion").evasion_chance;
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(keys: ModifierAttackEvent): number {
        if (keys.attacker && this.GetAuraOwner() && this.GetAuraOwner().HasModifier("modifier_imba_arc_warden_magnetic_field_thinker_evasion") && this.GetAuraOwner().findBuff<modifier_imba_arc_warden_magnetic_field_thinker_evasion>("modifier_imba_arc_warden_magnetic_field_thinker_evasion").radius && GFuncVector.AsVector(keys.attacker.GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin()).Length2D() > this.GetAuraOwner().findBuff<modifier_imba_arc_warden_magnetic_field_thinker_evasion>("modifier_imba_arc_warden_magnetic_field_thinker_evasion").radius) {
            return this.evasion_chance;
        }
    }
}
@registerAbility()
export class imba_arc_warden_spark_wraith extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_arc_warden_spark_wraith_cooldown");
    }
    OnSpellStart(recastDuration?: number, recastLocation?: Vector): void {
        this.GetCasterPlus().EmitSound("Hero_ArcWarden.SparkWraith.Cast");
        EmitSoundOnLocationWithCaster(recastLocation || this.GetCursorPosition(), "Hero_ArcWarden.SparkWraith.Appear", this.GetCasterPlus());
        if (!this.GetAutoCastState()) {
            BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_arc_warden_spark_wraith_thinker", {
                duration: recastDuration || this.GetSpecialValueFor("duration")
            }, recastLocation || this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
        } else {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            ProjectileManager.CreateLinearProjectile({
                EffectName: "particles/hero/arc_warden/spark_wraith_linear.vpcf",
                Ability: this,
                Source: this.GetCasterPlus(),
                vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
                vVelocity: GFuncVector.AsVector((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()) * Vector(1, 1, 0)).Normalized() * this.GetSpecialValueFor("wraith_speed") as Vector,
                vAcceleration: undefined,
                fMaxSpeed: undefined,
                fDistance: super.GetCastRange(this.GetCursorPosition(), this.GetCasterPlus()) + this.GetCasterPlus().GetCastRangeBonus(),
                fStartRadius: 100,
                fEndRadius: 100,
                fExpireTime: undefined,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
                bIgnoreSource: true,
                bHasFrontalCone: false,
                bDrawsOnMinimap: false,
                bVisibleToEnemies: true,
                bProvidesVision: true,
                iVisionRadius: this.GetSpecialValueFor("wraith_vision_radius"),
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                ExtraData: {
                    spark_damage: this.GetSpecialValueFor("spark_damage"),
                    auto_cast: 1
                }
            });
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target && !target.IsRealUnit()) { return }
        if (target) {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), location, this.GetSpecialValueFor("wraith_vision_radius"), this.GetSpecialValueFor("wraith_vision_duration"), true);
            if (!target.IsMagicImmune()) {
                target.EmitSound("Hero_ArcWarden.SparkWraith.Damage");
                if (ExtraData.auto_cast == 1) {
                    let burst_particle = ResHelper.CreateParticleEx("particles/econ/items/arc_warden/arc_warden_ti9_immortal/arc_warden_ti9_wraith_prj_burst.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                    ParticleManager.ReleaseParticleIndex(burst_particle);
                }
                ApplyDamage({
                    victim: target,
                    damage: ExtraData.spark_damage + this.GetCasterPlus().GetTalentValue("special_bonus_imba_arc_warden_spark_wraith_damage"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_arc_warden_spark_wraith_purge", {
                    duration: this.GetSpecialValueFor("ministun_duration") * (1 - target.GetStatusResistance())
                });
            } else if (!target.IsAlive() && ExtraData.thinker_duration && ExtraData.thinker_time) {
                this.OnSpellStart(math.max(ExtraData.thinker_duration - ExtraData.thinker_time, 0), location);
            }
            return true;
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_arc_warden_spark_wraith_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_arc_warden_spark_wraith_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_arc_warden_spark_wraith_cooldown"), "modifier_special_bonus_imba_arc_warden_spark_wraith_cooldown", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_arc_warden_spark_wraith_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_arc_warden_spark_wraith_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_arc_warden_spark_wraith_damage"), "modifier_special_bonus_imba_arc_warden_spark_wraith_damage", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_arc_warden_spark_wraith_thinker extends BaseModifier_Plus {
    public radius: number;
    public activation_delay: number;
    public wraith_speed: number;
    public spark_damage: number;
    public think_interval: number;
    public wraith_vision_radius: number;
    public wraith_particle: any;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.activation_delay = this.GetSpecialValueFor("activation_delay");
        this.wraith_speed = this.GetSpecialValueFor("wraith_speed");
        this.spark_damage = this.GetSpecialValueFor("spark_damage");
        this.think_interval = this.GetSpecialValueFor("think_interval");
        this.wraith_vision_radius = this.GetSpecialValueFor("wraith_vision_radius");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_ArcWarden.SparkWraith.Loop");
        this.wraith_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_arc_warden/arc_warden_wraith.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.wraith_particle, 1, Vector(this.radius, 1, 1));
        this.AddParticle(this.wraith_particle, false, false, -1, false, false);
        this.AddTimer(this.activation_delay - this.think_interval, () => {
            this.StartIntervalThink(this.think_interval);
            return;
        });
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        if (!GFuncEntity.IsValid(caster)) {
            this.Destroy();
            return;
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false))) {
            this.GetParentPlus().EmitSound("Hero_ArcWarden.SparkWraith.Activate");
            ProjectileManager.CreateTrackingProjectile({
                EffectName: "particles/units/heroes/hero_arc_warden/arc_warden_wraith_prj.vpcf",
                Ability: this.GetAbilityPlus(),
                Source: this.GetParentPlus(),
                vSourceLoc: this.GetParentPlus().GetAbsOrigin(),
                Target: enemy,
                iMoveSpeed: this.wraith_speed,
                flExpireTime: undefined,
                bDodgeable: false,
                bIsAttack: false,
                bReplaceExisting: false,
                iSourceAttachment: undefined,
                bDrawsOnMinimap: undefined,
                bVisibleToEnemies: true,
                bProvidesVision: true,
                iVisionRadius: this.wraith_vision_radius,
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                ExtraData: {
                    spark_damage: this.spark_damage,
                    thinker_time: this.GetElapsedTime(),
                    thinker_duration: this.GetDuration()
                }
            });
            this.Destroy();
            return;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_ArcWarden.SparkWraith.Loop");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.FIXED_DAY_VISION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.FIXED_NIGHT_VISION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FIXED_DAY_VISION)
    CC_GetFixedDayVision(): number {
        return this.wraith_vision_radius;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FIXED_NIGHT_VISION)
    CC_GetFixedNightVision(): number {
        return this.wraith_vision_radius;
    }
}
@registerModifier()
export class modifier_imba_arc_warden_spark_wraith_purge extends BaseModifier_Plus {
    public move_speed_slow_pct: number;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.move_speed_slow_pct = this.GetSpecialValueFor("move_speed_slow_pct") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed_slow_pct;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_arc_warden_flux_cast_range extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_arc_warden_spark_wraith_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_arc_warden_spark_wraith_damage extends BaseModifier_Plus {
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


@registerAbility()
export class imba_arc_warden_tempest_double extends BaseAbility_Plus {
    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let spawn_location = caster.GetOrigin();
        let health_cost = 1 - (this.GetSpecialValueFor("health_cost") / 100);
        let mana_cost = 1 - (this.GetSpecialValueFor("mana_cost") / 100);
        let duration = this.GetSpecialValueFor("duration");
        let health_after_cast = caster.GetHealth() * mana_cost;
        let mana_after_cast = caster.GetMana() * health_cost;
        caster.SetHealth(health_after_cast);
        caster.SetMana(mana_after_cast);
        let double = caster.CreateSummon(caster.GetUnitName(), spawn_location, duration);
        // double.SetControllableByPlayer(caster.GetPlayerID(), true)
        double.SetForwardVector(caster.GetForwardVector())
        double.SetBaseDamageMin(caster.GetBaseDamageMin())
        double.SetBaseDamageMax(caster.GetBaseDamageMax())
        double.SetAttackCapability(caster.GetAttackCapability())
        double.SetRangedProjectileName(caster.GetRangedProjectileName())
        double.SetModel(caster.GetModelName())
        double.SetOriginalModel(caster.GetModelName())
        double.SetModelScale(caster.GetModelScale());
        for (let ability_id = 0; ability_id <= 15; ability_id += 1) {
            let ability = double.GetAbilityByIndex(ability_id);
            if (ability) {
                ability.SetLevel(caster.GetAbilityByIndex(ability_id).GetLevel());
                if (ability.GetAbilityName() == this.GetAbilityName()) {
                    ability.SetActivated(false);
                }
            }
        }
        for (let item_id = 0; item_id <= 5; item_id += 1) {
            let item_in_caster = caster.GetItemInSlot(item_id);
            if (item_in_caster != undefined) {
                let item_name = item_in_caster.GetAbilityName();
                if (!(item_name == "item_imba_aegis" || item_name == "item_imba_smoke_of_deceit" || item_name == "item_imba_recipe_refresher" || item_name == "item_imba_refresher" || item_name == "item_imba_ward_observer" || item_name == "item_imba_ward_sentry")) {
                    let item_created = double.CreateOneItem(item_in_caster.GetAbilityName());
                    if (GFuncEntity.IsValid(item_created)) {
                        item_created.EndCooldown()
                        item_created.SetPurchaser(null)
                        item_created.SetShareability(EShareAbility.ITEM_FULLY_SHAREABLE)
                        item_created.SetPurchaseTime(item_in_caster.GetPurchaseTime())
                        item_created.SetCurrentCharges(item_in_caster.GetCurrentCharges())
                        item_created.SetItemState(item_in_caster.GetItemState())
                        if (item_created.GetToggleState() != item_in_caster.GetToggleState()) {
                            item_created.ToggleAbility()
                        }
                        if (item_created.GetAutoCastState() != item_in_caster.GetAutoCastState()) {
                            item_created.ToggleAutoCast()
                        }
                        double.AddItem(item_created)
                        item_created.SetCurrentCharges(item_in_caster.GetCurrentCharges());
                    }
                }
            }
        }
        double.SetHealth(health_after_cast);
        double.SetMana(mana_after_cast);
        double.SetHasInventory(false);
        double.SetCanSellItems(false);
        double.AddNewModifier(caster, this, "modifier_imba_arc_warden_tempest_double", {});
    }
}
@registerModifier()
export class modifier_imba_arc_warden_tempest_double extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SUPER_ILLUSION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ILLUSION_LABEL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IS_ILLUSION,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IS_ILLUSION)
    CC_GetIsIllusion(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SUPER_ILLUSION)
    CC_GetModifierSuperIllusion(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ILLUSION_LABEL)
    CC_GetModifierIllusionLabel(): 0 | 1 {
        return 1;
    }
    // @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    // CC_OnTakeDamage(event: ModifierInstanceEvent): void {
    //     if (!event.unit.IsAlive()!) {
    //         event.unit.MakeIllusion();
    //     }
    // }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_ancestral_spirit.vpcf";
    }
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
}
