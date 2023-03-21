
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_rubick_telekinesis extends BaseAbility_Plus {
    public telekinesis_marker_pfx: any;
    public target: IBaseNpc_Plus;
    public target_origin: any;
    public target_modifier: modifier_imba_telekinesis;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus() && this.GetCasterPlus().IsRooted()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (target == this.GetCasterPlus() && this.GetCasterPlus().IsRooted()) {
            return "dota_hud_error_ability_disabled_by_root";
        }
    }
    OnSpellStart( /** params */): void {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_telekinesis_caster")) {
            let target_loc = this.GetCursorPosition();
            let maximum_distance;
            if (this.target.GetTeam() == caster.GetTeam()) {
                maximum_distance = this.GetSpecialValueFor("ally_range") + this.GetCasterPlus().GetCastRangeBonus() + caster.GetTalentValue("special_bonus_imba_rubick_4");
            } else {
                maximum_distance = this.GetSpecialValueFor("enemy_range") + this.GetCasterPlus().GetCastRangeBonus() + caster.GetTalentValue("special_bonus_imba_rubick_4");
            }
            if (this.telekinesis_marker_pfx) {
                ParticleManager.DestroyParticle(this.telekinesis_marker_pfx, false);
                ParticleManager.ReleaseParticleIndex(this.telekinesis_marker_pfx);
            }
            let marked_distance = (target_loc - this.target_origin as Vector).Length2D();
            if (marked_distance > maximum_distance) {
                target_loc = this.target_origin + (target_loc - this.target_origin as Vector).Normalized() * maximum_distance;
            }
            this.telekinesis_marker_pfx = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_rubick/rubick_telekinesis_marker.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster, caster.GetTeam());
            ParticleManager.SetParticleControl(this.telekinesis_marker_pfx, 0, target_loc);
            ParticleManager.SetParticleControl(this.telekinesis_marker_pfx, 1, Vector(3, 0, 0));
            ParticleManager.SetParticleControl(this.telekinesis_marker_pfx, 2, this.target_origin);
            ParticleManager.SetParticleControl(this.target_modifier.tele_pfx, 1, target_loc);
            this.target_modifier.final_loc = target_loc;
            this.target_modifier.changed_target = true;
            this.EndCooldown();
        } else {
            this.target = this.GetCursorTarget();
            this.target_origin = this.target.GetAbsOrigin();
            let duration;
            let is_ally = true;
            if (this.target.GetTeam() != caster.GetTeam()) {
                if (this.target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
                duration = this.GetSpecialValueFor("enemy_lift_duration") * (1 - this.target.GetStatusResistance());
                this.target.AddNewModifier(caster, this, "modifier_imba_telekinesis_stun", {
                    duration: duration
                });
                is_ally = false;
            } else {
                duration = this.GetSpecialValueFor("ally_lift_duration") + caster.GetTalentValue("special_bonus_imba_rubick_2");
                this.target.AddNewModifier(caster, this, "modifier_imba_telekinesis_root", {
                    duration: duration
                });
            }
            this.target_modifier = this.target.AddNewModifier(caster, this, "modifier_imba_telekinesis", {
                duration: duration
            }) as modifier_imba_telekinesis;
            if (is_ally) {
                this.target_modifier.is_ally = true;
            }
            this.target_modifier.tele_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_rubick/rubick_telekinesis.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControlEnt(this.target_modifier.tele_pfx, 0, this.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.target_modifier.tele_pfx, 1, this.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.target_modifier.tele_pfx, 2, Vector(duration, 0, 0));
            this.target_modifier.AddParticle(this.target_modifier.tele_pfx, false, false, 1, false, false);
            caster.EmitSound("Hero_Rubick.Telekinesis.Cast");
            this.target.EmitSound("Hero_Rubick.Telekinesis.Target");
            this.target_modifier.final_loc = this.target_origin;
            this.target_modifier.changed_target = false;
            caster.AddNewModifier(caster, this, "modifier_imba_telekinesis_caster", {
                duration: duration + FrameTime()
            });
            this.EndCooldown();
        }
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return "rubick_telekinesis_land";
        }
        return "rubick_telekinesis";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
    GetManaCost(target: number): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return 0;
        } else {
            return super.GetManaCost(target);
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return 25000;
        }
        return this.GetSpecialValueFor("cast_range");
    }
}
@registerModifier()
export class modifier_imba_telekinesis_caster extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    BeDestroy(): void {
        let ability = this.GetAbilityPlus<imba_rubick_telekinesis>();
        if (ability.telekinesis_marker_pfx) {
            ParticleManager.DestroyParticle(ability.telekinesis_marker_pfx, false);
            ParticleManager.ReleaseParticleIndex(ability.telekinesis_marker_pfx);
        }
    }
}
@registerModifier()
export class modifier_imba_telekinesis extends BaseModifierMotionBoth_Plus {
    public parent: IBaseNpc_Plus;
    public z_height: any;
    public duration: number;
    public lift_animation: any;
    public fall_animation: any;
    public current_time: number;
    public frametime: number;
    public transition_end_commenced: any;
    public distance: number;
    public changed_target: any;
    is_ally: boolean;
    tele_pfx: ParticleID;
    final_loc: Vector;
    IsDebuff(): boolean {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return true;
        }
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.z_height = 0;
            this.duration = params.duration;
            this.lift_animation = ability.GetSpecialValueFor("lift_animation");
            this.fall_animation = ability.GetSpecialValueFor("fall_animation");
            this.current_time = 0;
            this.frametime = FrameTime();
            if (!this.BeginMotionOrDestroy()) { return };
            this.AddTimer(FrameTime(), () => {
                this.duration = this.GetRemainingTime();
            });
        }
    }

    EndTransition() {
        if (IsServer()) {
            if (this.transition_end_commenced) {
                return;
            }
            this.transition_end_commenced = true;
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let ally_cooldown_reduction = ability.GetSpecialValueFor("ally_cooldown");
            parent.SetUnitOnClearGround();
            ResolveNPCPositions(parent.GetAbsOrigin(), 64);
            parent.RemoveModifierByName("modifier_imba_telekinesis_stun");
            parent.RemoveModifierByName("modifier_imba_telekinesis_root");
            let parent_pos = parent.GetAbsOrigin();
            let impact_radius = ability.GetSpecialValueFor("impact_radius");
            GridNav.DestroyTreesAroundPoint(parent_pos, impact_radius, true);
            let damage = ability.GetSpecialValueFor("damage");
            let impact_stun_duration = ability.GetSpecialValueFor("impact_stun_duration");
            parent.StopSound("Hero_Rubick.Telekinesis.Target");
            parent.EmitSound("Hero_Rubick.Telekinesis.Target.Land");
            ParticleManager.ReleaseParticleIndex(this.tele_pfx);
            let landing_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_rubick/rubick_telekinesis_land.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(landing_pfx, 0, parent_pos);
            ParticleManager.SetParticleControl(landing_pfx, 1, parent_pos);
            ParticleManager.ReleaseParticleIndex(landing_pfx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), parent_pos, undefined, impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != parent) {
                    enemy.AddNewModifier(caster, ability, "modifier_generic_stunned", {
                        duration: impact_stun_duration * (1 - enemy.GetStatusResistance())
                    });
                }
                ApplyDamage({
                    attacker: caster,
                    victim: enemy,
                    ability: ability,
                    damage: damage,
                    damage_type: ability.GetAbilityDamageType()
                });
            }
            if (GameFunc.GetCount(enemies) > 0 && this.is_ally) {
                parent.EmitSound("Hero_Rubick.Telekinesis.Target.Stun");
            } else if (GameFunc.GetCount(enemies) > 1 && !this.is_ally) {
                parent.EmitSound("Hero_Rubick.Telekinesis.Target.Stun");
            }
            ability.UseResources(true, false, true);
            if (this.is_ally) {
                let current_cooldown = ability.GetCooldownTime();
                ability.EndCooldown();
                ability.StartCooldown(current_cooldown * ally_cooldown_reduction);
            }
        }
    }
    UpdateVerticalMotion(unit: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.current_time = this.current_time + dt;
            let max_height = this.GetSpecialValueFor("max_height");
            if (this.current_time <= this.lift_animation) {
                this.z_height = this.z_height + ((dt / this.lift_animation) * max_height);
                unit.SetAbsOrigin(GetGroundPosition(unit.GetAbsOrigin(), unit) + Vector(0, 0, this.z_height) as Vector);
            } else if (this.current_time > (this.duration - this.fall_animation)) {
                this.z_height = this.z_height - ((dt / this.fall_animation) * max_height);
                if (this.z_height < 0) {
                    this.z_height = 0;
                }
                unit.SetAbsOrigin(GetGroundPosition(unit.GetAbsOrigin(), unit) + Vector(0, 0, this.z_height) as Vector);
            } else {
                max_height = this.z_height;
            }
            if (this.current_time >= this.duration) {
                this.EndTransition();
                this.Destroy();
            }
        }
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.distance = this.distance || 0;
            if ((this.current_time > (this.duration - this.fall_animation))) {
                if (this.changed_target) {
                    let frames_to_end = math.ceil((this.duration - this.current_time) / dt);
                    this.distance = (unit.GetAbsOrigin() - this.final_loc as Vector).Length2D() / frames_to_end;
                    this.changed_target = false;
                }
                if ((this.current_time + dt) >= this.duration) {
                    unit.SetAbsOrigin(this.final_loc);
                    this.EndTransition();
                } else {
                    unit.SetAbsOrigin(unit.GetAbsOrigin() + ((this.final_loc - unit.GetAbsOrigin() as Vector).Normalized() * this.distance) as Vector);
                }
            }
        }
    }
    GetTexture(): string {
        return "rubick_telekinesis";
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.parent.IsAlive()) {
                this.parent.SetUnitOnClearGround();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_telekinesis_stun extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_telekinesis_root extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_rubick_fade_bolt extends BaseAbility_Plus {
    public fade_bolt_particle: any;
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_fade_bolt_cooldown");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let previous_unit = this.GetCasterPlus();
            let current_target = this.GetCursorTarget();
            let entities_damaged: IBaseNpc_Plus[] = [];
            let damage = this.GetSpecialValueFor("damage");
            let kaboom = false;
            if (current_target.GetTeam() != this.GetCasterPlus().GetTeam()) {
                if (current_target.TriggerSpellAbsorb(this)) {
                    return;
                }
            }
            EmitSoundOn("Hero_Rubick.FadeBolt.Cast", this.GetCasterPlus());
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
            this.AddTimer(0, () => {
                entities_damaged.push(current_target);
                let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), current_target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false);
                if (previous_unit != this.GetCasterPlus()) {
                    let damage_increase = this.GetSpecialValueFor("jump_damage_bonus_pct") * (damage / 100);
                    if (this.GetCasterPlus().HasTalent("special_bonus_imba_rubick_5")) {
                        damage_increase = (this.GetSpecialValueFor("jump_damage_bonus_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_5")) * (damage / 100);
                    }
                    damage = damage + damage_increase;
                }
                if (kaboom == true) {
                    let particle_explosion_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_rubick/rubick_fade_bolt_explode.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, current_target);
                    ParticleManager.SetParticleControl(particle_explosion_fx, 0, current_target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_explosion_fx, 1, current_target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_explosion_fx, 2, Vector(this.GetSpecialValueFor("radius"), 1, 1));
                    ParticleManager.ReleaseParticleIndex(particle_explosion_fx);
                    EmitSoundOn("ParticleDriven.Rocket.Explode", current_target);
                    for (const [_, unit] of GameFunc.iPair(units)) {
                        if (unit != current_target) {
                            ApplyDamage({
                                attacker: this.GetCasterPlus(),
                                victim: unit,
                                ability: this,
                                damage: damage / (100 / this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_7")),
                                damage_type: this.GetAbilityDamageType()
                            });
                        }
                    }
                    return;
                }
                ApplyDamage({
                    attacker: this.GetCasterPlus(),
                    victim: current_target,
                    ability: this,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                });
                this.fade_bolt_particle = "particles/units/heroes/hero_rubick/rubick_fade_bolt.vpcf";
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_rubick_3")) {
                    current_target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rubick_fade_bolt_break", {
                        duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_3") * (1 - current_target.GetStatusResistance())
                    });
                }
                let particle = ResHelper.CreateParticleEx(this.fade_bolt_particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, previous_unit);
                ParticleManager.SetParticleControlEnt(particle, 0, previous_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", previous_unit.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 1, current_target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", current_target.GetAbsOrigin(), true);
                EmitSoundOn("Hero_Rubick.FadeBolt.Target", current_target);
                current_target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rubick_fade_bolt", {
                    duration: this.GetSpecialValueFor("duration") * (1 - current_target.GetStatusResistance())
                });
                current_target.TempData().damaged_by_fade_bolt = true;
                previous_unit = current_target;
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit != previous_unit && unit.TempData().damaged_by_fade_bolt != true) {
                        current_target = unit;
                        break;
                    }
                }
                if (previous_unit != current_target) {
                    return this.GetSpecialValueFor("jump_delay");
                } else {
                    for (const [_, damaged] of GameFunc.iPair(entities_damaged)) {
                        damaged.TempData().damaged_by_fade_bolt = false;
                    }
                    if (this.GetCasterPlus().HasTalent("special_bonus_imba_rubick_7")) {
                        kaboom = true;
                        return FrameTime();
                    }
                }
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_rubick_fade_bolt_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_rubick_fade_bolt_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_rubick_fade_bolt_cooldown"), "modifier_special_bonus_imba_rubick_fade_bolt_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_rubick_fade_bolt extends BaseModifier_Plus {
    public hero_attack_damage_reduction: number;
    public creep_attack_damage_reduction: number;
    public frail_mana_cost_increase_pct: number;
    public effect_name: any;
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return this.effect_name;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.hero_attack_damage_reduction = this.GetSpecialValueFor("hero_attack_damage_reduction") * (-1);
        this.creep_attack_damage_reduction = this.GetSpecialValueFor("creep_attack_damage_reduction") * (-1);
        this.frail_mana_cost_increase_pct = this.GetSpecialValueFor("frail_mana_cost_increase_pct") * (-1);
        if (IsServer()) {
            this.effect_name = "particles/units/heroes/hero_rubick/rubick_fade_bolt_debuff.vpcf";
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetParentPlus().IsRealUnit() || (this.GetParentPlus().IsRoshan && this.GetParentPlus().IsRoshan())) {
            return this.hero_attack_damage_reduction;
        } else {
            return this.creep_attack_damage_reduction;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE_STACKING)
    CC_GetModifierPercentageManacostStacking(): number {
        return this.frail_mana_cost_increase_pct;
    }
}
@registerModifier()
export class modifier_imba_rubick_fade_bolt_break extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        };
    }
}
@registerAbility()
export class imba_rubick_null_field extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rubick_null_field_aura";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_6");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_rubick_null_field_aura")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_rubick_null_field_aura");
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rubick_null_field_aura_debuff", {});
                this.GetCasterPlus().EmitSound("Hero_Rubick.NullField.Offense");
            } else if (this.GetCasterPlus().HasModifier("modifier_imba_rubick_null_field_aura_debuff")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_rubick_null_field_aura_debuff");
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rubick_null_field_aura", {});
                this.GetCasterPlus().EmitSound("Hero_Rubick.NullField.Defense");
            }
        }
    }
    GetAbilityTextureName(): string {
        let offensive = this.GetCasterPlus().HasModifier("modifier_imba_rubick_null_field_aura_debuff");
        if (offensive) {
            return "rubick_null_field_offensive";
        }
        return "rubick_null_field";
    }
}
@registerModifier()
export class modifier_imba_rubick_null_field_aura extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_6");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.GetAbilityPlus().GetAbilityTargetFlags();
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_rubick_null_field";
    }
}
@registerModifier()
export class modifier_imba_rubick_null_field_aura_debuff extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_6");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.GetAbilityPlus().GetAbilityTargetFlags();
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_rubick_null_field_debuff";
    }
}
@registerModifier()
export class modifier_imba_rubick_null_field extends BaseModifier_Plus {
    public bonus_magic_resist: number;
    public bonus_status_resistance: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.bonus_magic_resist = this.GetSpecialValueFor("magic_damage_reduction_pct");
        this.bonus_status_resistance = this.GetSpecialValueFor("status_resistance_reduction_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_magic_resist;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.bonus_status_resistance;
    }
}
@registerModifier()
export class modifier_imba_rubick_null_field_debuff extends BaseModifier_Plus {
    public bonus_magic_resist: number;
    public bonus_status_resistance: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.bonus_magic_resist = this.GetSpecialValueFor("magic_damage_reduction_pct") * (-1);
        this.bonus_status_resistance = this.GetSpecialValueFor("status_resistance_reduction_pct") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_magic_resist;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.bonus_status_resistance;
    }
}
@registerAbility()
export class imba_rubick_arcane_supremacy extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura")) {
            return "rubick_null_field_offensive";
        } else {
            return "rubick_null_field";
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rubick_arcane_supremacy";
    }
    OnToggle(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rubick_arcane_supremacy_flip_aura", {});
        } else {
            this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_rubick_arcane_supremacy_flip_aura", this.GetCasterPlus());
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_rubick_remnants_of_null_field") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_rubick_remnants_of_null_field")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_rubick_remnants_of_null_field"), "modifier_special_bonus_imba_rubick_remnants_of_null_field", {});
        }
    }
}
@registerModifier()
export class modifier_imba_rubick_arcane_supremacy extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            4: Enum_MODIFIER_EVENT.ON_MODIFIER_ADDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura")) {
            return this.GetSpecialValueFor("spell_amp") || 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura")) {
            return this.GetSpecialValueFor("status_resistance") || 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_MODIFIER_ADDED, false, true)
    CC_OnModifierAdded(keys: ModifierAddedEvent): void {
        if (this.GetAbilityPlus() && !this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura") && keys.unit && keys.unit.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            for (const modifier of (keys.unit.FindAllModifiers() as IBaseModifier_Plus[])) {
                if (modifier.IsDebuff() && modifier.GetDuration() > 0 && ((modifier.GetCasterPlus() == this.GetCasterPlus()) || (modifier.GetAbilityPlus().GetCasterPlus() == this.GetCasterPlus())) && GameRules.GetGameTime() - modifier.GetCreationTime() <= FrameTime()) {
                    this.AddTimer(FrameTime() * 2, () => {
                        if (modifier && !this.IsNull() && this.GetAbilityPlus()) {
                            modifier.SetDuration((modifier.GetRemainingTime() * (100 + this.GetSpecialValueFor("status_resistance")) * 0.01) - (FrameTime() * 2), true);
                        }
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_rubick_arcane_supremacy_flip_aura extends BaseModifier_Plus {
    radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.radius || this.GetAbilityPlus().GetTalentSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_rubick_arcane_supremacy_flip";
    }
}
@registerModifier()
export class modifier_imba_rubick_arcane_supremacy_flip extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return (this.GetSpecialValueFor("spell_amp") * (-1)) || 0;
    }
}
@registerModifier()
export class modifier_imba_rubick_arcane_supremacy_debuff extends BaseModifier_Plus {
    public status_resistance: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.status_resistance = this.GetSpecialValueFor("status_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.status_resistance * (-1);
    }
}
@registerAbility()
export class imba_rubick_clandestine_librarian extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rubick_clandestine_librarian";
    }
}
@registerModifier()
export class modifier_imba_rubick_clandestine_librarian extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            if (keys.ability.GetAbilityName() == "imba_rubick_spellsteal" && this.GetStackCount() < this.GetSpecialValueFor("max_spell_amp")) {
                this.SetStackCount(this.GetStackCount() + this.GetSpecialValueFor("spell_amp_per_cast"));
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && !this.GetParentPlus().IsReincarnating()) {
            this.SetStackCount(math.ceil(this.GetStackCount() * (100 - this.GetSpecialValueFor("loss_pct")) / 100));
        }
    }
}

class TRubick_animations_reference {
    static animations: [string, boolean, number, string, number?][] = [
        //  AbilityName, bNormalWhenStolen, nActivity, nTranslate, fPlaybackRate
        ["default", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "bolt"],

        ["imba_abaddon_death_coil", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_3, "", 1.4],

        ["imba_axe_berserkers_call", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_3, "", 1.0],

        ["imba_antimage_blink", false, 0, "am_blink"],
        ["imba_antimage_mana_void", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "mana_void"],

        ["imba_bane_brain_sap", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "brain_sap"],
        ["imba_bane_fiends_grip", false, GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_5, "fiends_grip"],

        ["imba_bristleback_viscous_nasal_goo", false, GameActivity_t.ACT_DOTA_ATTACK, "", 2.0],

        ["imba_chaos_knight_chaos_bolt", false, GameActivity_t.ACT_DOTA_ATTACK, "", 2.0],
        ["imba_chaos_knight_reality_rift", true, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "strike", 2.0],
        ["imba_chaos_knight_phantasm", true, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "remnant"],

        ["imba_centaur_warrunner_hoof_stomp", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "slam", 2.0],
        ["imba_centaur_warrunner_double_edge", false, GameActivity_t.ACT_DOTA_ATTACK, "", 2.0],
        ["imba_centaur_warrunner_stampede", false, GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4, "strength"],

        ["imba_crystal_maiden_crystal_nova", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "crystal_nova"],
        ["imba_crystal_maiden_frostbite", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "frostbite"],
        ["imba_crystal_maiden_freezing_field", false, GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_5, "freezing_field"],

        ["imba_dazzle_shallow_grave", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "repel"],
        ["imba_dazzle_shadow_wave", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_3, ""],
        ["imba_dazzle_weave", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "crystal_nova"],

        ["imba_furion_sprout", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "sprout"],
        ["imba_furion_teleportation", true, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "teleport"],
        ["imba_furion_force_of_nature", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "summon"],
        ["imba_furion_wrath_of_nature", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "wrath"],

        ["imba_lina_dragon_slave", false, 0, "wave"],
        ["imba_lina_light_strike_array", false, 0, "lsa"],
        ["imba_lina_laguna_blade", false, 0, "laguna"],

        ["imba_ogre_magi_fireblast", false, 0, "frostbite"],

        ["imba_omniknight_purification", true, 0, "purification", 1.4],
        ["imba_omniknight_repel", false, 0, "repel"],
        ["imba_omniknight_guardian_angel", true, 0, "guardian_angel", 1.3],

        ["imba_phantom_assassin_stifling_dagger", false, GameActivity_t.ACT_DOTA_ATTACK, "", 2.0],
        ["imba_phantom_assassin_shadow_strike", false, 0, "qop_blink"],

        ["imba_queen_of_pain_shadow_strike", false, 0, "shadow_strike"],
        ["imba_queen_of_pain_blink", false, 0, "qop_blink"],
        ["imba_queen_of_pain_scream_of_pain", false, 0, "scream"],
        ["imba_queen_of_pain_sonic_wave", false, 0, "sonic_wave"],

        ["imba_nevermore_shadowraze_close", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "shadowraze", 2.0],
        ["imba_nevermore_shadowraze_medium", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "shadowraze", 2.0],
        ["imba_nevermore_shadowraze_far", false, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "shadowraze", 2.0],
        ["imba_nevermore_requiem_of_souls", true, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "requiem"],

        ["imba_sven_warcry", false, GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3, "strength"],
        ["imba_sven_gods_strength", false, GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4, "strength"],

        ["imba_slardar_slithereen_crush", false, GameActivity_t.ACT_DOTA_MK_SPRING_END, ""],

        ["imba_ursa_earthshock", true, GameActivity_t.ACT_DOTA_CAST_ABILITY_5, "earthshock", 1.7],
        ["imba_ursa_overpower", true, GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3, "overpower"],
        ["imba_ursa_enrage", true, GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4, "enrage"],

        ["imba_vengefulspirit_wave_of_terror", false, 0, "roar"],
        ["imba_vengefulspirit_nether_swap", false, 0, "qop_blink"],
    ];

    current = 1;
    SetCurrentReference(spellName: string) {
        this.current = this.FindReference(spellName)

    }
    SetCurrentReferenceIndex(index: number) {
        this.current = index

    }
    GetCurrentReference() {
        return this.current

    }

    FindReference(spellName: string) {
        for (let v of TRubick_animations_reference.animations) {
            if (v[0] == spellName) {
                return TRubick_animations_reference.animations.indexOf(v);
            }
        }
        return 0;
    }

    IsNormal() {
        return TRubick_animations_reference.animations[this.current][0] || false
    }

    GetActivity(): GameActivity_t {
        return TRubick_animations_reference.animations[this.current][2] || GameActivity_t.ACT_DOTA_CAST_ABILITY_5;

    }
    GetTranslate() {
        return TRubick_animations_reference.animations[this.current][3] || ""

    }
    GetPlaybackRate() {
        return TRubick_animations_reference.animations[this.current][4] || 1

    }
}

interface IRuickHeroData {
    handle: IBaseNpc_Plus;
    primarySpell: IBaseAbility_Plus;
    secondarySpell: IBaseAbility_Plus;
    linkedTalents: string[];
}
@registerAbility()
export class imba_rubick_spellsteal extends BaseAbility_Plus {
    public firstTime: any;
    public failState: any;
    public is_stealing_spell: any;
    public spell_target: any;
    public stolenSpell: any;
    public vortex: any;
    public CurrentSecondarySpell: any;
    public CurrentPrimarySpell: any;
    public CurrentSpellOwner: string;
    heroesData: IRuickHeroData[];
    animations = new TRubick_animations_reference();
    slot1 = "rubick_empty1";
    slot2 = "rubick_empty2"
    banned_abilities = [
        "imba_sniper_headshot",
        "imba_rubick_spellsteal",
        "shredder_chakram",
        "shredder_chakram_2",
        "shredder_return_chakram",
        "shredder_return_chakram_2",
        "monkey_king_wukongs_command",
        "void_spirit_aether_remnant",
    ];
    OnHeroCalculateStatBonus(): void {
        if (this.firstTime) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_rubick_spellsteal_hidden", {});
            this.firstTime = false;
        }
    }
    CastFilterResultTarget(hTarget: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (this.is_stealing_spell == true) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (this.GetLastSpell(hTarget) == undefined) {
                this.failState = "nevercast";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            for (const banned_ability of (this.banned_abilities)) {
                if (this.GetLastSpell(hTarget).primarySpell && this.GetLastSpell(hTarget).primarySpell.GetAbilityName() == banned_ability) {
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                } else if (this.GetLastSpell(hTarget).secondarySpell && this.GetLastSpell(hTarget).secondarySpell.GetAbilityName() == banned_ability) {
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
            }
            if (this.GetCasterPlus().HasAbility("monkey_king_primal_spring") && this.GetLastSpell(hTarget).primarySpell && this.GetLastSpell(hTarget).primarySpell.GetAbilityName() == "monkey_king_tree_dance") {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        let nResult = UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO, this.GetCasterPlus().GetTeamNumber());
        if (nResult != UnitFilterResult.UF_SUCCESS) {
            return nResult;
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetCustomCastErrorTarget(hTarget: CDOTA_BaseNPC): string {
        if (this.failState && this.failState == "nevercast") {
            this.failState = undefined;
            return "Target never casted an ability";
        }
        if (this.is_stealing_spell == true) {
            return "You're already stealing a spell!";
        }
        for (const [_, banned_ability] of GameFunc.iPair(this.banned_abilities)) {
            if (this.GetLastSpell(hTarget).primarySpell && this.GetLastSpell(hTarget).primarySpell.GetAbilityName() == banned_ability) {
                return "#dota_hud_error_spell_steal_banned_ability";
            } else if (this.GetLastSpell(hTarget).secondarySpell && this.GetLastSpell(hTarget).secondarySpell.GetAbilityName() == banned_ability) {
                return "#dota_hud_error_spell_steal_banned_ability";
            }
        }
        if (this.GetCasterPlus().HasAbility("monkey_king_primal_spring") && this.GetLastSpell(hTarget).primarySpell && this.GetLastSpell(hTarget).primarySpell.GetAbilityName() == "monkey_king_tree_dance") {
            return "#dota_hud_error_spell_steal_monkey_king_tree_dance";
        }
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cast_range_scepter");
        } else {
            return super.GetCastRange(vLocation, hTarget);
        }
    }
    GetCooldown(iLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cooldown_scepter");
        } else {
            return super.GetCooldown(iLevel);
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        this.ForgetSpell();
        this.is_stealing_spell = false;
    }
    OnSpellStart(): void {
        this.spell_target = this.GetCursorTarget();
        if (this.spell_target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.is_stealing_spell = true;
        if (this.GetAbilityIndex() == 0) {
            return;
        }
        this.stolenSpell = {}
        this.stolenSpell.stolenFrom = this.GetLastSpell(this.spell_target).handle.GetUnitName();
        this.stolenSpell.primarySpell = this.GetLastSpell(this.spell_target).primarySpell;
        this.stolenSpell.secondarySpell = this.GetLastSpell(this.spell_target).secondarySpell;
        this.stolenSpell.linkedTalents = this.GetLastSpell(this.spell_target).linkedTalents;
        let projectile_name = "particles/units/heroes/hero_rubick/rubick_spell_steal.vpcf";
        let projectile_speed = this.GetSpecialValueFor("projectile_speed");
        let info = {
            Target: this.GetCasterPlus(),
            Source: this.spell_target,
            Ability: this,
            EffectName: projectile_name,
            iMoveSpeed: projectile_speed,
            vSourceLoc: this.spell_target.GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false
        }
        let projectile = ProjectileManager.CreateTrackingProjectile(info);
        let sound_cast = "Hero_Rubick.SpellSteal.Cast";
        EmitSoundOn(sound_cast, this.GetCasterPlus());
        let sound_target = "Hero_Rubick.SpellSteal.Target";
        EmitSoundOn(sound_target, this.spell_target);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        this.is_stealing_spell = false;
        if (this.GetCasterPlus().HasModifier("modifier_imba_rubick_spellsteal")) {
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_rubick_spellsteal");
        }
        this.SetStolenSpell(this.stolenSpell);
        this.stolenSpell = undefined;
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rubick_spellsteal", {
            spell_amp: this.spell_target.GetSpellAmplification(false)
        });
        let sound_cast = "Hero_Rubick.SpellSteal.Complete";
        EmitSoundOn(sound_cast, target);
    }
    SetLastSpell(hHero: IBaseNpc_Plus, hSpell: IBaseAbility_Plus) {
        let primary_ability = undefined;
        let secondary_ability = undefined;
        let secondary: IBaseAbility_Plus = undefined;
        let primary: IBaseAbility_Plus = undefined;
        let linked_talents: string[] = []
        // todo 有问题
        let hero_name = (hHero.GetUnitName().replace("npc_dota_hero_", ""));
        primary_ability = hSpell.GetAssociatedPrimaryAbilities();
        secondary_ability = hSpell.GetAssociatedSecondaryAbilities();
        if (primary_ability != undefined) {
            primary = hHero.FindAbilityByName(primary_ability) as IBaseAbility_Plus;
            secondary = hSpell;
        } else {
            primary = hSpell;
        }
        for (let i = 0; i < 8; i++) {
            let talent = hHero.FindAbilityByName("special_bonus_imba_" + hero_name + "_" + i);
            if (talent && talent.IsTrained()) {
                // for (const [k, v] of GameFunc.iPair(talent.GetAbilityKeyValues())) {
                //     if (k == "LinkedAbility") {
                //         if ((primary && v["01"] == primary.GetAbilityName()) || (secondary && v["01"] == secondary.GetAbilityName())) {
                //             linked_talents.push( talent.GetAbilityName());
                //         }
                //     }
                // }
            }
        }
        if (secondary_ability != undefined) {
            secondary = hHero.FindAbilityByName(secondary_ability) as IBaseAbility_Plus;
        }
        let heroData: IRuickHeroData = undefined;
        for (const data of (this.heroesData)) {
            if (data.handle == hHero) {
                heroData = data;
                break;
            }
        }
        if (heroData) {
            heroData.primarySpell = primary;
            heroData.secondarySpell = secondary;
            heroData.linkedTalents = linked_talents;
        } else {
            let newData = {} as IRuickHeroData;
            newData.handle = hHero;
            newData.primarySpell = primary;
            newData.secondarySpell = secondary;
            newData.linkedTalents = linked_talents;
            this.heroesData.push(newData);
        }
    }
    GetLastSpell(hHero: IBaseNpc_Plus) {
        let heroData = undefined;
        for (const [_, data] of GameFunc.iPair(this.heroesData)) {
            if (data.handle == hHero) {
                heroData = data;
                break;
            }
        }
        if (heroData) {
            return heroData;
        }
    }
    PrintStatus() {
        // print("Heroes and spells:");
        for (const [_, heroData] of GameFunc.iPair(this.heroesData)) {
            if (heroData.primarySpell != undefined) {
                print(heroData.handle.GetUnitName(), heroData.handle, heroData.primarySpell.GetAbilityName(), heroData.primarySpell);
            }
            if (heroData.secondarySpell != undefined) {
                print(heroData.handle.GetUnitName(), heroData.handle, heroData.secondarySpell.GetAbilityName(), heroData.secondarySpell);
            }
        }
    }
    SetStolenSpell(spellData: any) {
        if (!spellData) {
            return;
        }
        let primarySpell = spellData.primarySpell as IBaseAbility_Plus;
        let secondarySpell = spellData.secondarySpell as IBaseAbility_Plus;
        let linkedTalents = spellData.linkedTalents as string[];
        if (this.GetCasterPlus().HasAbility("monkey_king_primal_spring")) {
            this.GetCasterPlus().RemoveAbility("monkey_king_primal_spring");
        }
        this.ForgetSpell();
        if (this.CurrentSpellOwner.includes("phoenix")) {
            if (secondarySpell.GetAbilityName() == "imba_phoenix_icarus_dive_stop") {
                secondarySpell.SetHidden(true);
            }
            this.GetCasterPlus().AddAbility("imba_phoenix_sun_ray_stop");
        } else if (this.CurrentSpellOwner.includes("storm_spirit")) {
            this.vortex = this.GetCasterPlus().AddAbility("imba_storm_spirit_electric_vortex");
            this.vortex.SetLevel(4);
            this.vortex.SetStolen(true);
        }
        if (this.GetCasterPlus().HasAbility("monkey_king_primal_spring_early")) {
            this.GetCasterPlus().RemoveAbility("monkey_king_primal_spring_early");
        }
        if (primarySpell.GetAbilityName() == "monkey_king_tree_dance") {
            this.CurrentSecondarySpell = this.GetCasterPlus().AddAbility("monkey_king_primal_spring");
            this.CurrentSecondarySpell.SetLevel(primarySpell.GetLevel());
            this.GetCasterPlus().SwapAbilities(this.slot2, this.CurrentSecondarySpell.GetAbilityName(), false, true);
        }
        if (this.GetCasterPlus().HasModifier("modifier_leshrac_lightning_storm_scepter_thinker")) {
            this.GetCasterPlus().RemoveModifierByName("modifier_leshrac_lightning_storm_scepter_thinker");
        }
        if (secondarySpell != undefined && !secondarySpell.IsNull() && secondarySpell.GetAbilityName() == "leshrac_lightning_storm") {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), secondarySpell, "modifier_leshrac_lightning_storm_scepter_thinker", {});
        }
        if (primarySpell != undefined && !primarySpell.IsNull()) {
            this.CurrentPrimarySpell = this.GetCasterPlus().AddAbility(primarySpell.GetAbilityName());
            this.CurrentPrimarySpell.SetLevel(primarySpell.GetLevel());
            this.CurrentPrimarySpell.SetStolen(true);
            if (this.CurrentPrimarySpell.OnStolen) {
                this.CurrentPrimarySpell.OnStolen(this.CurrentPrimarySpell);
            }
            if (this.CurrentPrimarySpell.IsHiddenWhenStolen()) {
                this.CurrentPrimarySpell.SetHidden(true);
            }
            this.GetCasterPlus().SwapAbilities(this.slot1, this.CurrentPrimarySpell.GetAbilityName(), false, true);
        }
        if (secondarySpell != undefined && !secondarySpell.IsNull()) {
            this.CurrentSecondarySpell = this.GetCasterPlus().AddAbility(secondarySpell.GetAbilityName());
            this.CurrentSecondarySpell.SetLevel(secondarySpell.GetLevel());
            this.CurrentSecondarySpell.SetStolen(true);
            if (this.CurrentSecondarySpell.OnStolen) {
                this.CurrentSecondarySpell.OnStolen(this.CurrentPrimarySpell);
            }
            if (this.CurrentSecondarySpell.IsHiddenWhenStolen()) {
                this.CurrentSecondarySpell.SetHidden(true);
            }
            this.GetCasterPlus().SwapAbilities(this.slot2, this.CurrentSecondarySpell.GetAbilityName(), false, true);
            if (this.CurrentSecondarySpell.GetAbilityName() == "tiny_toss_tree") {
                this.CurrentSecondarySpell.SetHidden(true);
            }
        }
        for (const talent of (linkedTalents)) {
            let talent_handle = this.GetCasterPlus().AddAbility(talent);
            talent_handle.SetLevel(1);
            talent_handle.SetStolen(true);
        }
        if (this.CurrentPrimarySpell != undefined) {
            this.animations.SetCurrentReference(this.CurrentPrimarySpell.GetAbilityName());
            if (!this.animations.IsNormal()) {
            }
            this.CurrentSpellOwner = spellData.stolenFrom;
        }
        if (this.GetCasterPlus().HasAbility("monkey_king_primal_spring_early")) {
            this.GetCasterPlus().findAbliityPlus("monkey_king_primal_spring_early").SetHidden(true);
        }
    }
    ForgetSpell() {
        if (this.CurrentSpellOwner != undefined) {
            for (let i = 0; i <= this.GetCasterPlus().GetModifierCount() - 1; i++) {
                if (this.GetCasterPlus().GetModifierNameByIndex(i).includes(this.CurrentSpellOwner.replace("npc_dota_hero_", ""))) {
                    this.GetCasterPlus().RemoveModifierByName(this.GetCasterPlus().GetModifierNameByIndex(i));
                }
            }
            for (let i = 0; i <= this.GetCasterPlus().GetAbilityCount() - 1; i++) {
                let talent = this.GetCasterPlus().FindAbilityByName("special_bonus_imba_" + this.CurrentSpellOwner.replace("npc_dota_hero_", "") + "_" + i);
                if (talent) {
                    this.GetCasterPlus().RemoveAbility(talent.GetAbilityName());
                }
            }
        }
        if (this.CurrentPrimarySpell != undefined && !this.CurrentPrimarySpell.IsNull()) {
            if (this.CurrentPrimarySpell.OnUnStolen) {
                this.CurrentPrimarySpell.OnUnStolen();
            }
            this.GetCasterPlus().SwapAbilities(this.slot1, this.CurrentPrimarySpell.GetAbilityName(), true, false);
            this.GetCasterPlus().RemoveAbility(this.CurrentPrimarySpell.GetAbilityName());
            if (this.CurrentSecondarySpell != undefined && !this.CurrentSecondarySpell.IsNull()) {
                if (this.CurrentSecondarySpell.OnUnStolen) {
                    this.CurrentSecondarySpell.OnUnStolen();
                }
                this.GetCasterPlus().SwapAbilities(this.slot2, this.CurrentSecondarySpell.GetAbilityName(), true, false);
                this.GetCasterPlus().RemoveAbility(this.CurrentSecondarySpell.GetAbilityName());
            }
            this.CurrentPrimarySpell = undefined;
            this.CurrentSecondarySpell = undefined;
            this.CurrentSpellOwner = undefined;
        }
    }
    AbilityConsiderations() {
        // let bScepter = caster.HasScepter();
        // let bBlocked = target.TriggerSpellAbsorb(this);
        // let bBroken = caster.PassivesDisabled();
        // let bInvulnerable = target.IsInvulnerable();
        // let bInvisible = target.IsInvisible();
        // let bHexed = target.IsHexed();
        // let bMagicImmune = target.IsMagicImmune();
        // let bIllusion = target.IsIllusion();
    }
}
@registerModifier()
export class modifier_rubick_spellsteal_hidden extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
    }
    BeRefresh(kv: any): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus() && (!params.ability.IsItem())) {
                return;
            }
            if (params.unit.IsIllusion()) {
                return;
            }
            if (!params.ability.IsStealable()) {
                return;
            }
            if (params.ability.GetAbilityName().includes("item_")) {
                return;
            }
            this.GetAbilityPlus<imba_rubick_spellsteal>().SetLastSpell(params.unit, params.ability as IBaseAbility_Plus);
        }
    }
}
@registerModifier()
export class modifier_imba_rubick_spellsteal extends BaseModifier_Plus {
    public stolen_spell_amp: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsClient()) {
            return;
        }
        if (kv.spell_amp == undefined) {
            return;
        }
        this.stolen_spell_amp = kv.spell_amp * 100;
        this.SetStackCount(this.stolen_spell_amp);
    }
    BeRefresh(kv: any): void {
        if (IsClient()) {
            return;
        }
        this.SetStackCount(this.stolen_spell_amp);
    }
    BeDestroy( /** kv */): void {
        if (!IsServer()) {
            return;
        }
        this.GetAbilityPlus<imba_rubick_spellsteal>().ForgetSpell();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_START,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_START)
    CC_OnAbilityStart(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus()) {

                if (bit.band((params.ability as IBaseAbility_Plus).GetBehaviorInt(), DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN) != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN) {
                    params.ability.SetOverrideCastPoint(0);
                }
                if (params.ability == this.GetAbilityPlus<imba_rubick_spellsteal>().CurrentPrimarySpell) {
                    let modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_rubick_spellsteal_animation", this.GetParentPlus());
                    if (modifier) {
                        modifier.Destroy();
                    }
                    let anim_duration = math.max(1.5, params.ability.GetCastPoint());
                    if (params.ability.GetChannelTime() > 0) {
                        anim_duration = params.ability.GetChannelTime();
                    }
                    let animate = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_rubick_spellsteal_animation", {
                        duration: anim_duration,
                        spellName: params.ability.GetAbilityName()
                    });
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(keys: ModifierAttackEvent): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_rubick_spell_steal_spell_amp") && keys && keys.inflictor && keys.inflictor.IsStolen()) {
            return math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_spell_steal_spell_amp"), this.GetStackCount());
        } else if (this.GetCasterPlus().HasScepter()) {
            return this.GetStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_rubick_spellsteal_animation extends BaseModifier_Plus {
    public spellName: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.spellName = kv.spellName;
            this.SetStackCount(this.GetAbilityPlus<imba_rubick_spellsteal>().animations.GetCurrentReference());
        }
        if (!IsServer()) {
            this.GetAbilityPlus<imba_rubick_spellsteal>().animations.SetCurrentReferenceIndex(this.GetStackCount());
        }
    }
    BeRefresh(kv: any): void {
    }
    BeDestroy( /** kv */): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            4: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return this.GetAbilityPlus<imba_rubick_spellsteal>().animations.GetActivity();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    CC_GetOverrideAnimationRate(): number {
        return this.GetAbilityPlus<imba_rubick_spellsteal>().animations.GetPlaybackRate();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return this.GetAbilityPlus<imba_rubick_spellsteal>().animations.GetTranslate();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(params: ModifierUnitEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus()) {
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_rubick_fade_bolt_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_rubick_remnants_of_null_field extends BaseModifier_Plus {
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
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_rubick_remnants_of_null_field"), "modifier_special_bonus_imba_rubick_remnants_of_null_field_negative_aura", {});
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetCasterPlus().GetTalentValue) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_remnants_of_null_field", "radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_special_bonus_imba_rubick_remnants_of_null_field_positive";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return !this.GetCasterPlus().GetTalentValue || this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura");
    }
}
@registerModifier()
export class modifier_special_bonus_imba_rubick_remnants_of_null_field_positive extends BaseModifier_Plus {
    public magic_resistance: any;
    GetTexture(): string {
        return "rubick_null_field";
    }
    BeCreated(p_0: any,): void {
        this.magic_resistance = this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_remnants_of_null_field", "magic_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.GetCasterPlus() || this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura")) {
            this.Destroy();
            return 0;
        } else {
            return this.magic_resistance;
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_rubick_remnants_of_null_field_negative_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetCasterPlus().GetTalentValue) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_remnants_of_null_field", "radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_special_bonus_imba_rubick_remnants_of_null_field_negative";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return !this.GetCasterPlus().GetTalentValue || !this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura");
    }
}
@registerModifier()
export class modifier_special_bonus_imba_rubick_remnants_of_null_field_negative extends BaseModifier_Plus {
    public magic_resistance: any;
    GetTexture(): string {
        return "rubick_null_field_offensive";
    }
    BeCreated(p_0: any,): void {
        this.magic_resistance = this.GetCasterPlus().GetTalentValue("special_bonus_imba_rubick_remnants_of_null_field", "magic_resistance") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.GetCasterPlus() || !this.GetCasterPlus().HasModifier("modifier_imba_rubick_arcane_supremacy_flip_aura")) {
            this.Destroy();
            return 0;
        } else {
            return this.magic_resistance;
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_rubick_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_rubick_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_rubick_spell_steal_spell_amp extends BaseModifier_Plus {
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
