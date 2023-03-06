
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

export class base_ability_dual_breath extends BaseAbility_Plus {
    modifier_caster_name: string;
    ability_other_breath_name: string;
    IsNetherWardStealable() {
        return false;
    }
    GetCastRange(Location: Vector, Target: CDOTA_BaseNPC | undefined): number {
        if (IsServer()) {
            return 0;
        } else {
            return this.GetSpecialValueFor("range") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_jakiro_1");
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            caster.EmitSound("Hero_Jakiro.DualBreath");
            caster.AddNewModifier(caster, this, this.modifier_caster_name, {});
            if (this.GetCasterPlus().HasAbility("imba_jakiro_dual_breath")) {
                this.GetCasterPlus().findAbliityPlus<imba_jakiro_dual_breath>("imba_jakiro_dual_breath").UseResources(false, false, true);
            }
        }
    }
}
export class base_modifier_dual_breath_caster extends BaseModifierMotionHorizontal_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public path_radius: number;
    public spill_distance: number;
    public debuff_duration: number;
    public ability_target_team: any;
    public ability_target_type: any;
    public ability_target_flags: any;
    public breath_direction: any;
    public breath_distance: number;
    public breath_speed: number;
    public breath_traveled: any;
    public affected_unit_list: IBaseNpc_Plus[];
    public existing_breath_particle: any;
    public particle_breath: string;
    public modifier_debuff_name: string;
    public ability_other_breath_name: string;

    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    GetOverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    GetActivityTranslationModifiers() {
        return "forcestaff_friendly";
    }
    GetOverrideAnimationRate() {
        return 0.5;
    }
    GetModifierDisableTurning() {
        return 1 as any;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING,
        2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
        3: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE,
        4: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
    }
    return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let caster_pos = caster.GetAbsOrigin();
            let ability_level = ability.GetLevel() - 1;
            let target = ability.GetCursorPosition();
            let range = ability.GetSpecialValueFor("range") + GPropertyCalculate.GetCastRangeBonus(caster) + caster.GetTalentValue("special_bonus_imba_jakiro_1");
            let particle_breath = this.particle_breath;
            this.caster = caster;
            this.ability = ability;
            this.path_radius = ability.GetSpecialValueFor("path_radius");
            this.spill_distance = ability.GetSpecialValueFor("spill_distance");
            this.debuff_duration = ability.GetSpecialValueFor("duration");
            this.ability_target_team = ability.GetAbilityTargetTeam();
            this.ability_target_type = ability.GetAbilityTargetType();
            this.ability_target_flags = ability.GetAbilityTargetFlags();
            let breath_direction = (target - caster_pos as Vector).Normalized();
            let breath_distance = (target - caster_pos as Vector).Length2D();
            if (breath_distance > range) {
                breath_distance = range;
            }
            let breath_speed = ability.GetLevelSpecialValueFor("speed", ability_level) + caster.GetTalentValue("special_bonus_imba_jakiro_6");
            this.breath_direction = breath_direction;
            this.breath_distance = breath_distance;
            this.breath_speed = breath_speed * 1 / 30;
            this.breath_traveled = 0;
            this.affected_unit_list = []
            if (this.existing_breath_particle) {
                let destroy_existing_breath_particle = this.existing_breath_particle;
                this.AddTimer(0.4, () => {
                    ParticleManager.DestroyParticle(destroy_existing_breath_particle, false);
                    ParticleManager.ReleaseParticleIndex(destroy_existing_breath_particle);
                });
            }
            let breath_pfx = ResHelper.CreateParticleEx(particle_breath, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(breath_pfx, 0, caster_pos);
            ParticleManager.SetParticleControl(breath_pfx, 1, breath_direction * breath_speed as Vector);
            ParticleManager.SetParticleControl(breath_pfx, 3, Vector(0, 0, 0));
            ParticleManager.SetParticleControl(breath_pfx, 9, caster_pos);
            this.existing_breath_particle = breath_pfx;
        }
    }
    ApplyHorizontalMotionController(): boolean {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;
        }
        return true;
    }
    _DualBreathApplyModifierToEnemies(enemies: IBaseNpc_Plus[]) {
        let caster = this.caster;
        let ability = this.ability;
        let affected_unit_list = this.affected_unit_list;
        let debuff_duration = this.debuff_duration;
        let modifier_debuff_name = this.modifier_debuff_name;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!affected_unit_list.includes(enemy)) {
                affected_unit_list.push(enemy);
                enemy.AddNewModifier(caster, ability, modifier_debuff_name, {
                    duration: debuff_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
    _DualBreathAOEApplyModifier() {
        let caster = this.caster;
        let ability = this.ability;
        let path_radius = this.path_radius;
        let ability_target_team = this.ability_target_team;
        let ability_target_type = this.ability_target_type;
        let ability_target_flags = this.ability_target_flags;
        let caster_pos = caster.GetAbsOrigin();
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_pos, undefined, path_radius, ability_target_team, ability_target_type, ability_target_flags, FindOrder.FIND_ANY_ORDER, false);
        this._DualBreathApplyModifierToEnemies(enemies);
        GridNav.DestroyTreesAroundPoint(caster_pos, path_radius, false);
        let spill_distance = (this.spill_distance - path_radius);
        let target_vector = caster_pos + (this.breath_direction * spill_distance) as Vector;
        enemies = FindUnitsInLine(caster.GetTeamNumber(), caster_pos, target_vector, undefined, path_radius * 2, ability_target_team, ability_target_type, ability_target_flags);
        this._DualBreathApplyModifierToEnemies(enemies);
        GridNav.DestroyTreesAroundPoint(target_vector, path_radius, false);
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let caster = this.caster;
            let ability = this.ability;
            let breath_speed = this.breath_speed;
            let breath_traveled = this.breath_traveled;
            this._DualBreathAOEApplyModifier();
            if (breath_traveled < this.breath_distance) {
                let set_point = caster.GetAbsOrigin() + this.breath_direction * breath_speed as Vector;
                caster.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, caster).z));
                this.breath_traveled = breath_traveled + breath_speed;
            } else {
                this.Destroy();
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            if (!ability.IsStolen()) {
                caster.SwapAbilities(ability.GetAbilityName(), this.ability_other_breath_name, false, true);
            }
            if (this.existing_breath_particle) {
                let destroy_existing_breath_particle = this.existing_breath_particle;
                this.existing_breath_particle = undefined;
                this.AddTimer(0.4, () => {
                    ParticleManager.DestroyParticle(destroy_existing_breath_particle, false);
                    ParticleManager.ReleaseParticleIndex(destroy_existing_breath_particle);
                });
            }
            caster.SetUnitOnClearGround();
        }
    }
}
export class base_modifier_dot_debuff extends BaseModifier_Plus {
    public tick_damage: number;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ability_dmg_type: any;
    public damage_interval: number;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return true;
    }
    _UpdateSubClassLevelValues(): void { }
    _UpdateDebuffLevelValues() {
        if (IsServer()) {
            let ability = this.ability;
            let damage = ability.GetSpecialValueFor("damage");
            if (ability.GetName() == "imba_jakiro_macropyre" && this.GetCasterPlus().HasScepter()) {
                damage = ability.GetSpecialValueFor("damage_scepter");
            }
            this.tick_damage = damage * this.damage_interval;
        }
        if (this._UpdateSubClassLevelValues) {
            this._UpdateSubClassLevelValues();
        }
    }
    _SubClassOnCreated(): void { }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        this.ability = ability;
        if (this._SubClassOnCreated) {
            this._SubClassOnCreated();
        }
        if (IsServer()) {
            let damage_interval = ability.GetSpecialValueFor("damage_interval");
            this.ability_dmg_type = ability.GetAbilityDamageType();
            this.damage_interval = damage_interval;
        }
        this._UpdateDebuffLevelValues();
        if (IsServer()) {
            this.OnIntervalThink();
            if (ability.GetName() == "imba_jakiro_macropyre") {
                this.StartIntervalThink(this.damage_interval);
            } else {
                this.StartIntervalThink(this.damage_interval * (1 - this.parent.GetStatusResistance()));
            }
        }
    }
    BeRefresh(p_0: any,): void {
        this._UpdateDebuffLevelValues();
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.caster;
            let victim = this.parent;
            let final_tick_damage = this.tick_damage;
            if (victim.FindModifierByNameAndCaster("modifier_imba_ice_path_freeze_debuff", caster)) {
                let ability_ice_path = caster.findAbliityPlus<imba_jakiro_ice_path>("imba_jakiro_ice_path");
                if (ability_ice_path) {
                    let ability_level = ability_ice_path.GetLevel() - 1;
                    let dmg_amp = ability_ice_path.GetLevelSpecialValueFor("dmg_amp", ability_level) + caster.GetTalentValue("special_bonus_imba_jakiro_7");
                    final_tick_damage = final_tick_damage * (1 + dmg_amp / 100);
                }
            }
            ApplyDamage({
                attacker: caster,
                victim: victim,
                ability: this.ability,
                damage: final_tick_damage,
                damage_type: this.ability_dmg_type
            });
        }
    }
}

@registerAbility()
export class imba_jakiro_fire_breath extends base_ability_dual_breath {
    ability_other_breath_name = "imba_jakiro_ice_breath";
    modifier_caster_name = "modifier_imba_fire_breath_caster";
    GetAbilityTextureName() {
        return "jakiro_fire_breath"
    }
}
@registerModifier()
export class modifier_imba_fire_breath_debuff extends base_modifier_dot_debuff {
    public move_slow: any;
    _UpdateDebuffLevelValues() {
        if (IsServer()) {
            let caster = this.caster;
            let ability = this.ability;
            let damage = ability.GetSpecialValueFor("damage") + caster.GetTalentValue("special_bonus_imba_jakiro_2", "fire_damage_increase");
            this.tick_damage = damage * this.damage_interval;
        }
    }
    _SubClassOnCreated() {
        this.move_slow = -(this.ability.GetSpecialValueFor("move_slow"));
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phoenix/phoenix_ambient_wings_flame.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        this.AddParticle(particle, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow;
    }
}
@registerModifier()
export class modifier_imba_fire_breath_caster extends base_modifier_dual_breath_caster {
    modifier_debuff_name = "modifier_imba_fire_breath_debuff"
    ability_other_breath_name = "imba_jakiro_ice_breath"
    particle_breath = "particles/hero/jakiro/jakiro_fire_breath.vpcf"
}
@registerAbility()
export class imba_jakiro_ice_breath extends base_ability_dual_breath {
    ability_other_breath_name = "imba_jakiro_ice_breath";
    modifier_caster_name = "modifier_imba_ice_breath_caster";
    GetAbilityTextureName() {
        return "jakiro_ice_breath"
    }
}
@registerModifier()
export class modifier_imba_ice_breath_debuff extends base_modifier_dot_debuff {
    public attack_slow: any;
    public move_slow: any;
    _SubClassOnCreated() {
        let particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_slowed_cold.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        this.AddParticle(particle, false, false, -1, false, false);
    }
    _UpdateSubClassLevelValues() {
        let ability = this.GetAbilityPlus();
        let talent_slow = this.GetCasterPlus().GetTalentValue("special_bonus_imba_jakiro_2", "slow_increase");
        this.attack_slow = -(ability.GetSpecialValueFor("attack_slow")) * (1 + (talent_slow / 100));
        this.move_slow = -(ability.GetSpecialValueFor("move_slow")) - talent_slow;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_slow;
    }
}
@registerModifier()
export class modifier_imba_ice_breath_caster extends base_modifier_dual_breath_caster {
    modifier_debuff_name = "modifier_imba_ice_breath_debuff"
    ability_other_breath_name = "imba_jakiro_fire_breath"
    particle_breath = "particles/hero/jakiro/jakiro_ice_breath.vpcf"
}


@registerAbility()
export class imba_jakiro_dual_breath extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_jakiro_1");
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasAbility("imba_jakiro_fire_breath")) {
            this.GetCasterPlus().findAbliityPlus<imba_jakiro_fire_breath>("imba_jakiro_fire_breath").SetLevel(this.GetLevel());
        }
        if (this.GetCasterPlus().HasAbility("imba_jakiro_ice_breath")) {
            this.GetCasterPlus().findAbliityPlus<imba_jakiro_ice_breath>("imba_jakiro_ice_breath").SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster_position = this.GetCasterPlus().GetAbsOrigin();
        let cursor_position = this.GetCursorPosition();
        this.GetCasterPlus().EmitSound("Hero_Jakiro.DualBreath.Cast");
        ProjectileManager.CreateLinearProjectile({
            EffectName: "particles/units/heroes/hero_jakiro/jakiro_dual_breath_ice.vpcf",
            Ability: this,
            Source: this.GetCasterPlus(),
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            vVelocity: ((cursor_position - caster_position) * Vector(1, 1, 0) as Vector).Normalized() * this.GetTalentSpecialValueFor("speed") as Vector,
            vAcceleration: undefined,
            fMaxSpeed: undefined,
            fDistance: this.GetTalentSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus(),
            fStartRadius: this.GetSpecialValueFor("start_radius"),
            fEndRadius: this.GetSpecialValueFor("end_radius"),
            fExpireTime: undefined,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
            bIgnoreSource: true,
            bHasFrontalCone: false,
            bDrawsOnMinimap: false,
            bVisibleToEnemies: true,
            bProvidesVision: false,
            iVisionRadius: undefined,
            iVisionTeamNumber: undefined,
            ExtraData: {
                projectile_type: "ice"
            }
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_jakiro_dual_breath_self_disable_turning", {
            duration: 0.1
        });
        this.GetCasterPlus().SetContextThink(DoUniqueString("dual_breath"), () => {
            this.GetCasterPlus().EmitSound("Hero_Jakiro.DualBreath.Cast");
            let fire_breath_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_jakiro/jakiro_taunt_icemelt_fire.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(fire_breath_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlForward(fire_breath_particle, 0, (cursor_position - caster_position as Vector).Normalized());
            ParticleManager.ReleaseParticleIndex(fire_breath_particle);
            ProjectileManager.CreateLinearProjectile({
                EffectName: "particles/units/heroes/hero_jakiro/jakiro_dual_breath_fire.vpcf",
                Ability: this,
                Source: this.GetCasterPlus(),
                vSpawnOrigin: caster_position,
                vVelocity: ((cursor_position - caster_position) * Vector(1, 1, 0) as Vector).Normalized() * this.GetTalentSpecialValueFor("speed_fire") as Vector,
                vAcceleration: undefined,
                fMaxSpeed: undefined,
                fDistance: this.GetTalentSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus(),
                fStartRadius: this.GetSpecialValueFor("start_radius"),
                fEndRadius: this.GetSpecialValueFor("end_radius"),
                fExpireTime: undefined,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
                bIgnoreSource: true,
                bHasFrontalCone: false,
                bDrawsOnMinimap: false,
                bVisibleToEnemies: true,
                bProvidesVision: false,
                iVisionRadius: undefined,
                iVisionTeamNumber: undefined,
                ExtraData: {
                    projectile_type: "fire"
                }
            });
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_jakiro_dual_breath_self_disable_turning", {
                duration: 0.1
            });
            return undefined;
        }, this.GetSpecialValueFor("fire_delay"));
        if (this.GetCasterPlus().HasAbility("imba_jakiro_fire_breath")) {
            this.GetCasterPlus().findAbliityPlus<imba_jakiro_fire_breath>("imba_jakiro_fire_breath").UseResources(false, false, true);
        }
        if (this.GetCasterPlus().HasAbility("imba_jakiro_ice_breath")) {
            this.GetCasterPlus().findAbliityPlus<imba_jakiro_ice_breath>("imba_jakiro_ice_breath").UseResources(false, false, true);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target) {
            if (ExtraData.projectile_type == "ice") {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_jakiro_dual_breath_slow", {
                    duration: this.GetDuration()
                });
            } else if (ExtraData.projectile_type == "fire") {
                target.EmitSound("Hero_Jakiro.DualBreath.Burn");
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_jakiro_dual_breath_burn", {
                    duration: this.GetDuration()
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_jakiro_dual_breath_slow extends BaseModifier_Plus {
    public frost_damage: number;
    public slow_movement_speed_pct: number;
    public slow_attack_speed_pct: number;
    public interval: number;
    public damage_per_interval: number;
    public damage_type: number;
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.frost_damage = this.GetSpecialValueFor("frost_damage");
        this.slow_movement_speed_pct = this.GetSpecialValueFor("slow_movement_speed_pct") - this.GetCasterPlus().GetTalentValue("special_bonus_imba_jakiro_2", "slow_increase");
        this.slow_attack_speed_pct = this.GetSpecialValueFor("slow_attack_speed_pct") - this.GetCasterPlus().GetTalentValue("special_bonus_imba_jakiro_2", "slow_increase");
        this.interval = 0.5;
        this.damage_per_interval = this.frost_damage * this.interval;
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.OnIntervalThink();
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().HasModifier("modifier_imba_ice_breath_debuff")) {
            this.StartIntervalThink(-1);
            this.Destroy();
            return undefined;
        }
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_interval,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage_per_interval, undefined);
        this.SetStackCount(this.slow_movement_speed_pct * (1 - this.GetParentPlus().GetStatusResistance()));
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_jakiro_dual_breath_burn extends BaseModifier_Plus {
    public burn_damage: number;
    public slow_movement_speed_pct_fire: number;
    public interval: number;
    public damage_per_interval: number;
    public damage_type: number;
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.burn_damage = this.GetSpecialValueFor("burn_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_jakiro_2", "fire_damage_increase");
        this.slow_movement_speed_pct_fire = this.GetSpecialValueFor("slow_movement_speed_pct_fire");
        this.interval = 0.5;
        this.damage_per_interval = this.burn_damage * this.interval;
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.OnIntervalThink();
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().HasModifier("modifier_imba_fire_breath_debuff")) {
            this.StartIntervalThink(-1);
            this.Destroy();
            return undefined;
        }
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_interval,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage_per_interval, undefined);
        this.SetStackCount(this.slow_movement_speed_pct_fire * (1 - this.GetParentPlus().GetStatusResistance()));
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
export class modifier_imba_jakiro_dual_breath_self_root extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            return {
                [modifierstate.MODIFIER_STATE_ROOTED]: true
            };
        }
    }
}
@registerModifier()
export class modifier_imba_jakiro_dual_breath_self_disable_turning extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_jakiro_ice_path extends base_ability_dual_breath {
    GetAbilityTextureName(): string {
        return "jakiro_ice_path";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            CreateModifierThinker(caster, this, "modifier_imba_ice_path_thinker", {
                duration: this.GetSpecialValueFor("path_delay") + this.GetTalentSpecialValueFor("path_duration")
            }, caster.GetAbsOrigin(), caster.GetTeamNumber(), false);
        }
    }
}
@registerModifier()
export class modifier_imba_ice_path_thinker extends BaseModifier_Plus {
    public ice_path_end_time: number;
    public frozen_enemy_set: IBaseNpc_Plus[];
    public ability_target_team: any;
    public ability_target_type: any;
    public ability_target_flags: any;
    public path_radius: number;
    public stun_duration: number;
    public start_pos: any;
    public end_pos: any;
    public modifier_slow: string;
    public modifier_freeze: string;
    BeCreated(kv: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let ability_level = ability.GetLevel() - 1;
            let path_length = ability.GetLevelSpecialValueFor("range", ability_level) + GPropertyCalculate.GetCastRangeBonus(caster);
            let path_delay = ability.GetSpecialValueFor("path_delay");
            let path_radius = ability.GetSpecialValueFor("path_radius");
            let path_duration = ability.GetLevelSpecialValueFor("path_duration", ability_level) + caster.GetTalentValue("special_bonus_imba_jakiro_3");
            let stun_duration = ability.GetLevelSpecialValueFor("stun_duration", ability_level) + caster.GetTalentValue("special_bonus_imba_jakiro_5");
            let start_pos = caster.GetAbsOrigin();
            let direction = (caster.GetCursorPosition() - start_pos as Vector).Normalized();
            let end_pos = start_pos + direction * path_length as Vector;
            let path_total_duration = path_delay + path_duration;
            this.ice_path_end_time = GameRules.GetGameTime() + path_total_duration;
            this.frozen_enemy_set = [];
            this.ability_target_team = ability.GetAbilityTargetTeam();
            this.ability_target_type = ability.GetAbilityTargetType();
            this.ability_target_flags = ability.GetAbilityTargetFlags();
            this.path_radius = path_radius;
            this.stun_duration = stun_duration;
            this.start_pos = start_pos;
            this.end_pos = end_pos;
            caster.EmitSound("Hero_Jakiro.IcePath");
            this.AddTimer(0.1, () => {
                caster.EmitSound("Hero_Jakiro.IcePath.Cast");
            });
            let particle_name = "particles/hero/jakiro/jakiro_ice_path_line_blob.vpcf";
            let pfx_ice_path_blob = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
            ParticleManager.SetParticleControl(pfx_ice_path_blob, 0, start_pos);
            ParticleManager.SetParticleControl(pfx_ice_path_blob, 1, end_pos);
            ParticleManager.SetParticleControl(pfx_ice_path_blob, 2, Vector(path_duration, 0, 0));
            this.AddParticle(pfx_ice_path_blob, false, false, -1, false, false);
            particle_name = "particles/units/heroes/hero_jakiro/jakiro_ice_path_b.vpcf";
            let pfx_icicles = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
            ParticleManager.SetParticleControl(pfx_icicles, 0, start_pos);
            ParticleManager.SetParticleControl(pfx_icicles, 1, end_pos);
            ParticleManager.SetParticleControl(pfx_icicles, 2, Vector(path_total_duration, 0, 0));
            ParticleManager.SetParticleControl(pfx_icicles, 9, start_pos);
            this.AddParticle(pfx_icicles, false, false, -1, false, false);
            let tick_rate = 0.1;
            let viewpoint_distance = path_radius / 2;
            let viewpoint_amount = (start_pos - end_pos as Vector).Length2D() / viewpoint_distance;
            let viewpoint_view = path_radius + 5;
            viewpoint_amount = math.ceil(viewpoint_amount);
            let direction_vector = (end_pos - start_pos as Vector).Normalized();
            this.AddTimer(path_delay, () => {
                particle_name = "particles/hero/jakiro/jakiro_ice_path_line_crack.vpcf";
                let pfx_ice_path_explode = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
                ParticleManager.SetParticleControl(pfx_ice_path_explode, 0, start_pos);
                ParticleManager.SetParticleControl(pfx_ice_path_explode, 1, end_pos);
                ParticleManager.ReleaseParticleIndex(pfx_ice_path_explode);
                let current_point = start_pos as Vector;
                for (let i = 0; i < viewpoint_amount; i++) {
                    AddFOWViewer(caster.GetTeamNumber(), current_point, viewpoint_view, path_duration, false);
                    current_point = current_point + direction_vector * viewpoint_distance as Vector;
                }
                this.OnIntervalThink();
                this.StartIntervalThink(tick_rate);
            });
        }
    }
    OnIntervalThink(): void {
        let current_game_time = GameRules.GetGameTime();
        let ice_path_end_time = this.ice_path_end_time;
        let stun_duration = this.stun_duration;
        let frozen_enemy_set = this.frozen_enemy_set;
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let modifier_freeze = this.modifier_freeze;
        let enemies = FindUnitsInLine(caster.GetTeamNumber(), this.start_pos, this.end_pos, undefined, this.path_radius, this.ability_target_team, this.ability_target_type, this.ability_target_flags);
        for (const enemy of (enemies)) {
            if (!frozen_enemy_set.includes(enemy)) {
                frozen_enemy_set.push(enemy);
                enemy.AddNewModifier(caster, ability, modifier_freeze, {
                    duration: this.GetRemainingTime() * (1 - enemy.GetStatusResistance())
                });
            } else {
                if (!enemy.FindModifierByNameAndCaster(modifier_freeze, caster)) {
                    enemy.AddNewModifier(caster, ability, this.modifier_slow, {
                        duration: 1.0 * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_ice_path_freeze_debuff extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: parent,
                ability: ability,
                damage: ability.GetSpecialValueFor("damage"),
                damage_type: ability.GetAbilityDamageType()
            });
            let parent_origin = parent.GetAbsOrigin();
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_jakiro/jakiro_ice_path_shards.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(particle, 0, parent_origin);
            ParticleManager.SetParticleControl(particle, 1, parent_origin);
            ParticleManager.SetParticleControl(particle, 2, Vector(this.GetDuration(), 0, 0));
            this.AddParticle(particle, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
    }
    return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_ice_path_slow_debuff extends BaseModifier_Plus {
    public attack_slow: any;
    public move_slow: any;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return true;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.attack_slow = -(ability.GetSpecialValueFor("attack_slow"));
        this.move_slow = -(ability.GetSpecialValueFor("move_slow"));
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_jakiro/jakiro_icepath_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.AddParticle(particle, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_slow;
    }
}
@registerAbility()
export class imba_jakiro_liquid_fire extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public cast_liquid_fire: any;
    GetIntrinsicModifierName() {
        return "modifier_imba_liquid_fire_caster";
    }
    GetAbilityTextureName(): string {
        return "jakiro_liquid_fire";
    }
    IsNetherWardStealable() {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.cast_liquid_fire = false;
    }
    GetCastRange(Location: Vector, Target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        return caster.Script_GetAttackRange() + this.GetSpecialValueFor("extra_cast_range") + caster.GetTalentValue("special_bonus_imba_jakiro_4");
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        caster.StartGesture(GameActivity_t.ACT_DOTA_ATTACK);
        if (caster.GetUnitName().includes("jakiro")) {
            caster.AddNewModifier(caster, this, "modifier_imba_liquid_fire_animate", {});
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        let caster = this.GetCasterPlus();
        caster.RemoveModifierByNameAndCaster("modifier_imba_liquid_fire_animate", caster);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let target = this.GetCursorTarget();
            let caster = this.GetCasterPlus();
            this.cast_liquid_fire = true;
            caster.SetRangedProjectileName("particles/units/heroes/hero_jakiro/jakiro_base_attack_fire.vpcf");
            caster.PerformAttack(target, true, true, true, true, true, false, false);
        }
    }
}

@registerModifier()
export class modifier_imba_liquid_fire_debuff extends base_modifier_dot_debuff {
    public attack_slow: any;
    public turn_slow: any;
    _UpdateSubClassLevelValues() {
        let ability = this.ability;
        this.attack_slow = (ability.GetSpecialValueFor("attack_slow"));
    }
    _SubClassOnCreated() {
        this.turn_slow = (this.ability.GetSpecialValueFor("turn_slow"));
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.turn_slow * (-1);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}


@registerModifier()
export class modifier_imba_macropyre_debuff extends base_modifier_dot_debuff {
    public move_slow: any;
    public scale_per_tick: any;
    _SubClassOnCreated() {
        let particle = ResHelper.CreateParticleEx("particles/world_environmental_fx/fire_camp_01_smoke.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.AddParticle(particle, false, false, -1, false, false);
    }
    _UpdateSubClassLevelValues() {
        let caster = this.caster;
        if (caster.HasTalent("special_bonus_imba_jakiro_8")) {
            if (!this.move_slow || this.move_slow == 0) {
                this.move_slow = -(caster.GetTalentValue("special_bonus_imba_jakiro_8", "init_slow"));
            } else {
                if (!this.scale_per_tick) {
                    this.scale_per_tick = caster.GetTalentValue("special_bonus_imba_jakiro_8", "scale_per_tick");
                }
                this.move_slow = this.move_slow * this.scale_per_tick;
            }
        } else {
            this.move_slow = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow;
    }
}
@registerModifier()
export class modifier_imba_liquid_fire_caster extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public ability: imba_jakiro_liquid_fire;
    public apply_aoe_modifier_debuff_on_hit: { [key: string]: number };
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    RemoveOnDeath() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
        2: Enum_MODIFIER_EVENT.ON_ATTACK,
        3: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
        4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        5: Enum_MODIFIER_EVENT.ON_ORDER
    }
    return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        this.parent = this.GetParentPlus();
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.apply_aoe_modifier_debuff_on_hit = {}
    }
    _IsLiquidFireProjectile() {
        let caster = this.caster;
        return caster.GetRangedProjectileName() == "particles/units/heroes/hero_jakiro/jakiro_base_attack_fire.vpcf";
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.caster;
            let ability = this.ability;
            let target = keys.target;
            let attacker = keys.attacker;
            if (caster == attacker) {
                if (!ability.IsHidden() && !target.IsMagicImmune() && ability.GetAutoCastState() && ability.IsCooldownReady()) {
                    if (caster.GetUnitName().includes("jakiro")) {
                        caster.AddNewModifier(caster, this.ability, "modifier_imba_liquid_fire_animate", {});
                    }
                    caster.SetRangedProjectileName("particles/units/heroes/hero_jakiro/jakiro_base_attack_fire.vpcf");
                } else if (this._IsLiquidFireProjectile()) {
                    GFuncEntity.ChangeAttackProjectileImba(caster);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.caster;
            let target = keys.target;
            let attacker = keys.attacker;
            let ability = this.ability;
            if (caster == attacker && (this._IsLiquidFireProjectile() || ability.cast_liquid_fire)) {
                ability.cast_liquid_fire = false;
                if (this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""] == undefined) {
                    this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""] = 1;
                } else {
                    this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""] += 1;
                }
                ability.UseResources(false, false, true);
            }
        }
    }
    _ApplyAOELiquidFire(keys: ModifierAttackEvent) {
        if (IsServer()) {
            let caster = this.caster;
            let attacker = keys.attacker;
            let target = keys.target;
            let target_liquid_fire_counter = this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""];
            if (caster == attacker && target_liquid_fire_counter && target_liquid_fire_counter > 0) {
                this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""] = target_liquid_fire_counter - 1;
                if (this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""] == 0) {
                    this.apply_aoe_modifier_debuff_on_hit[target.GetEntityIndex() + ""] = undefined;
                }
                let ability = this.ability;
                let ability_level = ability.GetLevel() - 1;
                let particle_liquid_fire = "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_explosion.vpcf";
                let modifier_liquid_fire_debuff = "modifier_imba_liquid_fire_debuff";
                let duration = ability.GetLevelSpecialValueFor("duration", ability_level);
                let radius = ability.GetLevelSpecialValueFor("radius", ability_level);
                target.EmitSound("Hero_Jakiro.LiquidFire");
                let fire_pfx = ResHelper.CreateParticleEx(particle_liquid_fire, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                ParticleManager.SetParticleControl(fire_pfx, 0, target.GetAbsOrigin());
                ParticleManager.SetParticleControl(fire_pfx, 1, Vector(radius * 2, 0, 0));
                ParticleManager.ReleaseParticleIndex(fire_pfx);
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(caster, ability, modifier_liquid_fire_debuff, {
                        duration: duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        this._ApplyAOELiquidFire(keys);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        this._ApplyAOELiquidFire(keys);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        let order_type = keys.order_type;
        if (order_type != dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
            this.ability.cast_liquid_fire = false;
        }
    }
}
@registerModifier()
export class modifier_imba_liquid_fire_animate extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    RemoveOnDeath() {
        return true;
    }
    GetActivityTranslationModifiers() {
        return "liquid_fire";
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
        2: Enum_MODIFIER_EVENT.ON_ATTACK
    }
    return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (attacker == this.GetCasterPlus()) {
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_jakiro_macropyre extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "jakiro_macropyre";
    }
    GetAbilityDamageType(): DAMAGE_TYPES {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_jakiro_9")) {
            return DAMAGE_TYPES.DAMAGE_TYPE_PURE;
        } else {
            return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            CreateModifierThinker(caster, this, "modifier_imba_macropyre_thinker", {}, caster.GetAbsOrigin(), caster.GetTeamNumber(), false);
        }
    }
}
@registerModifier()
export class modifier_imba_macropyre_thinker extends BaseModifier_Plus {
    public ability_target_team: any;
    public ability_target_type: any;
    public ability_target_flags: any;
    public debuff_duration: number;
    public macropyre_end_time: number;
    public path_radius: number;
    public sound_fire_loop: any;
    public start_pos: any;
    public thinker_pos_list: Vector[];
    BeCreated(kv: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let target = ability.GetCursorPosition();
            let ability_level = ability.GetLevel() - 1;
            let scepter = caster.HasScepter();
            let path_radius = ability.GetLevelSpecialValueFor("path_radius", ability_level);
            let trail_amount = ability.GetLevelSpecialValueFor("trail_amount", ability_level);
            let path_duration;
            let path_length;
            let particle_name;
            caster.EmitSound("Hero_Jakiro.Macropyre.Cast");
            if (scepter) {
                caster.EmitSound("Hero_Jakiro.IcePath.Cast");
                path_duration = ability.GetLevelSpecialValueFor("duration_scepter", ability_level);
                path_length = ability.GetLevelSpecialValueFor("range_scepter", ability_level);
                particle_name = "particles/hero/jakiro/jakiro_macropyre_blue.vpcf";
            } else {
                path_duration = ability.GetLevelSpecialValueFor("duration", ability_level);
                path_length = ability.GetLevelSpecialValueFor("range", ability_level);
                particle_name = "particles/hero/jakiro/jakiro_macropyre.vpcf";
            }
            path_length = path_length + GPropertyCalculate.GetCastRangeBonus(caster);
            let direction = (target - caster.GetAbsOrigin() as Vector).Normalized();
            let half_trail_amount = (trail_amount - 1) / 2;
            let start_pos = caster.GetAbsOrigin() + direction * path_radius as Vector;
            let trail_start = (-1) * half_trail_amount;
            let trail_end = half_trail_amount;
            let trail_angle = ability.GetLevelSpecialValueFor("trail_angle", ability_level);
            let sound_fire_loop = "hero_jakiro.macropyre.scepter";
            this.ability_target_team = ability.GetAbilityTargetTeam();
            this.ability_target_type = ability.GetAbilityTargetType();
            this.ability_target_flags = ability.GetAbilityTargetFlags();
            this.debuff_duration = ability.GetSpecialValueFor("stickyness");
            this.macropyre_end_time = GameRules.GetGameTime() + path_duration;
            this.path_radius = path_radius;
            this.sound_fire_loop = sound_fire_loop;
            this.start_pos = start_pos;
            GridNav.DestroyTreesAroundPoint(start_pos, path_radius, false);
            this.GetParentPlus().EmitSound(sound_fire_loop);
            let common_vector = start_pos + direction * path_length as Vector;
            this.thinker_pos_list = [];
            for (let trail = trail_start; trail <= trail_end; trail++) {
                let macropyre_pfx = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
                let end_pos = RotatePosition(start_pos, QAngle(0, trail * trail_angle, 0), common_vector);
                ParticleManager.SetParticleAlwaysSimulate(macropyre_pfx);
                ParticleManager.SetParticleControl(macropyre_pfx, 0, start_pos);
                ParticleManager.SetParticleControl(macropyre_pfx, 1, end_pos);
                ParticleManager.SetParticleControl(macropyre_pfx, 2, Vector(path_duration, 0, 0));
                ParticleManager.SetParticleControl(macropyre_pfx, 3, start_pos);
                this.AddParticle(macropyre_pfx, false, false, -1, false, false);
                for (let i = 0; i <= math.floor(path_length / path_radius); i++) {
                    let thinker_pos = start_pos + i * path_radius * (end_pos - start_pos as Vector).Normalized() as Vector;
                    this.thinker_pos_list.push(thinker_pos);
                }
            }
            this.OnIntervalThink();
            this.StartIntervalThink(0.5);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameRules.GetGameTime() > this.macropyre_end_time) {
                this.GetParentPlus().StopSound(this.sound_fire_loop);
                UTIL_Remove(this.GetParentPlus());
            } else {
                let caster = this.GetCasterPlus();
                let ability = this.GetAbilityPlus();
                let unique_enemy_list: IBaseNpc_Plus[] = []
                let unique_enemy_set: IBaseNpc_Plus[] = []
                let thinker_pos_list = this.thinker_pos_list;
                let path_radius = this.path_radius;
                let ability_target_team = this.ability_target_team;
                let ability_target_type = this.ability_target_type;
                let ability_target_flags = this.ability_target_flags;
                let debuff_duration = this.debuff_duration;
                if (caster.HasTalent("special_bonus_imba_jakiro_9")) {
                    ability_target_flags = ability_target_flags + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
                }
                let modifier_list = {
                    "1": "modifier_imba_liquid_fire_debuff",
                    "2": "modifier_imba_fire_breath_debuff",
                    "3": "modifier_imba_ice_breath_debuff"
                }
                for (const [_, thinker_pos] of GameFunc.iPair(thinker_pos_list)) {
                    GridNav.DestroyTreesAroundPoint(thinker_pos, path_radius, false);
                    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), thinker_pos, undefined, path_radius, ability_target_team, ability_target_type, ability_target_flags, FindOrder.FIND_ANY_ORDER, false);
                    for (const enemy of (enemies)) {
                        if (!unique_enemy_set.includes(enemy)) {
                            unique_enemy_set.push(enemy);
                            unique_enemy_list.push(enemy);
                        }
                    }
                }
                for (const enemy of (unique_enemy_list)) {
                    enemy.AddNewModifier(caster, ability, "modifier_imba_macropyre_debuff", {
                        duration: debuff_duration
                    });
                    for (const [_, modifier_name] of GameFunc.Pair(modifier_list)) {
                        let other_modifier = enemy.FindModifierByNameAndCaster(modifier_name, caster);
                        if (other_modifier) {
                            other_modifier.SetDuration(other_modifier.GetRemainingTime() + 0.25, true);
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_jakiro_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_jakiro_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_jakiro_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_jakiro_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_jakiro_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_jakiro_2 extends BaseModifier_Plus {
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
