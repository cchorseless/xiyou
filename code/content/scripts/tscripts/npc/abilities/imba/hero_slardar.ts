
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_generic_stunned } from "../../modifier/effect/modifier_generic_stunned";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_slardar_sprint extends BaseAbility_Plus {
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
    GetAbilityTextureName(): string {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sprint_buff = "modifier_imba_slardar_sprint_buff";
        if (caster.HasModifier(sprint_buff)) {
            return "slardar_forward_propel";
        } else {
            return "slardar_sprint";
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_slardar_sprint_river";
    }
    GetCooldown(p_0: number,): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sprint_buff = "modifier_imba_slardar_sprint_buff";
        let rip_current_cd = ability.GetSpecialValueFor("rip_current_cd");
        let sprint_cd = ability.GetSpecialValueFor("sprint_cd");
        let duration = ability.GetSpecialValueFor("duration");
        if (caster.HasModifier(sprint_buff)) {
            return rip_current_cd;
        } else {
            return sprint_cd;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sprint_buff = "modifier_imba_slardar_sprint_buff";
        let sound_cast = "Hero_Slardar.Sprint";
        let motion_modifier = "modifier_imba_rip_current_movement";
        let modifier_stun = "modifier_imba_rip_current_stun";
        let modifier_slow = "modifier_imba_rip_current_slow";
        if (!caster.HasModifier(sprint_buff)) {
            let duration = ability.GetSpecialValueFor("duration");
            EmitSoundOn(sound_cast, caster);
            let sprint = caster.AddNewModifier(caster, ability, sprint_buff, {
                duration: duration
            }) as modifier_imba_slardar_sprint_buff;
            sprint.cooldown_cdr = this.GetCooldownTime();
            ability.EndCooldown();
        } else {
            EmitSoundOn(sound_cast, caster);
            caster.Stop();
            caster.AddNewModifier(caster, ability, motion_modifier, {});
        }
    }
}
@registerModifier()
export class modifier_imba_slardar_sprint_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_talent_slow: any;
    public modifier_rain: any;
    public search_radius: number;
    public sprint_cd: any;
    public ms_bonus_pct: number;
    public ms_speed_rain_pct: number;
    public damage_amp_pct: number;
    public damage_reduction_rain: number;
    public duration: number;
    cooldown_cdr: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_talent_slow = "modifier_imba_slardar_sprint_aspd_slow";
        this.modifier_rain = "modifier_imba_rain_cloud_buff";
        this.search_radius = this.ability.GetSpecialValueFor("search_radius");
        this.sprint_cd = this.ability.GetSpecialValueFor("sprint_cd");
        this.ms_bonus_pct = this.ability.GetSpecialValueFor("ms_bonus_pct");
        this.ms_speed_rain_pct = this.ability.GetSpecialValueFor("ms_speed_rain_pct");
        this.damage_amp_pct = this.ability.GetSpecialValueFor("damage_amp_pct");
        this.damage_reduction_rain = this.ability.GetSpecialValueFor("damage_reduction_rain");
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.StartIntervalThink(0.2);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_slardar_2")) {
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(this.caster, this.ability, this.modifier_talent_slow, {
                        duration: 0.3 * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
    GetTexture(): string {
        return "slardar_sprint";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "sprint";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ms_bonus_pct = this.ms_bonus_pct;
        if (this.caster.HasModifier(this.modifier_rain)) {
            ms_bonus_pct = this.ms_bonus_pct + this.ms_speed_rain_pct;
        }
        return ms_bonus_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        let damage_amp_pct = this.damage_amp_pct;
        if (this.caster.HasModifier(this.modifier_rain)) {
            damage_amp_pct = this.damage_amp_pct + (this.damage_reduction_rain * (-1));
        }
        return damage_amp_pct;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_slardar/slardar_sprint.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.ability.SetActivated(true);
            let cooldown_start = (this.cooldown_cdr - this.duration);
            let remaining_time = this.GetRemainingTime();
            if (remaining_time > 0) {
                cooldown_start = cooldown_start + remaining_time;
            }
            this.ability.StartCooldown(cooldown_start);
        }
    }
}
@registerModifier()
export class modifier_imba_slardar_sprint_river extends BaseModifier_Plus {
    IsHidden(): boolean {
        return !(this.GetParentPlus().GetAbsOrigin().z < 160 && (this.GetParentPlus().HasGroundMovementCapability() || this.GetParentPlus().HasModifier("modifier_item_imba_shadow_blade_invis") || this.GetParentPlus().HasModifier("modifier_item_imba_silver_edge_invis")) || this.GetParentPlus().HasModifier("modifier_imba_slithereen_crush_puddle"));
    }
    GetEffectName(): string {
        if (!this.IsHidden()) {
            return "particles/units/heroes/hero_slardar/slardar_sprint_river.vpcf";
        }
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.IsHidden() && !this.GetCasterPlus().HasModifier("modifier_bloodseeker_thirst")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_bloodseeker_thirst", {});
        } else if (this.IsHidden() && this.GetParentPlus().FindModifierByNameAndCaster("modifier_bloodseeker_thirst", this.GetCasterPlus())) {
            this.GetParentPlus().RemoveModifierByNameAndCaster("modifier_bloodseeker_thirst", this.GetCasterPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (!this.IsHidden() && this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_puddle_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (!this.IsHidden() && this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_puddle_armor");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.IsHidden() && this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_puddle_status_resistance");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.IsHidden()) {
            return this.GetSpecialValueFor("river_speed");
        }
    }
}
@registerModifier()
export class modifier_imba_rip_current_movement extends BaseModifierMotionHorizontal_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public sound_land: any;
    public modifier_stun: any;
    public modifier_slow: any;
    public distance: number;
    public velocity: any;
    public slow_duration: number;
    public stun_duration: number;
    public radius: number;
    public damage: number;
    public distance_travelled: number;
    public direction: any;
    // public frametime: number;
    public rip_current_finished: any;
    GetTexture(): string {
        return "slardar_forward_propel";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.sound_land = "n_mud_golem.Boulder.Cast";
            this.modifier_stun = "modifier_imba_rip_current_stun";
            this.modifier_slow = "modifier_imba_rip_current_slow";
            this.distance = this.ability.GetSpecialValueFor("distance");
            this.velocity = this.ability.GetSpecialValueFor("velocity");
            this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
            this.stun_duration = this.ability.GetSpecialValueFor("stun_duration");
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.distance_travelled = 0;
            this.direction = this.caster.GetForwardVector();
            // this.frametime = FrameTime();
            // this.StartIntervalThink(this.frametime);
            if (!this.BeginMotionOrDestroy()) {
                return;
            }
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.distance_travelled < this.distance) {
                this.caster.SetAbsOrigin(this.caster.GetAbsOrigin() + this.direction * this.velocity * dt as Vector);
                this.distance_travelled = this.distance_travelled + this.velocity * dt;
            } else {
                if (!this.rip_current_finished) {
                    this.RipCurrentLand();
                }
            }
        }
    }
    RipCurrentLand() {
        if (this.rip_current_finished) {
            return;
        }
        this.rip_current_finished = true;
        let radius = this.radius;
        let damage = this.damage;
        if (this.caster.HasTalent("special_bonus_imba_slardar_1")) {
            radius = radius * this.caster.GetTalentValue("special_bonus_imba_slardar_1");
            damage = damage * this.caster.GetTalentValue("special_bonus_imba_slardar_1");
        }
        EmitSoundOn(this.sound_land, this.caster);
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsMagicImmune()) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(this.caster, this.ability, this.modifier_stun, {
                    duration: this.stun_duration * (1 - enemy.GetStatusResistance())
                });
                enemy.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                    duration: this.slow_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
        this.Destroy();
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.caster.SetUnitOnClearGround();
        }
    }
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

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetEffectName(): string {
        return "particles/hero/slardar/slardar_foward_propel.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "forcestaff_friendly";
    }
}
@registerModifier()
export class modifier_imba_rip_current_stun extends BaseModifier_Plus {
    GetTexture(): string {
        return "slardar_forward_propel";
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerModifier()
export class modifier_imba_rip_current_slow extends BaseModifier_Plus {
    GetTexture(): string {
        return "slardar_forward_propel";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let ms_slow_pct = ability.GetSpecialValueFor("ms_slow_pct");
        return ms_slow_pct;
    }
}
@registerModifier()
export class modifier_imba_slardar_sprint_aspd_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        this.caster = this.GetCasterPlus();
        return this.caster.GetTalentValue("special_bonus_imba_slardar_2") * (-1);
    }
    GetTexture(): string {
        return "slardar_sprint";
    }
}
@registerAbility()
export class imba_slardar_slithereen_crush extends BaseAbility_Plus {
    GetCooldown(level: number): number {
        return super.GetCooldown(level) * (math.max((100 + this.GetCasterPlus().GetTalentValue("special_bonus_imba_slardar_6", "cdr_mult")) * 0.01, 1));
    }
    GetAbilityTextureName(): string {
        return "slardar_slithereen_crush";
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let ability = this;
        let particle_start = "particles/units/heroes/hero_slardar/slardar_crush_start.vpcf";
        let particle_start_fx = ResHelper.CreateParticleEx(particle_start, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_start_fx, 0, caster.GetAbsOrigin());
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        this.SlithereenCrush();
        if (caster.HasTalent("special_bonus_imba_slardar_6")) {
            let delay = caster.GetTalentValue("special_bonus_imba_slardar_6");
            this.AddTimer(delay, () => {
                caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
                this.AddTimer(this.GetCastPoint(), () => {
                    if (caster.IsAlive() && !caster.IsHexed() && !caster.IsNightmared() && !caster.IsOutOfGame() && !caster.IsSilenced() && !caster.IsStunned()) {
                        this.SlithereenCrush();
                    }
                });
            });
        }
    }

    SlithereenCrush() {
        let caster = this.GetCaster();
        let sound_cast = "Hero_Slardar.Slithereen_Crush";
        let particle_splash = "particles/units/heroes/hero_slardar/slardar_crush.vpcf";
        let particle_hit = "particles/units/heroes/hero_slardar/slardar_crush_entity.vpcf";
        let modifier_stun = "modifier_imba_slithereen_crush_stun";
        let modifier_slow = "modifier_imba_slithereen_crush_slow";
        let modifier_royal_break = "modifier_imba_slithereen_crush_royal_break";
        let modifier_rain = "modifier_imba_rain_cloud_buff";
        let radius = this.GetSpecialValueFor("radius");
        let radius_inc_rain_pct = this.GetSpecialValueFor("radius_inc_rain_pct");
        let stun_duration = this.GetSpecialValueFor("stun_duration");
        let slow_duration = this.GetSpecialValueFor("slow_duration");
        let damage = this.GetSpecialValueFor("damage");
        let royal_break_duration = this.GetSpecialValueFor("royal_break_duration");
        if (caster.HasModifier(modifier_rain)) {
            radius = radius * (1 + (radius_inc_rain_pct / 100));
        }
        EmitSoundOn(sound_cast, caster);
        let particle_splash_fx = ParticleManager.CreateParticle(particle_splash, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_splash_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_splash_fx, 1, Vector(1, 1, radius + 100));
        if (this.GetCaster().HasScepter()) {
            BaseModifier_Plus.CreateBuffThinker(this.GetCaster(), this, "modifier_imba_slithereen_crush_puddle_aura", {
                duration: this.GetSpecialValueFor("scepter_puddle_duration")
            }, this.GetCaster().GetOrigin(), this.GetCaster().GetTeamNumber(), false);
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            FindOrder.FIND_ANY_ORDER, false);
        for (const enemy of (enemies)) {
            if (!enemy.IsMagicImmune()) {
                let particle_hit_fx = ParticleManager.CreateParticle(particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN, enemy);
                ParticleManager.SetParticleControl(particle_hit_fx, 0, enemy.GetAbsOrigin());
                let damageTable: ApplyDamageOptions = {
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    ability: this
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(caster, this, modifier_stun, {
                    duration: stun_duration * (1 - enemy.GetStatusResistance())
                });
                enemy.AddNewModifier(caster, this, modifier_slow, {
                    duration: (stun_duration + slow_duration) * (1 - enemy.GetStatusResistance())
                });
                enemy.AddNewModifier(caster, this, modifier_royal_break, {
                    duration: royal_break_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_slardar_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_slardar_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_slardar_6"), "modifier_special_bonus_imba_slardar_6", {});
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
export class modifier_imba_slithereen_crush_stun extends BaseModifier_Plus {

    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }

    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_slithereen_crush_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let ms_slow_pct = ability.GetSpecialValueFor("ms_slow_pct");
        return ms_slow_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let as_slow = ability.GetSpecialValueFor("as_slow");
        return as_slow;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_slardar_crush.vpcf";
    }
}
@registerModifier()
export class modifier_imba_slithereen_crush_royal_break extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let royal_break_attacks = ability.GetSpecialValueFor("royal_break_attacks");
            this.SetStackCount(royal_break_attacks);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker.IsRealUnit() && attacker.GetTeamNumber() != target.GetTeamNumber() && parent == target) {
                let stacks = this.GetStackCount();
                if (stacks > 1) {
                    this.DecrementStackCount();
                } else {
                    this.Destroy();
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_BLOCK_DISABLED]: true,
            [modifierstate.MODIFIER_STATE_EVADE_DISABLED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_slithereen_crush_puddle_aura extends BaseModifier_Plus {
    public scepter_puddle_radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.scepter_puddle_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_slithereen_crush_puddle";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return hTarget != this.GetCasterPlus();
    }
    BeCreated(p_0: any,): void {
        this.scepter_puddle_radius = this.GetSpecialValueFor("scepter_puddle_radius");
        if (!IsServer()) {
            return;
        }
        let puddle_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slardar/slardar_water_puddle.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(puddle_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(puddle_particle, 1, Vector(this.scepter_puddle_radius, 0, 0));
        this.AddParticle(puddle_particle, false, false, -1, false, false);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveSelf();
    }
}
@registerModifier()
export class modifier_imba_slithereen_crush_puddle extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_slardar_bash_of_the_deep extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "slardar_bash";
    }
    GetIntrinsicModifierName(): string {
        if (!this.GetCasterPlus().IsIllusion()) {
            return "modifier_imba_bash_of_the_deep_attack";
        }
    }
}
@registerModifier()
export class modifier_imba_bash_of_the_deep_attack extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL
        }
        return Object.values(decFuncs);
    } */
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let attacker = keys.attacker;
            let target = keys.target;
            let sound_bash = "Hero_Slardar.Bash";
            let modifier_stun = "modifier_imba_bash_of_the_deep_stun";
            let bash_chance_pct = ability.GetSpecialValueFor("bash_chance_pct");
            let bash_damage = ability.GetSpecialValueFor("bash_damage");
            let hero_stun_duration = ability.GetSpecialValueFor("hero_stun_duration");
            let creep_duration_mult = ability.GetSpecialValueFor("creep_duration_mult");
            let extend_duration = ability.GetSpecialValueFor("extend_duration");
            let damage_smack = ability.GetSpecialValueFor("damage_smack");
            let total_bonus_damage = 0;
            extend_duration = extend_duration + caster.GetTalentValue("special_bonus_imba_slardar_3");
            if (target.IsBuilding() && !caster.HasTalent("special_bonus_imba_slardar_9")) {
                return undefined;
            }
            let continue_looking_lua_stuns = true;
            let smack_target = false;
            let modifiers;
            if (caster == attacker) {
                if (caster.PassivesDisabled()) {
                    return undefined;
                }
                if (target.IsStunned()) {
                    modifiers = target.FindAllModifiersByName("modifier_generic_stunned") as modifier_generic_stunned[];
                    if (GameFunc.GetCount(modifiers) > 0) {
                        for (const modifier of (modifiers)) {
                            if (!(modifier as any).extended_by_deep_bash) {
                                if (!modifier.GetAbilityPlus().IsPassive()) {
                                    modifier.SetDuration(modifier.GetRemainingTime() + extend_duration, true);
                                    (modifier as any).extended_by_deep_bash = true;
                                    smack_target = true;
                                    continue_looking_lua_stuns = false;
                                    return;
                                }
                            }
                        }
                    }
                    if (continue_looking_lua_stuns) {
                        modifiers = target.FindAllModifiers() as IBaseModifier_Plus[];
                        for (const modifier of (modifiers)) {
                            if (modifier.CheckState) {
                                if (modifier.CheckState()[modifierstate.MODIFIER_STATE_STUNNED] && !(modifier as any).extended_by_deep_bash) {
                                    if (!modifier.GetAbilityPlus().IsPassive()) {
                                        modifier.SetDuration(modifier.GetRemainingTime() + extend_duration, true);
                                        (modifier as any).extended_by_deep_bash = true;
                                        smack_target = true;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    if (smack_target) {
                        total_bonus_damage = total_bonus_damage + damage_smack;
                    }
                }
                if (!smack_target) {
                    if (GFuncRandom.PRD(bash_chance_pct, this)) {
                        EmitSoundOn(sound_bash, target);
                        if (target.IsRealUnit() || target.IsBuilding()) {
                            target.AddNewModifier(caster, ability, modifier_stun, {
                                duration: hero_stun_duration * (1 - target.GetStatusResistance())
                            });
                        } else {
                            target.AddNewModifier(caster, ability, modifier_stun, {
                                duration: (hero_stun_duration * creep_duration_mult) * (1 - target.GetStatusResistance())
                            });
                        }
                        total_bonus_damage = total_bonus_damage + bash_damage;
                    }
                }
            }
            return total_bonus_damage;
        }
    }
}
@registerModifier()
export class modifier_imba_bash_of_the_deep_stun extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_slardar_bash extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        if (!this.GetCasterPlus().IsIllusion()) {
            return "modifier_imba_slardar_bash";
        }
    }
}
@registerModifier()
export class modifier_imba_slardar_bash extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetStackCount() == 0;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained() && !this.GetParentPlus().PassivesDisabled() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (this.GetStackCount() < this.GetSpecialValueFor("attack_count")) {
                this.IncrementStackCount();
            } else {
                keys.target.EmitSound("Hero_Slardar.Bash");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                    duration: this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance())
                });
                this.SetStackCount(0);
                return this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_damage");
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetSpecialValueFor("attack_count") + 1;
    }
}
@registerAbility()
export class imba_slardar_amplify_damage extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "slardar_amplify_damage";
    }
    OnInventoryContentsChanged(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let rain_ability = "imba_slardar_rain_cloud";
            let modifier_slardar = "modifier_imba_rain_cloud_slardar";
            if (caster.HasAbility(rain_ability)) {
                let rain_ability_handler = caster.FindAbilityByName(rain_ability) as imba_slardar_rain_cloud;
                if (rain_ability_handler) {
                    if (caster.HasScepter()) {
                        rain_ability_handler.SetLevel(1);
                        rain_ability_handler.SetHidden(false);
                    } else {
                        this.AddTimer(FrameTime(), () => {
                            if (rain_ability_handler.dummy && !caster.HasScepter()) {
                                ParticleManager.DestroyParticle(rain_ability_handler.particle_rain_fx, false);
                                ParticleManager.ReleaseParticleIndex(rain_ability_handler.particle_rain_fx);
                                caster.RemoveModifierByName(modifier_slardar);
                            }
                        });
                        if (rain_ability_handler.GetLevel() > 0) {
                            rain_ability_handler.SetLevel(0);
                            rain_ability_handler.SetHidden(true);
                        }
                    }
                }
            }
        }
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        return caster.GetTalentValue("special_bonus_imba_slardar_7", "radius");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = ability.GetCursorTarget();
        let sound_cast = "Hero_Slardar.Amplify_Damage";
        let cast_response_string = "slardar_slar_ability_ampdam_";
        let particle_haze = "particles/units/heroes/hero_slardar/slardar_amp_damage.vpcf";
        let modifier_debuff = "modifier_imba_slardar_amplify_damage_debuff";
        let modifier_secondary_debuff = "modifier_imba_slardar_amplify_damage_debuff_secondary";
        let duration = ability.GetSpecialValueFor("duration");
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        if (target.GetUnitName().includes("riki")) {
            if (RollPercentage(35)) {
                let cast_response_roll = RandomInt(9, 14);
                if (cast_response_roll < 10) {
                    cast_response_string = cast_response_string + "0";
                }
                let cast_response = cast_response_string + cast_response_roll;
                EmitSoundOn(cast_response, caster);
            }
        } else {
            if (RollPercentage(15)) {
                let cast_response_table = {
                    1: 1,
                    2: 4,
                    3: 5,
                    4: 6,
                    5: 7,
                    6: 8
                }
                let cast_response = cast_response_string + "0" + GFuncRandom.RandomValue(cast_response_table);
                EmitSoundOn(cast_response, caster);
            }
        }
        EmitSoundOn(sound_cast, caster);
        let slardar_amplify_damage_modifier = target.AddNewModifier(caster, ability, modifier_debuff, {
            duration: duration * (1 - target.GetStatusResistance())
        });
        if (caster.HasTalent("special_bonus_imba_slardar_7")) {
            let radius = caster.GetTalentValue("special_bonus_imba_slardar_7", "radius");
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != target && !enemy.HasModifier(modifier_debuff)) {
                    enemy.AddNewModifier(caster, ability, modifier_secondary_debuff, {
                        duration: duration * (1 - enemy.GetStatusResistance())
                    });
                    let particle_haze_fx = ResHelper.CreateParticleEx(particle_haze, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, enemy);
                    ParticleManager.SetParticleControl(particle_haze_fx, 0, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_haze_fx, 1, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_haze_fx, 2, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControlEnt(particle_haze_fx, 1, enemy, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_overhead", enemy.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(particle_haze_fx, 2, enemy, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    slardar_amplify_damage_modifier.AddParticle(particle_haze_fx, false, true, -1, false, true);
                }
            }
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_slardar_amplify_damage_debuff extends BaseModifier_Plus {
    public caster_buff: any;
    public particle_haze_fx: any;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }

        if (this.GetCasterPlus().HasTalent("special_bonus_imba_slardar_11") && this.GetParentPlus().IsRealUnit()) {
            this.caster_buff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slardar_amplify_damage_talent_buff", {
                duration: this.GetDuration()
            });
        }
        this.particle_haze_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_slardar/slardar_amp_damage.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.particle_haze_fx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_haze_fx, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.particle_haze_fx, false, false, -1, false, true);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_slardar_11")) {
            return;
        }
        if (this.caster_buff && !this.caster_buff.IsNull()) {
            this.caster_buff.SetDuration(this.GetDuration(), true);
        } else {
            this.caster_buff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slardar_amplify_damage_talent_buff", {
                duration: this.GetDuration()
            });
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().HasModifier("modifier_slark_shadow_dance")) {
            return {
                [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (!IsValid(caster)) {
            return;
        }
        let victim = keys.unit;
        let damage_type = keys.damage_type;
        if (!IsValid(caster) || !caster.HasTalent("special_bonus_imba_slardar_11")) {
            return;
        }
        if (damage_type !== DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
            return;
        }
        if (parent == victim && caster.GetTeamNumber() != victim.GetTeamNumber()) {
            if (this.GetStackCount() < this.GetSpecialValueFor("armor_reduction")) {
                this.IncrementStackCount();
                if (this.caster_buff) {
                    this.caster_buff.IncrementStackCount();
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return (this.GetSpecialValueFor("armor_reduction") + this.GetStackCount()) * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let parent = this.GetParentPlus();
        if (!IsValid(caster)) {
            return;
        }
        let modifier_rain = "modifier_imba_rain_cloud_buff";
        let rain_cloud_stunned_amp_pct = ability.GetSpecialValueFor("rain_cloud_stunned_amp_pct");
        if (caster.HasModifier(modifier_rain) && parent.IsStunned()) {
            return rain_cloud_stunned_amp_pct;
        } else {
            return undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let parent = this.GetParentPlus();
        if (!IsValid(caster)) {
            return;
        }
        let attacker = keys.attacker;
        let inflictor = keys.inflictor;
        let modifier_slip = "modifier_imba_slardar_amplify_damage_slip_debuff";
        let slip_up_chance_pct = ability.GetSpecialValueFor("slip_up_chance_pct");
        let slip_up_duration = ability.GetSpecialValueFor("slip_up_duration");
        let slip_up_damage_negation = ability.GetSpecialValueFor("slip_up_damage_negation");
        slip_up_chance_pct = slip_up_chance_pct + caster.GetTalentValue("special_bonus_imba_slardar_4");
        if (attacker == parent && !inflictor && !parent.HasModifier(modifier_slip)) {
            let rand = RandomInt(1, 100);
            if (rand <= slip_up_chance_pct) {
                parent.AddNewModifier(caster, ability, modifier_slip, {
                    duration: slip_up_duration * (1 - parent.GetStatusResistance())
                });
                return slip_up_damage_negation;
            }
        }
        return undefined;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_slardar_amp_damage.vpcf";
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_slardar_12")) {
            return false;
        } else {
            return true;
        }
    }
}
@registerModifier()
export class modifier_imba_slardar_amplify_damage_debuff_secondary extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let armor_reduction = ability.GetSpecialValueFor("armor_reduction");
        let armor_loss_pct = caster.GetTalentValue("special_bonus_imba_slardar_7", "armor_loss_pct");
        armor_reduction = armor_reduction * (armor_loss_pct * 0.01);
        return armor_reduction * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let parent = this.GetParentPlus();
        let modifier_rain = "modifier_imba_rain_cloud_buff";
        let rain_cloud_stunned_amp_pct = ability.GetSpecialValueFor("rain_cloud_stunned_amp_pct");
        if (caster.HasModifier(modifier_rain) && parent.IsStunned()) {
            return rain_cloud_stunned_amp_pct;
        } else {
            return undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let parent = this.GetParentPlus();
        let attacker = keys.attacker;
        let inflictor = keys.inflictor;
        let modifier_slip = "modifier_imba_slardar_amplify_damage_slip_debuff";
        let slip_up_chance_pct = ability.GetSpecialValueFor("slip_up_chance_pct");
        let slip_up_duration = ability.GetSpecialValueFor("slip_up_duration");
        let slip_up_damage_negation = ability.GetSpecialValueFor("slip_up_damage_negation");
        slip_up_chance_pct = slip_up_chance_pct + caster.GetTalentValue("special_bonus_imba_slardar_4");
        if (attacker == parent && !inflictor && !parent.HasModifier(modifier_slip)) {
            let rand = RandomInt(1, 100);
            if (rand <= slip_up_chance_pct) {
                parent.AddNewModifier(caster, ability, modifier_slip, {
                    duration: slip_up_duration * (1 - parent.GetStatusResistance())
                });
                return slip_up_damage_negation;
            }
        }
        return undefined;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_slardar_amp_damage.vpcf";
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_slardar_amplify_damage_slip_debuff extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/hero/slardar/slardar_slip_up.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ability = this.GetAbilityPlus();
        let slip_up_ms_loss_pct = ability.GetSpecialValueFor("slip_up_ms_loss_pct") * (-1);
        return slip_up_ms_loss_pct;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_slardar_amplify_damage_talent_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_slardar_12")) {
            return false;
        } else {
            return true;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_slardar_rain_cloud extends BaseAbility_Plus {
    public dummy: IBaseNpc_Plus;
    particle_rain_fx: ParticleID;
    GetAbilityTextureName(): string {
        return "slardar_rain_cloud";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rain_cloud_slardar";
    }
    OnUnStolen(): void {
        if (!IsServer()) {
            return;
        }
        if (this.particle_rain_fx) {
            ParticleManager.DestroyParticle(this.particle_rain_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_rain_fx);
        }
        if (this.dummy) {
            this.dummy.Destroy();
            this.dummy = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_rain_cloud_slardar extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABILITY_LAYOUT,
            2: Enum_MODIFIER_EVENT.ON_DEATH,
            3: Enum_MODIFIER_EVENT.ON_RESPAWN
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_slardar_rain_cloud>();
            let unit = keys.unit;
            if (caster == unit) {
                ParticleManager.DestroyParticle(ability.particle_rain_fx, false);
                ParticleManager.ReleaseParticleIndex(ability.particle_rain_fx);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_slardar_rain_cloud>();
            let unit = keys.unit;
            let particle_rain = "particles/hero/slardar/slardar_rain_cloud.vpcf";
            if (caster == unit) {
                ability.dummy.SetAbsOrigin(caster.GetAbsOrigin());
                ability.particle_rain_fx = ResHelper.CreateParticleEx(particle_rain, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ability.dummy);
                ParticleManager.SetParticleControl(ability.particle_rain_fx, 0, ability.dummy.GetAbsOrigin());
                ParticleManager.SetParticleControl(ability.particle_rain_fx, 1, ability.dummy.GetAbsOrigin());
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_slardar_rain_cloud>();
            let modifier_dummy = "modifier_imba_rain_cloud_dummy";
            let modifier_aura = "modifier_imba_rain_cloud_aura";
            let particle_rain = "particles/hero/slardar/slardar_rain_cloud.vpcf";
            if (ability.dummy) {
                ability.dummy.Destroy();
                ability.dummy = undefined;
            }
            ability.dummy = caster.CreateDummyUnit(caster.GetAbsOrigin(), -1, true);
            ability.dummy.AddNewModifier(caster, ability, modifier_dummy, {});
            ability.particle_rain_fx = ResHelper.CreateParticleEx(particle_rain, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ability.dummy);
            ParticleManager.SetParticleControl(ability.particle_rain_fx, 0, ability.dummy.GetAbsOrigin());
            ParticleManager.SetParticleControl(ability.particle_rain_fx, 1, ability.dummy.GetAbsOrigin());
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABILITY_LAYOUT)
    CC_GetModifierAbilityLayout(): number {
        return 5;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_rain_cloud_dummy extends BaseModifierMotionHorizontal_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let dummy = this.GetParentPlus();
            if (!this.BeginMotionOrDestroy()) {
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
        return state;
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let dummy = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (!ability) {
                return;
            }
            let velocity_pct = ability.GetSpecialValueFor("velocity_pct");
            let distance_speed_up_1 = ability.GetSpecialValueFor("distance_speed_up_1");
            let speed_up_1_multiplier = ability.GetSpecialValueFor("speed_up_1_multiplier");
            let distance_speed_up_2 = ability.GetSpecialValueFor("distance_speed_up_2");
            let speed_up_2_multiplier = ability.GetSpecialValueFor("speed_up_2_multiplier");
            if (caster.HasTalent("special_bonus_imba_slardar_10")) {
                velocity_pct = velocity_pct * caster.GetTalentValue("special_bonus_imba_slardar_10");
                if (this.GetCasterPlus().HasAbility("imba_slardar_slithereen_crush") && this.GetCasterPlus().HasAbility("imba_slardar_amplify_damage")) {
                    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), dummy.GetAbsOrigin(), undefined, ability.GetSpecialValueFor("aura_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        enemy.AddNewModifier(caster, caster.findAbliityPlus<imba_slardar_slithereen_crush>("imba_slardar_slithereen_crush"), "modifier_imba_slithereen_crush_slow", {
                            duration: 1 * (1 - enemy.GetStatusResistance())
                        });
                        enemy.AddNewModifier(caster, caster.findAbliityPlus<imba_slardar_amplify_damage>("imba_slardar_amplify_damage"), "modifier_imba_slardar_amplify_damage_debuff", {
                            duration: 1 * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
            if (dummy.GetAbsOrigin() == caster.GetAbsOrigin()) {
                return undefined;
            }
            let distance = (caster.GetAbsOrigin() - dummy.GetAbsOrigin() as Vector).Length2D();
            let velocity = caster.GetBaseMoveSpeed() * (velocity_pct / 100);
            if (distance > distance_speed_up_1) {
                velocity = velocity * speed_up_1_multiplier;
            }
            if (distance > distance_speed_up_2) {
                velocity = velocity * speed_up_2_multiplier;
            }
            let direction = (caster.GetAbsOrigin() - dummy.GetAbsOrigin() as Vector).Normalized();
            dummy.SetAbsOrigin(dummy.GetAbsOrigin() + direction * velocity * dt as Vector);
        }
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        let caster = this.GetCasterPlus();
        if (target == caster) {
            return false;
        } else {
            return true;
        }
    }
    GetAuraRadius(): number {
        let ability = this.GetAbilityPlus();
        if (ability) {
            let aura_radius = ability.GetSpecialValueFor("aura_radius");
            return aura_radius;
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_rain_cloud_buff";
    }
    IsAura(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_rain_cloud_buff extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/hero/slardar/slardar_rain_cloud_status_effect.vpcf";
    }
}
@registerModifier()
export class modifier_special_bonus_imba_slardar_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_slardar_13 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_slardar_11 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_slardar_12 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_slardar_6 extends BaseModifier_Plus {
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
