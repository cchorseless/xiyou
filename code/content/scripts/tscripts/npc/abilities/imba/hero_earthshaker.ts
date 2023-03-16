
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_earthshaker_fissure extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let damage = this.GetAbilityDamage();
        let distance = this.GetCastRange(point, caster) + GPropertyCalculate.GetCastRangeBonus(caster);
        let duration = this.GetSpecialValueFor("fissure_duration");
        let radius = this.GetSpecialValueFor("fissure_radius");
        let stun_duration = this.GetSpecialValueFor("stun_duration");
        let block_width = 24;
        let block_delta = 8.25;
        if (caster.HasTalent("special_bonus_imba_unique_earthshaker_3")) {
            distance = distance + caster.GetTalentValue("special_bonus_imba_unique_earthshaker_3");
        }
        let direction = point - caster.GetOrigin() as Vector;
        direction.z = 0;
        direction = direction.Normalized();
        let wall_vector = direction * distance;
        let block_spacing = (block_delta + 2 * block_width);
        let blocks = distance / block_spacing;
        let block_pos = caster.GetHullRadius() + block_delta + block_width;
        let start_pos = caster.GetOrigin() + direction * block_pos as Vector;
        for (let i = 0; i < blocks; i++) {
            let block_vec = caster.GetOrigin() + direction * block_pos as Vector;
            let blocker = BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_earthshaker_fissure_thinker", {
                duration: duration
            }, block_vec, caster.GetTeamNumber(), true);
            blocker.SetHullRadius(block_width);
            block_pos = block_pos + block_spacing;
        }
        let end_pos = start_pos + wall_vector as Vector;
        let units = FindUnitsInLine(caster.GetTeamNumber(), start_pos, end_pos, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
        let damageTable: ApplyDamageOptions = {
            attacker: caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this,
            victim: null
        }
        for (const [_, unit] of GameFunc.iPair(units)) {
            FindClearSpaceForUnit(unit, unit.GetOrigin(), true);
            if (unit.GetTeamNumber() != caster.GetTeamNumber() && !unit.IsMagicImmune()) {
                damageTable.victim = unit;
                ApplyDamage(damageTable);
                unit.AddNewModifier(caster, this, "modifier_stunned", {
                    duration: stun_duration * (1 - unit.GetStatusResistance())
                });
            }
        }
        this.PlayEffects(start_pos, end_pos, duration);
    }
    PlayEffects(start_pos: Vector, end_pos: Vector, duration: number) {
        let effect_cast = ResHelper.CreateParticleEx("particles/econ/items/earthshaker/earthshaker_ti9/earthshaker_fissure_ti9.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(effect_cast, 0, start_pos);
        ParticleManager.SetParticleControl(effect_cast, 1, end_pos);
        ParticleManager.SetParticleControl(effect_cast, 2, Vector(duration, 0, 0));
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOnLocationWithCaster(start_pos, "Hero_EarthShaker.Fissure", this.GetCasterPlus());
        EmitSoundOnLocationWithCaster(end_pos, "Hero_EarthShaker.Fissure", this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_imba_earthshaker_fissure_thinker extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        let units = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, 200, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
    }
    BeDestroy( /** kv */): void {
        if (IsServer()) {
            let sound_cast = "Hero_EarthShaker.FissureDestroy";
            EmitSoundOnLocationWithCaster(this.GetParentPlus().GetOrigin(), sound_cast, this.GetCasterPlus());
            GFuncEntity.SafeDestroyUnit(this.GetParentPlus());
        }
    }
}
@registerModifier()
export class modifier_imba_earthshaker_fissure_prevent_movement extends BaseModifier_Plus {
    public movement_capability: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetParentPlus().IsRealUnit() && !this.GetParentPlus().IsControllableByAnyPlayer()) {
                this.movement_capability = 0;
                if (this.GetParentPlus().HasGroundMovementCapability()) {
                    this.movement_capability = 1;
                } else if (this.GetParentPlus().HasFlyMovementCapability()) {
                    this.movement_capability = 2;
                }
                this.GetParentPlus().SetMoveCapability(0);
            }
        }
    }
    BeDestroy( /** kv */): void {
        if (IsServer() && this.movement_capability) {
            this.GetParentPlus().SetMoveCapability(this.movement_capability);
        }
    }
}
@registerAbility()
export class imba_earthshaker_enchant_totem extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("distance_scepter");
        }
        return super.GetCastRange(vLocation, hTarget);
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_earthshaker");
    }
    CastFilterResultLocation(vLocation: Vector): UnitFilterResult {
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().IsRooted()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorLocation(vLocation: Vector): string {
        return "dota_hud_error_ability_disabled_by_root";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target != this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_OBSTRUCTED;
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus() != this.GetCursorTarget()) {
            this.SetOverrideCastPoint(0);
        }
        return true;
    }
    OnSpellStart(): void {
        if (IsClient()) {
            return;
        }
        if (this.GetCastPoint() == 0) {
            this.SetOverrideCastPoint(this.GetSpecialValueFor("AbilityCastPoint"));
        }
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus() != this.GetCursorTarget()) {
            this.GetCasterPlus().FaceTowards(this.GetCursorPosition());
            let modifier_movement_handler = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this,
                "modifier_imba_earthshaker_enchant_totem_leap", {
                duration: 1,
                x: this.GetCursorPosition().x,
                y: this.GetCursorPosition().y,
                z: this.GetCursorPosition().z
            }) as modifier_imba_earthshaker_enchant_totem_leap;
            if (modifier_movement_handler) {
                modifier_movement_handler.target_point = this.GetCursorPosition();
            }
        } else {
            EmitSoundOn("Hero_EarthShaker.Totem", this.GetCasterPlus());
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_earthshaker_enchant_totem", {
                duration: this.GetDuration()
            });
            if (this.GetCasterPlus().HasScepter()) {
                if (this.GetCasterPlus().HasModifier("modifier_imba_earthshaker_aftershock")) {
                    this.GetCasterPlus().findBuff<modifier_imba_earthshaker_aftershock>("modifier_imba_earthshaker_aftershock").CastAftershock();
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_unique_earthshaker") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_unique_earthshaker")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_unique_earthshaker"), "modifier_special_bonus_imba_unique_earthshaker", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_earthshaker_bonus_magic_resistance") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_earthshaker_bonus_magic_resistance")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_earthshaker_bonus_magic_resistance"), "modifier_special_bonus_imba_earthshaker_bonus_magic_resistance", {});
        }
    }
}
@registerModifier()
export class modifier_imba_earthshaker_enchant_totem extends BaseModifier_Plus {
    public bonus: number;
    public bonus_attack_range: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.bonus = this.GetSpecialValueFor("totem_damage_percentage");
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range");
        if (IsServer()) {
            this.PlayEffects();
        }
    }
    BeRefresh(kv: any): void {
        this.bonus = this.GetSpecialValueFor("totem_damage_percentage");
    }
    BeDestroy( /** kv */): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "enchant_totem";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_2;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK)
    CC_GetModifierProcAttack_Feedback(params: ModifierAttackEvent): number {
        if (IsServer()) {
            EmitSoundOn("Hero_EarthShaker.Totem.Attack", params.target);
            this.Destroy();
            return 0;
        }
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.bonus_attack_range;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
        return state;
    }
    PlayEffects() {
        let particle_cast = this.GetParentPlus().TempData().enchant_totem_buff_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_totem_buff.vpcf";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        let attach = "attach_attack1";
        if (this.GetCasterPlus().ScriptLookupAttachment("attach_totem") != 0) {
            attach = "attach_totem";
        }
        ParticleManager.SetParticleControlEnt(effect_cast, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach, Vector(0, 0, 0), true);
        this.AddParticle(effect_cast, false, false, -1, false, false);
        let effect_cast2 = ResHelper.CreateParticleEx(this.GetParentPlus().TempData().enchant_totem_cast_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_totem_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(effect_cast2);
    }
}
@registerModifier()
export class modifier_imba_earthshaker_enchant_totem_movement extends BaseModifierMotionBoth_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public scepter_height: any;
    public blur_effect: any;
    public time_elapsed: number;
    public leap_z: any;
    public jump_time: number;
    public direction: any;
    public jump_speed: number;
    public enchant_totem_land_commenced: any;
    public target_point: Vector;

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
        return 2;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.scepter_height = this.ability.GetSpecialValueFor("scepter_height");
        if (IsServer()) {
            this.blur_effect = ResHelper.CreateParticleEx(this.GetParentPlus().TempData().enchant_totem_leap_blur_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_totem_leap_blur.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            this.time_elapsed = 0;
            this.leap_z = 0;
            this.AddTimer(FrameTime(), () => {
                this.jump_time = this.ability.GetSpecialValueFor("duration");
                this.direction = (this.target_point - this.caster.GetAbsOrigin() as Vector).Normalized();
                let distance = (this.caster.GetAbsOrigin() - this.target_point as Vector).Length2D();
                this.jump_speed = distance / this.jump_time;
                if (!this.BeginMotionOrDestroy()) { return; }
            });
        }
    }

    EnchantTotemLand() {
        if (IsServer()) {
            if (this.enchant_totem_land_commenced) {
                return;
            }
            if (this.blur_effect) {
                ParticleManager.DestroyParticle(this.blur_effect, false);
                ParticleManager.ReleaseParticleIndex(this.blur_effect);
            }
            this.enchant_totem_land_commenced = true;
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_earthshaker_enchant_totem", {
                duration: this.GetAbilityPlus().GetDuration()
            });
            EmitSoundOn("Hero_EarthShaker.Totem", this.GetParentPlus());
            this.GetParentPlus().SetUnitOnClearGround();
            ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 150);
            if (this.GetParentPlus().HasModifier("modifier_imba_earthshaker_aftershock")) {
                this.GetParentPlus().findBuff<modifier_imba_earthshaker_aftershock>("modifier_imba_earthshaker_aftershock").CastAftershock();
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().SetUnitOnClearGround();
            this.EnchantTotemLand();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "ultimate_scepter";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.time_elapsed = this.time_elapsed + dt;
            if (this.time_elapsed < this.jump_time) {
                let new_location = this.caster.GetAbsOrigin() + this.direction * this.jump_speed * dt as Vector;
                this.caster.SetAbsOrigin(new_location);
            } else {
                this.Destroy();
            }
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.time_elapsed < this.jump_time) {
                if (this.time_elapsed <= this.jump_time / 2) {
                    this.leap_z = this.leap_z + 60;
                    this.caster.SetAbsOrigin(GetGroundPosition(this.caster.GetAbsOrigin(), this.caster) + Vector(0, 0, this.leap_z) as Vector);
                } else {
                    this.leap_z = this.leap_z - 60;
                    if (this.leap_z > 0) {
                        this.caster.SetAbsOrigin(GetGroundPosition(this.caster.GetAbsOrigin(), this.caster) + Vector(0, 0, this.leap_z) as Vector);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_earthshaker_enchant_totem_leap extends BaseModifierMotionBoth_Plus {
    public destination: any;
    public vector: any;
    public direction: any;
    public speed: number;
    public aftershock_interrupt: any;
    public target_point: Vector;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (!this.BeginMotionOrDestroy()) { return; }
        this.destination = Vector(params.x, params.y, params.z);
        this.vector = (this.destination - this.GetParentPlus().GetAbsOrigin());
        this.direction = this.vector.Normalized();
        this.speed = this.vector.Length2D() / this.GetDuration();
    }


    BeDestroy( /** kv */): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().InterruptMotionControllers(true);
        if (!this.aftershock_interrupt) {
            EmitSoundOn("Hero_EarthShaker.Totem", this.GetCasterPlus());
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_earthshaker_enchant_totem", {
                duration: this.GetAbilityPlus().GetDuration()
            });
            if (this.GetParentPlus().HasModifier("modifier_imba_earthshaker_aftershock")) {
                this.GetParentPlus().findBuff<modifier_imba_earthshaker_aftershock>("modifier_imba_earthshaker_aftershock").CastAftershock();
            }
        }
    }

    OnHorizontalMotionInterrupted(): void {
        if (IsServer() && this.GetRemainingTime() > 0) {
            this.aftershock_interrupt = true;
        }
    }
    OnVerticalMotionInterrupted(): void {
        if (IsServer()) {
            this.aftershock_interrupt = true;
            this.Destroy();
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let z_axis = (-1) * this.GetElapsedTime() * (this.GetElapsedTime() - this.GetDuration()) * 562 * 4;
        this.GetParentPlus().SetOrigin((this.GetParentPlus().GetOrigin() * Vector(1, 1, 0)) + (((this.direction * this.speed * dt) * Vector(1, 1, 0)) + (Vector(0, 0, GetGroundHeight(this.GetParentPlus().GetOrigin(), undefined)) + Vector(0, 0, z_axis))) as Vector);
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let z_axis = (-1) * this.GetElapsedTime() * (this.GetElapsedTime() - this.GetDuration()) * 562 * 4;
        this.GetParentPlus().SetOrigin((this.GetParentPlus().GetOrigin() * Vector(1, 1, 0)) + (((this.direction * this.speed * dt) * Vector(1, 1, 0)) + (Vector(0, 0, GetGroundHeight(this.GetParentPlus().GetOrigin(), undefined)) + Vector(0, 0, z_axis))) as Vector);
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "ultimate_scepter";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
}
@registerAbility()
export class imba_earthshaker_aftershock extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_earthshaker_aftershock";
    }
}
@registerModifier()
export class modifier_imba_earthshaker_aftershock extends BaseModifier_Plus {
    public radius: number;
    public duration: number;
    public damageTable: ApplyDamageOptions;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("aftershock_range");
        if (IsServer()) {
            let damage = this.GetAbilityPlus().GetAbilityDamage();
            this.duration = this.GetAbilityPlus().GetDuration();
            this.damageTable = {
                attacker: this.GetCasterPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.GetAbilityPlus(),
                victim: null
            }
        }
    }
    BeRefresh(kv: any): void {
        this.radius = this.GetSpecialValueFor("aftershock_range");
        if (IsServer()) {
            let damage = this.GetAbilityPlus().GetAbilityDamage();
            this.duration = this.GetAbilityPlus().GetDuration();
            this.damageTable.damage = damage;
        }
    }
    BeDestroy( /** kv */): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            if (params.unit != this.GetParentPlus() || params.ability.IsItem()) {
                return;
            }
            print(params.ability.GetAbilityName());
            if (this.GetParentPlus().HasScepter() && params.ability.GetAbilityName() == "imba_earthshaker_enchant_totem" || params.ability.GetAbilityName() == "ability_capture") {
                return;
            }
            this.CastAftershock();
        }
    }
    CastAftershock() {
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                duration: this.duration * (1 - enemy.GetStatusResistance())
            });
            this.damageTable.victim = enemy;
            ApplyDamage(this.damageTable);
        }
        this.AddTimer(FrameTime(), () => {
            this.PlayEffects();
        });
    }
    PlayEffects() {
        let particle_cast = this.GetParentPlus().TempData().aftershock_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_aftershock.vpcf";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(effect_cast, 1, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(effect_cast);
    }
}
@registerAbility()
export class imba_earthshaker_echo_slam extends BaseAbility_Plus {
    OnSpellStart(): void {
        let hero_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("echo_slam_damage_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(hero_enemies) > 0) {
            this.GetCasterPlus().EmitSound("Hero_EarthShaker.EchoSlam");
        } else {
            this.GetCasterPlus().EmitSound("Hero_EarthShaker.EchoSlamSmall");
        }
        this.AddTimer(0.5, () => {
            if (this.GetCasterPlus().GetUnitName().includes("earthshaker")) {
                if (GameFunc.GetCount(hero_enemies) == 2) {
                    let random_response = RandomInt(1, 4);
                    if (random_response >= 3) {
                        random_response = random_response + 1;
                    }
                    this.GetCasterPlus().EmitSound("earthshaker_erth_ability_echo_0" + random_response);
                } else if (GameFunc.GetCount(hero_enemies) >= 3) {
                    this.GetCasterPlus().EmitSound("earthshaker_erth_ability_echo_03");
                } else if (GameFunc.GetCount(hero_enemies) == 0) {
                    this.GetCasterPlus().EmitSound("earthshaker_erth_ability_echo_0" + (RandomInt(6, 7)));
                }
            }
        });
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("echo_slam_damage_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let effect_counter = 0;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                damage: this.GetSpecialValueFor("echo_slam_initial_damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            let echo_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), enemy.GetAbsOrigin(), undefined, this.GetSpecialValueFor("echo_slam_echo_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, echo_enemy] of GameFunc.iPair(echo_enemies)) {
                if (echo_enemy != enemy) {
                    echo_enemy.EmitSound("Hero_EarthShaker.EchoSlamEcho");
                    let projectile = {
                        Target: echo_enemy,
                        Source: enemy,
                        Ability: this,
                        EffectName: this.GetCasterPlus().TempData().echo_slam_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_echoslam.vpcf",
                        iMoveSpeed: 600,
                        vSourceLoc: enemy.GetAbsOrigin(),
                        bDrawsOnMinimap: false,
                        bDodgeable: false,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 10.0,
                        bProvidesVision: false,
                        ExtraData: {
                            damage: this.GetTalentSpecialValueFor("echo_slam_echo_damage")
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(projectile);
                    if (echo_enemy.IsRealUnit()) {
                        effect_counter = effect_counter + 1;
                        ProjectileManager.CreateTrackingProjectile(projectile);
                        this.AddTimer(0.1, () => {
                            let echo_slam_death_pfx = ResHelper.CreateParticleEx(this.GetCasterPlus().TempData().echo_slam_tgt_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_echoslam_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, echo_enemy);
                            ParticleManager.SetParticleControl(echo_slam_death_pfx, 6, Vector(math.min(effect_counter, 1), math.min(effect_counter, 1), math.min(effect_counter, 1)));
                            ParticleManager.SetParticleControl(echo_slam_death_pfx, 10, Vector(4, 0, 0));
                            ParticleManager.ReleaseParticleIndex(echo_slam_death_pfx);
                        });
                    }
                }
            }
        }
        let echo_slam_particle = ResHelper.CreateParticleEx(this.GetCasterPlus().TempData().echo_slam_start_pfx || "particles/units/heroes/hero_earthshaker/earthshaker_echoslam_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(echo_slam_particle, 10, Vector(4, 0, 0));
        ParticleManager.SetParticleControl(echo_slam_particle, 11, Vector(math.min(effect_counter, 1), math.min(effect_counter, 1), 0));
        ParticleManager.ReleaseParticleIndex(echo_slam_particle);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target && !target.IsMagicImmune()) {
            let damageTable = {
                victim: target,
                damage: data.damage,
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
        }
    }
}
@registerModifier()
export class modifier_earthshaker_arcana extends BaseModifier_Plus {
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_unique_earthshaker extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_earthshaker_bonus_magic_resistance extends BaseModifier_Plus {
    public magic_resistance: any;
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
        this.magic_resistance = this.GetParentPlus().GetTalentValue("special_bonus_imba_earthshaker_bonus_magic_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.magic_resistance;
    }
}
