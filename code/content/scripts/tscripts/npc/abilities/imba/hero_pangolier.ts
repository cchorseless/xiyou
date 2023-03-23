
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_special_bonus_imba_pangolier_3 extends BaseModifier_Plus {
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
export class imba_pangolier_swashbuckle extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_pangolier_heartpiercer";
    }
    // GetManaCost(level: number): number {
    //     let manacost = super.GetManaCost(level);
    //     return manacost;
    // }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("dash_range");
    }
    GetCastPoint(): number {
        let cast_point = super.GetCastPoint();
        return cast_point;
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let en_guarde = "modifier_imba_shield_crash_block";
            if (caster.HasTalent("special_bonus_imba_pangolier_3")) {
                let stacks = caster.findBuffStack(en_guarde, caster);
                caster.RemoveModifierByName(en_guarde);
                caster.AddNewModifier(caster, caster.findAbliityPlus<imba_pangolier_shield_crash>("imba_pangolier_shield_crash"), en_guarde, {});
                caster.SetModifierStackCount(en_guarde, caster, stacks);
            }
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let point = caster.GetCursorPosition();
        let sound_cast = "Hero_Pangolier.Swashbuckle.Cast";
        let modifier_movement = "modifier_imba_swashbuckle_dash";
        let attack_modifier = "modifier_imba_swashbuckle_slashes";
        let dash_range = ability.GetSpecialValueFor("dash_range");
        let range = ability.GetSpecialValueFor("range");
        let rolling_thunder = "modifier_pangolier_gyroshell";
        if (caster.HasModifier(rolling_thunder)) {
            caster.RemoveModifierByName(rolling_thunder);
        }
        let direction = (point - caster.GetAbsOrigin() as Vector).Normalized();
        caster.SetForwardVector(direction);
        caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        EmitSoundOnLocationWithCaster(caster.GetAbsOrigin(), sound_cast, caster);
        caster.AddNewModifier(caster, ability, modifier_movement, {});
        let modifier_movement_handler = caster.FindModifierByName(modifier_movement) as modifier_imba_swashbuckle_dash;
        modifier_movement_handler.target_point = point;
    }

    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_swashbuckle_dash extends BaseModifierMotionHorizontal_Plus {
    target_point: Vector;
    public attack_modifier: any;
    public dash_particle: any;
    public hit_sound: any;
    public dash_speed: number;
    public range: number;
    public talent_radius: number;
    public time_elapsed: number;
    public distance: number;
    public dash_time: number;
    public direction: any;
    public frametime: number;
    public dashId: ParticleID;
    public enemies_hit: IBaseNpc_Plus[];
    BeCreated(p_0: any,): void {
        this.attack_modifier = "modifier_imba_swashbuckle_slashes";
        this.dash_particle = "particles/units/heroes/hero_pangolier/pangolier_swashbuckler_dash.vpcf";
        this.hit_sound = "Hero_Pangolier.Swashbuckle.Damage";
        this.dash_speed = this.GetSpecialValueFor("dash_speed");
        this.range = this.GetSpecialValueFor("range");
        this.talent_radius = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_1", "radius");
        if (IsServer()) {
            this.time_elapsed = 0;
            this.AddTimer(FrameTime(), () => {
                this.distance = (this.GetCasterPlus().GetAbsOrigin() - this.target_point as Vector).Length2D();
                this.dash_time = this.distance / this.dash_speed;
                this.direction = (this.target_point - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
                this.dashId = ResHelper.CreateParticleEx(this.dash_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(this.dashId, 0, this.GetCasterPlus().GetAbsOrigin());
                this.AddParticle(this.dashId, false, false, -1, true, false);
                this.BeginMotionOrDestroy()
            });
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>>;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_2")) {
            state = {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
            }
        }
        return state;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    CheckSelf() {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_1")) {
            this.enemies_hit = this.enemies_hit || [];
            let direction = this.GetCasterPlus().GetForwardVector();
            let caster_loc = this.GetCasterPlus().GetAbsOrigin();
            let target_loc = caster_loc + direction * this.talent_radius as Vector;
            let enemies = FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), caster_loc, target_loc, undefined, this.talent_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let already_hit = false;
                for (const [k, v] of GameFunc.iPair(this.enemies_hit)) {
                    if (v == enemy) {
                        already_hit = true;
                        break;
                    }
                }
                if (!already_hit) {
                    EmitSoundOn(this.hit_sound, enemy);
                    if (!enemy.IsAttackImmune()) {
                        this.GetCasterPlus().PerformAttack(enemy, true, true, true, true, false, false, true);
                        this.enemies_hit.push(enemy);
                    }
                }
            }
        }
        return;
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.time_elapsed = this.time_elapsed + dt;
            if (this.time_elapsed < this.dash_time) {
                let new_location = this.GetCasterPlus().GetAbsOrigin() + this.direction * this.dash_speed * dt as Vector;
                this.GetCasterPlus().SetAbsOrigin(new_location);
            } else {
                this.Destroy();
            }
            this.CheckSelf()
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.dashId) {
                ParticleManager.ReleaseParticleIndex(this.dashId);
                ParticleManager.DestroyParticle(this.dashId, false);
                this.dashId = null;
            }
            this.GetCasterPlus().SetUnitOnClearGround();
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST, false);
            let target_unit = undefined;
            let target_direction = undefined;
            if (GameFunc.GetCount(enemies) > 0) {
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    target_unit = target_unit || enemy;
                    if (enemy.IsRealUnit()) {
                        target_unit = enemy;
                        break;
                    }
                }
                target_direction = (target_unit.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
                this.GetCasterPlus().SetForwardVector(target_direction);
            }
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
            let attack_modifier_handler = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.attack_modifier, {}) as modifier_imba_swashbuckle_slashes;
            attack_modifier_handler.target = target_unit;
        }
    }
}
@registerModifier()
export class modifier_imba_swashbuckle_slashes extends BaseModifier_Plus {
    target: IBaseNpc_Plus;
    public buff: any;
    public particle: any;
    public hit_particle: any;
    public slashing_sound: any;
    public hit_sound: any;
    public slash_particle: ParticleID[];
    public range: number;
    public damage: number;
    public start_radius: number;
    public end_radius: number;
    public strikes: any;
    public attack_interval: number;
    public buff_duration: number;
    public executed_strikes: any;
    public direction: any;
    public fixed_target: any;
    BeCreated(p_0: any,): void {
        this.buff = "modifier_imba_swashbuckle_buff";
        this.particle = "particles/units/heroes/hero_pangolier/pangolier_swashbuckler.vpcf";
        this.hit_particle = "particles/generic_gameplay/generic_hit_blood.vpcf";
        this.slashing_sound = "Hero_Pangolier.Swashbuckle";
        this.hit_sound = "Hero_Pangolier.Swashbuckle.Damage";
        this.slash_particle = []
        this.range = this.GetSpecialValueFor("range");
        this.damage = this.GetSpecialValueFor("damage");
        this.start_radius = this.GetSpecialValueFor("start_radius");
        this.end_radius = this.GetSpecialValueFor("end_radius");
        this.strikes = this.GetSpecialValueFor("strikes");
        this.attack_interval = this.GetSpecialValueFor("attack_interval");
        this.buff_duration = this.GetSpecialValueFor("buff_duration");
        if (IsServer()) {
            this.executed_strikes = 0;
            this.AddTimer(FrameTime(), () => {
                this.direction = undefined;
                if (this.target) {
                    this.direction = (this.target.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
                    this.fixed_target = this.GetCasterPlus().GetAbsOrigin() + this.direction * this.range;
                } else {
                    this.direction = this.GetCasterPlus().GetForwardVector().Normalized();
                    this.fixed_target = this.GetCasterPlus().GetAbsOrigin() + this.direction * this.range;
                }
                this.StartIntervalThink(this.attack_interval);
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let declfuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(declfuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_1_END;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.executed_strikes == this.strikes) {
                this.Destroy();
                return undefined;
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_2")) {
                ProjectileHelper.ProjectileDodgePlus(this.GetCasterPlus());
            }
            this.slash_particle[this.executed_strikes] = ResHelper.CreateParticleEx(this.particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(this.slash_particle[this.executed_strikes], 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.slash_particle[this.executed_strikes], 1, this.direction * this.range as Vector);
            EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), this.slashing_sound, this.GetCasterPlus());
            let enemies = FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), this.fixed_target, undefined, this.start_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                EmitSoundOn(this.hit_sound, enemy);
                if (!enemy.IsAttackImmune()) {
                    let blood_particle = ResHelper.CreateParticleEx(this.hit_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                    ParticleManager.SetParticleControl(blood_particle, 0, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(blood_particle, 2, this.direction * 500 as Vector);
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_swashbuckle_damage_control", {});
                    this.GetCasterPlus().PerformAttack(enemy, true, true, true, true, false, false, true);
                    this.GetCasterPlus().RemoveModifierByName("modifier_imba_swashbuckle_damage_control");
                }
            }
            this.executed_strikes = this.executed_strikes + 1;
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            for (const v of (this.slash_particle)) {
                ParticleManager.DestroyParticle(v, false);
                ParticleManager.ReleaseParticleIndex(v);
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.buff, {
                duration: this.buff_duration
            });
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_swashbuckle_damage_control extends BaseModifier_Plus {
    public damage: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            if (!this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_8")) {
                this.damage = this.GetSpecialValueFor("damage");
            } else {
                this.damage = this.GetCasterPlus().GetAverageTrueAttackDamage(this.GetCasterPlus()) / (100 / this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_8"));
            }
        } else {
            this.damage = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ATTACK_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ATTACK_DAMAGE)
    CC_GetModifierOverrideAttackDamage(): number {
        return this.damage;
    }
}
@registerModifier()
export class modifier_imba_swashbuckle_buff extends BaseModifier_Plus {
    public bonus_as: number;
    public max_attacks: any;
    public attacks: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.bonus_as = this.GetSpecialValueFor("bonus_attackspeed");
        } else {
            this.bonus_as = 0;
        }
        if (IsServer()) {
            this.max_attacks = this.GetSpecialValueFor("max_attacks");
            this.SetStackCount(this.max_attacks);
            this.attacks = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.GetCasterPlus() && !keys.no_attack_cooldown) {
                this.attacks = this.attacks + 1;
                this.SetStackCount(this.GetStackCount() - 1);
                if (this.attacks >= this.max_attacks) {
                    this.Destroy();
                }
            }
        }
    }
}
@registerAbility()
export class imba_pangolier_shield_crash extends BaseAbility_Plus {
    public slash_particles: ParticleID[];
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_pangolier_3") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_pangolier_3").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_pangolier_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_pangolier_3", {});
        }
    }
    // GetManaCost(level: number): number {
    //     let manacost = super.GetManaCost(level);
    //     return manacost;
    // }
    GetCooldown(level: number): number {
        let cooldown = super.GetCooldown(level);
        let caster = this.GetCasterPlus();
        let roll_cooldown = this.GetSpecialValueFor("roll_cooldown");
        if (caster.HasModifier("modifier_pangolier_gyroshell")) {
            return roll_cooldown;
        }
        return cooldown;
    }
    GetCastPoint(): number {
        let cast_point = super.GetCastPoint();
        return cast_point;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let sound_cast = "Hero_Pangolier.TailThump.Cast";
        let gyroshell_ability = caster.findAbliityPlus<imba_pangolier_gyroshell>("imba_pangolier_gyroshell");
        let modifier_movement = "modifier_imba_shield_crash_jump";
        let dust_particle_path = "particles/units/heroes/hero_pangolier/pangolier_tailthump_cast.vpcf";
        let jump_duration = this.GetSpecialValueFor("jump_duration");
        let jump_duration_gyroshell = this.GetSpecialValueFor("jump_duration_gyroshell");
        let jump_height = this.GetSpecialValueFor("jump_height");
        let jump_height_gyroshell = this.GetSpecialValueFor("jump_height_gyroshell");
        let jump_horizontal_distance = this.GetSpecialValueFor("jump_horizontal_distance");
        caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        let dust = ResHelper.CreateParticleEx(dust_particle_path, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(dust, 0, caster.GetAbsOrigin());
        EmitSoundOnLocationWithCaster(caster.GetAbsOrigin(), sound_cast, caster);
        let modifier_movement_handler = caster.AddNewModifier(caster, this, modifier_movement, {}) as modifier_imba_shield_crash_jump;
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().findAbliityPlus<imba_pangolier_swashbuckle>("imba_pangolier_swashbuckle") && this.GetCasterPlus().FindAbilityByName("imba_pangolier_swashbuckle").IsTrained()) {
            let swashbuckle_ability = this.GetCasterPlus().findAbliityPlus<imba_pangolier_swashbuckle>("imba_pangolier_swashbuckle");
            let swashbuckle_radius = swashbuckle_ability.GetSpecialValueFor("end_radius") || swashbuckle_ability.GetSpecialValueFor("start_radius");
            let swashbuckle_range = swashbuckle_ability.GetSpecialValueFor("range");
            let swashbuckle_damage = swashbuckle_ability.GetSpecialValueFor("damage");
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_8")) {
                swashbuckle_damage = this.GetCasterPlus().GetAverageTrueAttackDamage(this.GetCasterPlus()) / (100 / this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_8"));
            }
            if (!this.slash_particles) {
                this.slash_particles = [];
            }
            for (const particle of (this.slash_particles)) {
                ParticleManager.DestroyParticle(particle, false);
                ParticleManager.ReleaseParticleIndex(particle);
            }
            this.slash_particles = []
            for (let pulses = 0; pulses <= 1; pulses++) {
                this.AddTimer(0.1 * pulses, () => {
                    let hit_enemies: IBaseNpc_Plus[] = []
                    for (let slash = 1; slash <= 4; slash++) {
                        let direction = RotatePosition(Vector(0, 0, 0), QAngle(0, 90 * slash, 0), this.GetCasterPlus().GetForwardVector());
                        let slash_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_pangolier/pangolier_swashbuckler.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
                        ParticleManager.SetParticleControl(slash_particle, 1, direction);
                        this.slash_particles.push(slash_particle);
                        EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), "Hero_Pangolier.Swashbuckle", this.GetCasterPlus());
                        let enemies = FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetAbsOrigin() + (direction * swashbuckle_range) as Vector, undefined, swashbuckle_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE);
                        for (const [_, enemy] of GameFunc.iPair(enemies)) {
                            if (!hit_enemies.includes(enemy)) {
                                EmitSoundOn("Hero_Pangolier.Swashbuckle.Damage", enemy);
                                let damageTable = {
                                    victim: enemy,
                                    damage: swashbuckle_damage,
                                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                                    attacker: this.GetCasterPlus(),
                                    ability: swashbuckle_ability
                                }
                                ApplyDamage(damageTable);
                                this.GetCasterPlus().PerformAttack(enemy, true, true, true, true, false, true, true);
                                hit_enemies.push(enemy)
                            }
                        }
                        this.AddTimer(0.5, () => {
                            for (const particle of (this.slash_particles)) {
                                ParticleManager.DestroyParticle(particle, false);
                                ParticleManager.ReleaseParticleIndex(particle);
                            }
                            this.slash_particles = []
                        });
                    }
                });
            }
        }
        if (modifier_movement_handler) {
            modifier_movement_handler.dust_particle = dust;
            if (this.IsStolen()) {
                modifier_movement_handler.target_point = caster.GetAbsOrigin() + caster.GetForwardVector().Normalized() * jump_horizontal_distance as Vector;
                modifier_movement_handler.jump_height = jump_height;
                modifier_movement_handler.jump_duration = jump_duration;
            } else {
                let gyroshell_horizontal_distance;
                if (gyroshell_ability) {
                    gyroshell_horizontal_distance = jump_duration_gyroshell * gyroshell_ability.GetSpecialValueFor("forward_move_speed");
                }
                if (caster.HasModifier("modifier_pangolier_gyroshell")) {
                    modifier_movement_handler.target_point = caster.GetAbsOrigin() + caster.GetForwardVector().Normalized() * gyroshell_horizontal_distance as Vector;
                    modifier_movement_handler.jump_height = jump_height_gyroshell;
                    modifier_movement_handler.jump_duration = jump_duration_gyroshell;
                } else {
                    modifier_movement_handler.target_point = caster.GetAbsOrigin() + caster.GetForwardVector().Normalized() * jump_horizontal_distance as Vector;
                    modifier_movement_handler.jump_height = jump_height;
                    modifier_movement_handler.jump_duration = jump_duration;
                }
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_shield_crash_buff extends BaseModifier_Plus {
    public stacks: number;
    public particle_1: any;
    public particle_2: any;
    public particle_3: any;
    public sound: any;
    public buff_particles: any;
    public damage_reduction_pct: number;
    BeCreated(kv: any): void {
        this.stacks = kv.stacks;
        this.particle_1 = "particles/units/heroes/hero_pangolier/pangolier_tailthump_buff.vpcf";
        this.particle_2 = "particles/units/heroes/hero_pangolier/pangolier_tailthump_buff_egg.vpcf";
        this.particle_3 = "particles/units/heroes/hero_pangolier/pangolier_tailthump_buff_streaks.vpcf";
        this.sound = "Hero_Pangolier.TailThump.Shield";
        this.buff_particles = {}
        this.damage_reduction_pct = this.GetSpecialValueFor("hero_stacks");
        if (IsServer()) {
            this.SetStackCount(this.damage_reduction_pct * this.stacks);
            EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), this.sound, this.GetCasterPlus());
            if (this.stacks > 0) {
                this.buff_particles[0] = ResHelper.CreateParticleEx(this.particle_1, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(this.buff_particles[0], 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, Vector(0, 0, 0), false);
                this.AddParticle(this.buff_particles[0], false, false, -1, true, false);
                if (this.stacks >= 3) {
                    this.buff_particles[1] = ResHelper.CreateParticleEx(this.particle_2, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
                    ParticleManager.SetParticleControlEnt(this.buff_particles[1], 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, Vector(0, 0, 0), false);
                    this.AddParticle(this.buff_particles[1], false, false, -1, true, false);
                    if (this.stacks >= 4) {
                        this.buff_particles[2] = ResHelper.CreateParticleEx(this.particle_3, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
                        ParticleManager.SetParticleControlEnt(this.buff_particles[2], 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, Vector(0, 0, 0), false);
                        this.AddParticle(this.buff_particles[2], false, false, -1, true, false);
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction_pct * this.stacks * (-1);
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_shield_crash_jump extends BaseModifierMotionBoth_Plus {
    public buff_modifier: any;
    public smash_particle: any;
    public smash_sound: any;
    public gyroshell: string;
    public damage: number;
    public buff_duration: number;
    public radius: number;
    public hero_stacks: number;
    public distance: number;
    public direction: any;
    public duration: number;
    public height: any;
    public velocity: any;
    public vertical_velocity: any;
    public vertical_acceleration: any;

    dust_particle: ParticleID;
    target_point: Vector;
    jump_height: number;
    jump_duration: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.buff_modifier = "modifier_imba_shield_crash_buff";
        this.smash_particle = "particles/units/heroes/hero_pangolier/pangolier_tailthump.vpcf";
        this.smash_sound = "Hero_Pangolier.TailThump";
        this.gyroshell = "modifier_pangolier_gyroshell";
        this.damage = this.GetSpecialValueFor("damage");
        this.buff_duration = this.GetSpecialValueFor("duration");
        this.radius = this.GetSpecialValueFor("radius");
        this.hero_stacks = this.GetSpecialValueFor("hero_stacks");
        if (IsServer()) {
            this.distance = this.GetSpecialValueFor("jump_horizontal_distance");
            this.direction = this.GetCasterPlus().GetForwardVector();
            this.duration = this.GetSpecialValueFor("jump_duration");
            this.height = this.GetSpecialValueFor("jump_height");
            if (this.GetParentPlus().IsRooted()) {
                this.height = 1;
            }
            this.velocity = this.direction * this.distance / this.duration;
            this.vertical_velocity = 4 * this.height / this.duration;
            this.vertical_acceleration = -(8 * this.height) / (this.duration * this.duration);
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            if (this.GetParentPlus().IsRooted()) {
                return;
            }
            if (!this.GetParentPlus().HasModifier("modifier_pangolier_gyroshell")) {
                this.Destroy();
            }
            if (!this.BeginMotionOrDestroy()) { return };
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
        this.GetParentPlus().RemoveVerticalMotionController(this);
        let smash = ResHelper.CreateParticleEx(this.smash_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(smash, 0, this.GetCasterPlus().GetAbsOrigin());
        EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), this.smash_sound, this.GetCasterPlus());
        let enemy_heroes = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
        let damaged_heroes = GameFunc.GetCount(enemy_heroes);
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsMagicImmune()) {
                let damage_table = ({
                    victim: enemy,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus(),
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                ApplyDamage(damage_table);
            }
        }
        if (damaged_heroes > 0) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_3")) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_shield_crash_block", {
                    duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_3", "duration"),
                    stacks: damaged_heroes
                });
            }
            if (this.GetCasterPlus().HasModifier(this.buff_modifier)) {
                let old_stacks = this.GetCasterPlus().findBuffStack(this.buff_modifier, this.GetCasterPlus());
                let buff = this.GetCasterPlus().findBuff<modifier_imba_shield_crash_buff>("modifier_imba_shield_crash_buff");
                for (const v of (buff.buff_particles)) {
                    ParticleManager.DestroyParticle(v, false);
                    ParticleManager.ReleaseParticleIndex(v);
                }
                GFuncArray.Clear(buff.buff_particles);
                this.GetCasterPlus().RemoveModifierByName(this.buff_modifier);
                if (damaged_heroes > old_stacks / this.hero_stacks) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.buff_modifier, {
                        duration: this.buff_duration,
                        stacks: damaged_heroes
                    });
                } else {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.buff_modifier, {
                        duration: this.buff_duration,
                        stacks: old_stacks / this.hero_stacks
                    });
                }
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.buff_modifier, {
                    duration: this.buff_duration,
                    stacks: damaged_heroes
                });
            }
        }
        ParticleManager.ReleaseParticleIndex(smash);
        if (this.dust_particle != null) {
            ParticleManager.DestroyParticle(this.dust_particle, false);
            ParticleManager.ReleaseParticleIndex(this.dust_particle);
        }

    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        me.SetOrigin(me.GetOrigin() + this.velocity * dt as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        me.SetOrigin(me.GetOrigin() + Vector(0, 0, this.vertical_velocity) * dt as Vector);
        if (GetGroundHeight(this.GetParentPlus().GetAbsOrigin(), undefined) > this.GetParentPlus().GetAbsOrigin().z) {
            this.Destroy();
        } else {
            this.vertical_velocity = this.vertical_velocity + (this.vertical_acceleration * dt);
        }
    }
    OnVerticalMotionInterrupted(): void {
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetCasterPlus().HasModifier(this.gyroshell)) {
            return {
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_STUNNED]: true
            };
        }
    }
}
@registerModifier()
export class modifier_imba_shield_crash_block extends BaseModifier_Plus {
    public swashbuckle: any;
    public particle: any;
    public slashing_sound: any;
    public hit_sound: any;
    public hero_attacks: any;
    public attackers: IBaseNpc_Plus[];
    public counter_range: number;
    public counter_damage: number;
    public start_radius: number;
    public end_radius: number;
    Init(keys: any): void {
        if (IsServer()) {
            this.swashbuckle = this.GetCasterPlus().findAbliityPlus<imba_pangolier_swashbuckle>("imba_pangolier_swashbuckle");
            this.particle = "particles/units/heroes/hero_pangolier/pangolier_swashbuckler.vpcf";
            this.slashing_sound = "Hero_Pangolier.Swashbuckle";
            this.hit_sound = "Hero_Pangolier.Swashbuckle.Damage";
            this.hero_attacks = 0;
            this.attackers = this.attackers || []
            this.counter_range = this.swashbuckle.GetSpecialValueFor("range");
            this.counter_damage = this.swashbuckle.GetSpecialValueFor("damage");
            this.start_radius = this.swashbuckle.GetSpecialValueFor("start_radius");
            this.end_radius = this.swashbuckle.GetSpecialValueFor("end_radius");
            if (this.GetAbilityPlus().IsStolen()) {
                this.Destroy();
            }
            this.SetStackCount(this.GetStackCount() + keys.stacks);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED,
            4: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(params: ModifierAttackEvent): number {
        let parried = false;
        for (const [k, v] of GameFunc.iPair(this.attackers)) {
            if (v == params.attacker) {
                parried = true;
                return;
            }
        }
        if (parried) {
            return 100;
        } else {
            return 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (target == this.GetCasterPlus() && attacker.IsRealUnit()) {
                if (this.GetCasterPlus().HasModifier("modifier_pangolier_gyroshell")) {
                    return;
                }
                let stacks = this.GetCasterPlus().findBuffStack("modifier_imba_shield_crash_block", this.GetCasterPlus());
                if (stacks == 0) {
                    this.attackers = []
                    return;
                }
                attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_shield_crash_block_miss", {});
                this.attackers.push(attacker);
                this.hero_attacks = this.hero_attacks + 1;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (target == this.GetCasterPlus() && attacker.IsRealUnit()) {
                if (this.GetCasterPlus().HasModifier("modifier_pangolier_gyroshell")) {
                    return undefined;
                }
                if (this.hero_attacks > 0) {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MISS, attacker, 0, undefined);
                    this.hero_attacks = this.hero_attacks - 1;
                }
                let stacks = this.GetCasterPlus().findBuffStack("modifier_imba_shield_crash_block", this.GetCasterPlus());
                let caster_loc = this.GetCasterPlus().GetAbsOrigin();
                let attacker_loc = attacker.GetAbsOrigin();
                let distance = (attacker_loc - caster_loc as Vector).Length2D();
                if (stacks > 0 && attacker.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && distance < this.counter_range) {
                    let old_direction = this.GetCasterPlus().GetForwardVector();
                    let direction = (attacker_loc - caster_loc as Vector).Normalized();
                    let target_point = caster_loc + direction * this.counter_range as Vector;
                    this.GetCasterPlus().SetForwardVector(direction);
                    this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
                    EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), this.slashing_sound, this.GetCasterPlus());
                    let slash_particle = ResHelper.CreateParticleEx(this.particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                    ParticleManager.SetParticleControl(slash_particle, 0, this.GetCasterPlus().GetAbsOrigin());
                    ParticleManager.SetParticleControl(slash_particle, 1, direction * this.counter_range as Vector);
                    let enemies = FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), caster_loc, target_point, undefined, this.start_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        EmitSoundOn(this.hit_sound, enemy);
                        if (!enemy.IsAttackImmune()) {
                            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_8")) {
                                let damageTable: ApplyDamageOptions = {
                                    victim: enemy,
                                    damage: this.counter_damage,
                                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                                    attacker: this.GetCasterPlus(),
                                    ability: undefined
                                }
                                ApplyDamage(damageTable);
                                this.GetCasterPlus().PerformAttack(enemy, true, true, true, true, false, false, true);
                            } else {
                                let damageTable: ApplyDamageOptions = {
                                    victim: enemy,
                                    damage: this.counter_damage,
                                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                                    attacker: this.GetCasterPlus(),
                                    ability: undefined
                                }
                                ApplyDamage(damageTable);
                                this.GetCasterPlus().PerformAttack(enemy, true, true, true, true, false, true, true);
                            }
                        }
                    }
                    this.GetCasterPlus().SetModifierStackCount("modifier_imba_shield_crash_block", this.GetCasterPlus(), stacks - 1);
                    this.AddTimer(0.5, () => {
                        ParticleManager.DestroyParticle(slash_particle, false);
                        ParticleManager.ReleaseParticleIndex(slash_particle);
                        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
                        this.GetCasterPlus().SetForwardVector(old_direction);
                        if (this.GetStackCount() <= 0) {
                            this.Destroy();
                        }
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED)
    CC_OnAttackFinished(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (target == this.GetCasterPlus() && attacker.IsRealUnit()) {
                if (attacker.HasModifier("modifier_imba_shield_crash_block_miss")) {
                    attacker.RemoveModifierByName("modifier_imba_shield_crash_block_miss");
                    for (const [k, v] of GameFunc.iPair(this.attackers)) {
                        if (v == attacker) {
                            this.attackers.splice(k, 1);
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shield_crash_block_miss extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: false
        }
        return state;
    }
}
@registerAbility()
export class imba_pangolier_heartpiercer extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_heartpiercer_passive";
    }
    OnUnStolen(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasModifier("modifier_imba_heartpiercer_passive")) {
                caster.RemoveModifierByName("modifier_imba_heartpiercer_passive");
            }
        }
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        caster.RemoveModifierByName("modifier_imba_heartpiercer_passive");
        caster.AddNewModifier(caster, this, "modifier_imba_heartpiercer_passive", {});
    }
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
}
@registerModifier()
export class modifier_imba_heartpiercer_passive extends BaseModifier_Plus {
    public proc_sound_hero: any;
    public proc_sound_creep: any;
    public delayed_debuff: string;
    public procced_debuff: any;
    public chance_pct: number;
    public duration: number;
    public debuff_delay: number;
    BeCreated(p_0: any,): void {
        this.proc_sound_hero = "Hero_Pangolier.HeartPiercer.Proc";
        this.proc_sound_creep = "Hero_Pangolier.HeartPiercer.Proc.Creep";
        this.delayed_debuff = "modifier_imba_heartpiercer_delay";
        this.procced_debuff = "modifier_imba_heartpiercer_debuff";
        this.GetCasterPlus().TempData().allow_heartpiercer = true;
        this.chance_pct = this.GetSpecialValueFor("chance_pct");
        this.duration = this.GetSpecialValueFor("duration");
        this.debuff_delay = this.GetSpecialValueFor("debuff_delay");
    }
    /** DeclareFunctions():modifierfunction[] {
        let declfuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(declfuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = kv.attacker;
            let target = kv.target;
            if (this.GetParentPlus() == attacker) {
                if (target.IsBuilding()) {
                    return undefined;
                }
                if (this.GetParentPlus().PassivesDisabled()) {
                    return undefined;
                }
                if (this.GetCasterPlus().TempData().allow_heartpiercer && !target.IsMagicImmune() && RollPercentage(this.chance_pct)) {
                    if (target.HasModifier(this.procced_debuff)) {
                        target.RemoveModifierByName(this.procced_debuff);
                        target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.procced_debuff, {
                            duration: this.duration * (1 - target.GetStatusResistance())
                        });
                        return;
                    } else {
                        if (!target.HasModifier(this.delayed_debuff) && !target.HasModifier(this.procced_debuff)) {
                            if (target.IsCreep()) {
                                EmitSoundOn(this.proc_sound_creep, target);
                            } else {
                                EmitSoundOn(this.proc_sound_hero, target);
                            }
                            target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), this.delayed_debuff, {
                                duration: this.debuff_delay * (1 - target.GetStatusResistance())
                            });
                        }
                    }
                }
            }
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_heartpiercer_delay extends BaseModifier_Plus {
    public icon: any;
    public duration: number;
    public slow_pct: number;
    BeCreated(p_0: any,): void {
        this.icon = "particles/units/heroes/hero_pangolier/pangolier_heartpiercer_delay.vpcf";
        this.duration = this.GetSpecialValueFor("duration");
        this.slow_pct = this.GetSpecialValueFor("slow_pct");
        let icon_particle = ResHelper.CreateParticleEx(this.icon, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(icon_particle, false, false, -1, true, true);
    }
    BeRemoved(): void {
        if (IsServer()) {
            let modifier_handler = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_heartpiercer_debuff", {
                duration: this.duration * (1 - this.GetParentPlus().GetStatusResistance())
            });
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_heartpiercer_debuff extends BaseModifier_Plus {
    public icon: any;
    public debuff_sound_creep: any;
    public debuff_sound_hero: any;
    public armor: any;
    public slow_pct: number;
    public talent_interval: number;
    public damage_per_second: number;
    public talent_tenacity_pct: number;
    BeCreated(p_0: any,): void {
        this.icon = "particles/units/heroes/hero_pangolier/pangolier_heartpiercer_debuff.vpcf";
        this.debuff_sound_creep = "Hero_Pangolier.HeartPiercer.Creep";
        this.debuff_sound_hero = "Hero_Pangolier.HeartPiercer";
        this.armor = this.GetParentPlus().GetPhysicalArmorValue(false) * (-1);
        this.slow_pct = this.GetSpecialValueFor("slow_pct");
        this.talent_interval = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_5", "tick_interval");
        this.damage_per_second = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_5", "damage_per_second");
        this.talent_tenacity_pct = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_6");
        if (IsServer()) {
            if (this.GetParentPlus().IsCreep()) {
                EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), this.debuff_sound_creep, this.GetParentPlus());
            } else {
                EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), this.debuff_sound_hero, this.GetParentPlus());
            }
            let icon_particle = ResHelper.CreateParticleEx(this.icon, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
            this.AddParticle(icon_particle, false, false, -1, true, true);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_5")) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_heartpiercer_talent_debuff", {});
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_6")) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_heartpiercer_talent_debuff_2", {});
            }
        }
        if (this.talent_interval == 0) {
            this.talent_interval = 0.1;
        }
        this.StartIntervalThink(this.talent_interval);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_5")) {
                let damage_per_tick = this.damage_per_second * this.talent_interval;
                let damageTable = {
                    victim: this.GetParentPlus(),
                    damage: damage_per_tick,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
                this.GetCasterPlus().TempData().allow_heartpiercer = false;
                this.GetCasterPlus().PerformAttack(this.GetParentPlus(), true, true, true, true, false, true, true);
                this.GetCasterPlus().TempData().allow_heartpiercer = true;
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_5")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_heartpiercer_talent_debuff");
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_6")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_heartpiercer_talent_debuff_2");
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let declfuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(declfuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_6")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_6") * (-1);
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_heartpiercer_talent_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_heartpiercer_talent_debuff_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_pangolier_gyroshell extends BaseAbility_Plus {
    public cast_effect: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_pangolier_gyroshell_stop";
    }
    // GetManaCost(level: number): number {
    //     let manacost = super.GetManaCost(level);
    //     return manacost;
    // }
    GetCastPoint(): number {
        let cast_point = super.GetCastPoint();
        return cast_point;
    }
    OnAbilityPhaseStart(): boolean {
        let sound_cast = "Hero_Pangolier.Gyroshell.Cast";
        let cast_particle = "particles/units/heroes/hero_pangolier/pangolier_gyroshell_cast.vpcf";
        let caster = this.GetCasterPlus();
        EmitSoundOnLocationWithCaster(caster.GetAbsOrigin(), sound_cast, caster);
        if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(30)) {
            caster.EmitSound("Imba.PangolierRollin");
        }
        this.cast_effect = ResHelper.CreateParticleEx(cast_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(this.cast_effect, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.cast_effect, 3, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.cast_effect, 5, caster.GetAbsOrigin());
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        ParticleManager.DestroyParticle(this.cast_effect, true);
        ParticleManager.ReleaseParticleIndex(this.cast_effect);
        this.GetCasterPlus().StopSound("Imba.PangolierRollin");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let loop_sound = "Hero_Pangolier.Gyroshell.Loop";
        let roll_modifier = "modifier_pangolier_gyroshell";
        let tick_interval = this.GetSpecialValueFor("tick_interval");
        let forward_move_speed = this.GetSpecialValueFor("forward_move_speed");
        let turn_rate_boosted = this.GetSpecialValueFor("turn_rate_boosted");
        let turn_rate = this.GetSpecialValueFor("turn_rate");
        let radius = this.GetSpecialValueFor("radius");
        let hit_radius = this.GetSpecialValueFor("hit_radius");
        let bounce_duration = this.GetSpecialValueFor("bounce_duration");
        let stun_duration = this.GetSpecialValueFor("stun_duration");
        let knockback_radius = this.GetSpecialValueFor("knockback_radius");
        let ability_duration = this.GetSpecialValueFor("duration");
        let jump_recover_time = this.GetSpecialValueFor("jump_recover_time");
        caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        ParticleManager.DestroyParticle(this.cast_effect, false);
        ParticleManager.ReleaseParticleIndex(this.cast_effect);
        caster.Purge(false, true, false, false, false);
        caster.AddNewModifier(caster, this, roll_modifier, {
            duration: ability_duration
        });
        caster.AddNewModifier(caster, this, "modifier_imba_gyroshell_impact_check", {
            duration: ability_duration
        });
        EmitSoundOn(loop_sound, caster);
        this.AddTimer(8.6, () => {
            if (caster.HasModifier("modifier_pangolier_gyroshell")) {
                StopSoundOn(loop_sound, caster);
                EmitSoundOn(loop_sound, caster);
                return 8.6;
            }
        });
        caster.SwapAbilities("imba_pangolier_gyroshell", "imba_pangolier_gyroshell_stop", false, true);
    }

    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerModifier()
export class modifier_imba_gyroshell_impact_check extends BaseModifier_Plus {
    public gyroshell: CDOTA_Buff;
    public targets: IBaseNpc_Plus[];
    public duration_extend: number;
    public hit_radius: number;
    public talent_duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            // todo modifier_pangolier_gyroshell
            this.gyroshell = this.GetCasterPlus().FindModifierByName("modifier_pangolier_gyroshell");
            this.targets = this.targets || []
            this.duration_extend = this.GetSpecialValueFor("duration_extend");
            this.hit_radius = this.GetSpecialValueFor("hit_radius");
            this.talent_duration = this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_4");
            this.StartIntervalThink(0.05);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.gyroshell = this.GetCasterPlus().FindModifierByName("modifier_pangolier_gyroshell");
            if (this.gyroshell == null) {
                this.Destroy();
                return;
            }
            let enemies_hit = 0;
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.hit_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.IsRealUnit() && !enemy.IsMagicImmune()) {
                    if (!enemy.HasModifier("modifier_pangolier_gyroshell_timeout")) {
                        enemies_hit = enemies_hit + 1;
                        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_7")) {
                            let found = false;
                            for (const v of (this.targets)) {
                                if (v == enemy) {
                                    found = true;
                                    break;
                                }
                            }
                            if (found) {
                                let times_hit = enemy.TempData().hit_times;
                                let extra_damage = this.GetAbilityPlus().GetAbilityDamage();
                                if (times_hit > 1) {
                                    times_hit = times_hit - 1;
                                    for (let i = 0; i < times_hit; i++) {
                                        extra_damage = extra_damage * 2;
                                    }
                                }
                                let damageTable = {
                                    victim: enemy,
                                    damage: extra_damage,
                                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                                    attacker: this.GetCasterPlus(),
                                    ability: this.GetAbilityPlus()
                                }
                                ApplyDamage(damageTable)
                                enemy.TempData().hit_times += 1;
                            } else {
                                enemy.TempData().hit_times = 1;
                                this.targets.push(enemy);
                            }
                        }
                    }
                }
            }
            if (enemies_hit > 0) {
                let time_remaining = this.gyroshell.GetRemainingTime();
                let new_duration = time_remaining + enemies_hit * this.duration_extend;
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_pangolier_gyroshell", {
                    duration: new_duration
                });
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyroshell_impact_check", {
                    duration: new_duration
                });
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_4")) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_gyroshell_linger", {
                    duration: this.talent_duration
                });
            }
            this.GetCasterPlus().StopSound("Imba.PangolierRollin");
            this.GetCasterPlus().SwapAbilities("imba_pangolier_gyroshell", "imba_pangolier_gyroshell_stop", true, false);
        }
    }
}
@registerModifier()
export class modifier_imba_gyroshell_linger extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_pangolier_gyroshell_stop extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_pangolier_gyroshell";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        let gyroshell_ability = this.GetCasterPlus().findAbliityPlus<imba_pangolier_gyroshell>("imba_pangolier_gyroshell");
        if (gyroshell_ability && gyroshell_ability.IsHidden()) {
            this.GetCasterPlus().SwapAbilities("imba_pangolier_gyroshell", "imba_pangolier_gyroshell_stop", true, false);
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_pangolier_gyroshell")) {
            this.GetCasterPlus().RemoveModifierByName("modifier_pangolier_gyroshell");
        }
    }
}
@registerAbility()
export class imba_pangolier_lucky_shot extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_pangolier_lucky_shot";
    }
}
@registerModifier()
export class modifier_imba_pangolier_lucky_shot extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().IsIllusion() && !this.GetParentPlus().PassivesDisabled() && !keys.target.IsMagicImmune() && !keys.target.IsBuilding()) {
            if (GFuncRandom.PRD(this.GetSpecialValueFor("chance_pct"), this)) {
                keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_pangolier_lucky_shot_disarm", {
                    duration: this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance())
                });
                if (keys.target.IsConsideredHero()) {
                    keys.target.EmitSound("Hero_Pangolier.LuckyShot.Proc");
                } else {
                    keys.target.EmitSound("Hero_Pangolier.LuckyShot.Proc.Creep");
                }
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_pangolier/pangolier_luckyshot_disarm_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(particle, 1, keys.target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle);
            }
            if (keys.target.HasModifier("modifier_imba_pangolier_lucky_shot_disarm") || keys.target.HasModifier("modifier_imba_pangolier_lucky_shot_silence")) {
                if (RollPercentage(this.GetSpecialValueFor("heartpiercer_chance"))) {
                    keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_pangolier_lucky_shot_heartpiercer", {
                        duration: this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance())
                    });
                }
                if (keys.target.IsConsideredHero()) {
                    keys.target.EmitSound("Hero_Pangolier.HeartPiercer");
                } else {
                    keys.target.EmitSound("Hero_Pangolier.HeartPiercer.Creep");
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_pangolier_lucky_shot_disarm extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public chance_pct: number;
    public slow: any;
    public armor: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_pangolier/pangolier_luckyshot_disarm_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.chance_pct = this.ability.GetSpecialValueFor("chance_pct");
        this.slow = this.ability.GetSpecialValueFor("slow");
        this.armor = this.ability.GetSpecialValueFor("aromr");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor * (-1);
    }
}
@registerModifier()
export class modifier_imba_pangolier_lucky_shot_silence extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public chance_pct: number;
    public slow: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_pangolier/pangolier_luckyshot_silence_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.chance_pct = this.ability.GetSpecialValueFor("chance_pct");
        this.slow = this.ability.GetSpecialValueFor("slow");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow * (-1);
    }
}
@registerModifier()
export class modifier_imba_pangolier_lucky_shot_heartpiercer extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_pangolier_lucky_shot_status_resist")) {
            this.SetStackCount(this.GetCasterPlus().GetTalentValue("special_bonus_imba_pangolier_lucky_shot_status_resist") * (-1));
        }
    }
    GetTexture(): string {
        return "pangolier_heartpiercer";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_pangolier/pangolier_heartpiercer_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR)
    CC_GetModifierIgnorePhysicalArmor(p_0: ModifierAttackEvent,): number {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_pangolier_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pangolier_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pangolier_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pangolier_lucky_shot_status_resist extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pangolier_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pangolier_8 extends BaseModifier_Plus {
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
