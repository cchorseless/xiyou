
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus, BaseOrbAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_huskar_inner_fire extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let damage = this.GetSpecialValueFor("damage");
        let radius = this.GetSpecialValueFor("radius");
        let disarm_duration = this.GetSpecialValueFor("disarm_duration");
        let knockback_distance = this.GetSpecialValueFor("knockback_distance");
        let knockback_duration = this.GetSpecialValueFor("knockback_duration");
        let raze_land_duration = this.GetSpecialValueFor("raze_land_duration");
        this.GetCasterPlus().EmitSound("Hero_Huskar.Inner_Fire.Cast");
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_huskar/huskar_inner_fire.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle, 1, Vector(radius, 0, 0));
        ParticleManager.SetParticleControl(particle, 3, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle);
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_inner_fire_knockback", {
                duration: knockback_duration * (1 - enemy.GetStatusResistance()),
                x: this.GetCasterPlus().GetAbsOrigin().x,
                y: this.GetCasterPlus().GetAbsOrigin().y
            });
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_inner_fire_disarm", {
                duration: disarm_duration * (1 - enemy.GetStatusResistance())
            });
        }
        CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_huskar_inner_fire_raze_land_aura", {
            duration: raze_land_duration
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_huskar_inner_fire_knockback extends BaseModifierMotionHorizontal_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public knockback_duration: number;
    public knockback_distance: number;
    public knockback_speed: number;
    public position: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.knockback_duration = this.ability.GetSpecialValueFor("knockback_duration");
        this.knockback_distance = math.max(this.ability.GetSpecialValueFor("knockback_distance") - (this.caster.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Length2D(), 50);
        this.knockback_speed = this.knockback_distance / this.knockback_duration;
        this.position = GetGroundPosition(Vector(params.x, params.y, 0), undefined);

    }
    ApplyHorizontalMotionController() {
        return true;
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        let distance = (me.GetOrigin() - this.position as Vector).Normalized();
        me.SetOrigin(me.GetOrigin() + distance * this.knockback_speed * dt as Vector);
        GridNav.DestroyTreesAroundPoint(this.parent.GetOrigin(), this.parent.GetHullRadius(), true);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }

}
@registerModifier()
export class modifier_imba_huskar_inner_fire_disarm extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_huskar/huskar_inner_fire_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_huskar_inner_fire_raze_land extends BaseModifier_Plus {
    public raze_land_strength_pct: number;
    public damage: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.raze_land_strength_pct = this.GetSpecialValueFor("raze_land_strength_pct");
        if (!IsServer()) {
            return;
        }
        this.damage = this.GetCasterPlus().GetStrength() * this.raze_land_strength_pct * 0.01;
        this.OnIntervalThink();
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus()) {
            this.damage = this.GetCasterPlus().GetStrength() * this.raze_land_strength_pct * 0.01;
        }
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbilityPlus(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_huskar_inner_fire_raze_land_aura extends BaseModifier_Plus {
    public radius: number;
    public raze_land_damage_interval: number;
    public particle: any;
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        if (!this.radius) {
            this.radius = this.GetSpecialValueFor("radius");
        }
        return this.radius;
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
        return "modifier_imba_huskar_inner_fire_raze_land";
    }
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.raze_land_damage_interval = this.GetSpecialValueFor("raze_land_damage_interval");
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/hero/huskar/huskar_inner_fire_raze_land.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.particle, 1, this.GetParentPlus().GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.StartIntervalThink(this.raze_land_damage_interval);
    }
    OnIntervalThink(): void {
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), this.radius, true);
        let wards = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ward] of GameFunc.iPair(wards)) {
            if (ward.GetUnitName() == "npc_dota_observer_wards" || ward.GetUnitName() == "npc_dota_sentry_wards") {
                ward.Kill(this.GetAbilityPlus(), this.GetCasterPlus());
            }
        }
    }
}
@registerAbility()
export class imba_huskar_burning_spear extends BaseOrbAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_generic_orb_effect_lua";
    }
    GetProjectileName() {
        return "particles/units/heroes/hero_huskar/huskar_burning_spear.vpcf";
    }
    GetAbilityTargetFlags(): DOTA_UNIT_TARGET_FLAGS {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_pure_burning_spears")) {
            return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
        } else {
            return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_pure_burning_spears")) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnOrbFire() {
        this.GetCasterPlus().EmitSound("Hero_Huskar.Burning_Spear.Cast");
        this.GetCasterPlus().SetHealth(math.max(this.GetCasterPlus().GetHealth() - (this.GetCasterPlus().GetHealth() * this.GetSpecialValueFor("health_cost") * 0.01), 1));
    }
    OnOrbImpact(keys: ModifierAttackEvent) {
        if (!keys.target.IsMagicImmune() || this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_pure_burning_spears")) {
            keys.target.EmitSound("Hero_Huskar.Burning_Spear");
            keys.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_burning_spear_debuff", {
                duration: this.GetDuration()
            });
            keys.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_burning_spear_counter", {
                duration: this.GetDuration()
            });
            return 1
        }
        return 0
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_pure_burning_spears") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_huskar_pure_burning_spears")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_huskar_pure_burning_spears"), "modifier_special_bonus_imba_huskar_pure_burning_spears", {});
        }
    }
}
@registerModifier()
export class modifier_imba_huskar_burning_spear_counter extends BaseModifier_Plus {
    public burn_damage: number;
    public pain_reflection_per_stack: number;
    public damage_type: number;
    public damageTable: ApplyDamageOptions;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        this.burn_damage = this.GetSpecialValueFor("burn_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_huskar_2");
        this.pain_reflection_per_stack = this.GetSpecialValueFor("pain_reflection_per_stack");
        this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
        if (this.GetCasterPlus() && this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_pure_burning_spears")) {
            this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
        }
        this.damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        } as any;
        this.StartIntervalThink(1);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetCasterPlus()) {
            this.burn_damage = this.GetSpecialValueFor("burn_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_huskar_2");
            this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            if (this.GetCasterPlus() && this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_pure_burning_spears")) {
                this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
            }
        }
        this.damageTable.damage = this.GetStackCount() * this.burn_damage;
        this.damageTable.damage_type = this.damage_type;
        ApplyDamage(this.damageTable);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Huskar.Burning_Spear");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetCasterPlus() && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            let damageTable = {
                victim: this.GetParentPlus(),
                damage: keys.original_damage * (this.GetStackCount() * this.pain_reflection_per_stack * 0.01),
                damage_type: keys.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount() * this.pain_reflection_per_stack;
    }
}
@registerModifier()
export class modifier_imba_huskar_burning_spear_debuff extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let burning_spear_counter = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_huskar_burning_spear_counter", this.GetCasterPlus());
        if (burning_spear_counter) {
            burning_spear_counter.DecrementStackCount();
        }
    }
}
@registerAbility()
export class imba_huskar_berserkers_blood extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_huskar_berserkers_blood";
    }
}
@registerModifier()
export class modifier_imba_huskar_berserkers_blood extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public maximum_attack_speed: number;
    public maximum_health_regen: any;
    public hp_threshold_max: any;
    public maximum_resistance: any;
    public crimson_priest_duration: number;
    public range: number;
    public max_size: any;
    public particle: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.maximum_attack_speed = this.ability.GetSpecialValueFor("maximum_attack_speed");
        this.maximum_health_regen = this.ability.GetSpecialValueFor("maximum_health_regen");
        this.hp_threshold_max = this.ability.GetSpecialValueFor("hp_threshold_max");
        this.maximum_resistance = this.ability.GetSpecialValueFor("maximum_resistance");
        this.crimson_priest_duration = this.ability.GetSpecialValueFor("crimson_priest_duration");
        this.range = 100 - this.hp_threshold_max;
        this.max_size = 35;
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_huskar/huskar_berserkers_blood.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        this.StartIntervalThink(0.1);
    }
    BeRefresh(p_0: any,): void {
        this.maximum_attack_speed = this.ability.GetSpecialValueFor("maximum_attack_speed");
        this.maximum_health_regen = this.ability.GetSpecialValueFor("maximum_health_regen");
        this.hp_threshold_max = this.ability.GetSpecialValueFor("hp_threshold_max");
        this.maximum_resistance = this.ability.GetSpecialValueFor("maximum_resistance");
        this.range = 100 - this.hp_threshold_max;
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.parent.GetStrength());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.particle, false);
        ParticleManager.ReleaseParticleIndex(this.particle);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.parent.PassivesDisabled()) {
            return;
        }
        let pct = math.max((this.parent.GetHealthPercent() - this.hp_threshold_max) / this.range, 0);
        return this.maximum_attack_speed * (1 - pct);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.parent.PassivesDisabled()) {
            return;
        }
        let pct = math.max((this.parent.GetHealthPercent() - this.hp_threshold_max) / this.range, 0);
        return this.GetStackCount() * this.maximum_health_regen * 0.01 * (1 - pct);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        if (!IsServer()) {
            return;
        }
        let pct = math.max((this.parent.GetHealthPercent() - this.hp_threshold_max) / this.range, 0);
        ParticleManager.SetParticleControl(this.particle, 1, Vector((1 - pct) * 100, 0, 0));
        this.parent.SetRenderColor(255, 255 * pct, 255 * pct);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "berserkers_blood";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        let pct = math.max((this.parent.GetHealthPercent() - this.hp_threshold_max) / this.range, 0);
        return this.maximum_resistance * (1 - pct);
    }
}
@registerModifier()
export class modifier_imba_huskar_berserkers_blood_crimson_priest extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/econ/items/dazzle/dazzle_ti6_gold/dazzle_ti6_shallow_grave_gold.vpcf";
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_Dazzle.Shallow_Grave");
    }
}
@registerAbility()
export class imba_huskar_inner_vitality extends BaseAbility_Plus {
    OnHeroLevelUp(): void {
        this.SetLevel(math.min(math.floor(this.GetCasterPlus().GetLevel() / 3), 4));
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCursorTarget().EmitSound("Hero_Huskar.Inner_Vitality");
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_inner_vitality", {
            duration: this.GetDuration()
        });
    }
}
@registerModifier()
export class modifier_imba_huskar_inner_vitality extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public heal: any;
    public attrib_bonus: number;
    public hurt_attrib_bonus: number;
    public hurt_percent: any;
    public final_stand_hp_threshold: any;
    public final_stand_status_resist: any;
    public primary_stat_regen: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_huskar/huskar_inner_vitality.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.heal = this.ability.GetSpecialValueFor("heal");
        this.attrib_bonus = this.ability.GetSpecialValueFor("attrib_bonus");
        this.hurt_attrib_bonus = this.ability.GetSpecialValueFor("hurt_attrib_bonus");
        this.hurt_percent = this.ability.GetSpecialValueFor("hurt_percent");
        this.final_stand_hp_threshold = this.ability.GetSpecialValueFor("final_stand_hp_threshold");
        this.final_stand_status_resist = this.ability.GetSpecialValueFor("final_stand_status_resist");
        if (!IsServer()) {
            return;
        }
        this.primary_stat_regen = 0;
        if (this.parent.GetPrimaryStatValue) {
            if (this.parent.GetHealthPercent() > this.hurt_percent * 100) {
                this.primary_stat_regen = this.parent.GetPrimaryStatValue() * this.attrib_bonus;
            } else {
                this.primary_stat_regen = this.parent.GetPrimaryStatValue() * this.hurt_attrib_bonus;
            }
        }
        this.SetStackCount((this.heal + this.primary_stat_regen) * 10);
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.parent.GetPrimaryStatValue) {
            if (this.parent.GetHealthPercent() > this.hurt_percent * 100) {
                this.primary_stat_regen = this.parent.GetPrimaryStatValue() * this.attrib_bonus;
            } else {
                this.primary_stat_regen = this.parent.GetPrimaryStatValue() * this.hurt_attrib_bonus;
            }
        }
        this.SetStackCount((this.heal + this.primary_stat_regen) * 10);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.StopSound("Hero_Huskar.Inner_Vitality");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetStackCount() * 0.1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.parent.GetHealthPercent() < this.final_stand_hp_threshold) {
            return this.final_stand_status_resist;
        }
    }
}
@registerAbility()
export class imba_huskar_life_break extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (target == this.GetCasterPlus() && this.GetAutoCastState()) {
                return UnitFilterResult.UF_SUCCESS;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_huskar_life_break_cast_range");
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Huskar.Life_Break");
        this.GetCasterPlus().Purge(false, true, false, false, false);
        let life_break_charge_max_duration = 5;
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_life_break", {
            ent_index: this.GetCursorTarget().GetEntityIndex()
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_huskar_life_break_charge", {
            duration: life_break_charge_max_duration
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_huskar_life_break_cast_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_huskar_life_break_cast_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_huskar_life_break_cast_range"), "modifier_special_bonus_imba_huskar_life_break_cast_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_huskar_life_break extends BaseModifierMotionHorizontal_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public health_cost_percent: any;
    public health_damage: number;
    public health_damage_scepter: number;
    public charge_speed: number;
    public sac_dagger_duration: number;
    public sac_dagger_distance: number;
    public sac_dagger_rotation_speed: number;
    public sac_dagger_contact_radius: number;
    public sac_dagger_dmg_pct: number;
    public taunt_duration: number;
    public target: IBaseNpc_Plus;
    public break_range: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.health_cost_percent = this.ability.GetSpecialValueFor("health_cost_percent");
        this.health_damage = this.ability.GetSpecialValueFor("health_damage");
        this.health_damage_scepter = this.ability.GetSpecialValueFor("health_damage_scepter");
        this.charge_speed = this.ability.GetSpecialValueFor("charge_speed");
        this.sac_dagger_duration = this.ability.GetSpecialValueFor("sac_dagger_duration");
        this.sac_dagger_distance = this.ability.GetSpecialValueFor("sac_dagger_distance");
        this.sac_dagger_rotation_speed = this.ability.GetSpecialValueFor("sac_dagger_rotation_speed");
        this.sac_dagger_contact_radius = this.ability.GetSpecialValueFor("sac_dagger_contact_radius");
        this.sac_dagger_dmg_pct = this.ability.GetSpecialValueFor("sac_dagger_dmg_pct");
        this.taunt_duration = this.ability.GetSpecialValueFor("taunt_duration");
        if (!IsServer()) {
            return;
        }
        this.target = EntIndexToHScript(params.ent_index) as IBaseNpc_Plus;
        this.break_range = 1450;

    }
    ApplyHorizontalMotionController() {
        return true
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.FaceTowards(this.target.GetOrigin());
        let distance = (this.target.GetOrigin() - me.GetOrigin() as Vector).Normalized();
        me.SetOrigin(me.GetOrigin() + distance * this.charge_speed * dt as Vector);
        if ((this.target.GetOrigin() - me.GetOrigin() as Vector).Length2D() <= 128 || (this.target.GetOrigin() - me.GetOrigin() as Vector).Length2D() > this.break_range || this.parent.IsHexed() || this.parent.IsNightmared() || this.parent.IsStunned()) {
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.parent.HasModifier("modifier_imba_huskar_life_break_charge")) {
            this.parent.RemoveModifierByName("modifier_imba_huskar_life_break_charge");
        }
        if ((this.target.GetOrigin() - this.parent.GetOrigin() as Vector).Length2D() <= 128) {
            if (this.target.TriggerSpellAbsorb(this.ability)) {
                return undefined;
            }
            if (this.parent.GetName().includes("huskar")) {
                this.parent.StartGesture(GameActivity_t.ACT_DOTA_CAST_LIFE_BREAK_END);
            }
            this.target.EmitSound("Hero_Huskar.Life_Break.Impact");
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_huskar/huskar_life_break.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.target, this.caster);
            ParticleManager.SetParticleControl(particle, 1, this.target.GetOrigin());
            ParticleManager.ReleaseParticleIndex(particle);
            particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_huskar/huskar_life_break_spellstart.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.target, this.caster);
            ParticleManager.SetParticleControl(particle, 1, this.target.GetOrigin());
            ParticleManager.ReleaseParticleIndex(particle);
            let enemy_damage_to_use = this.health_damage;
            let damageTable_enemy = {
                victim: this.target,
                attacker: this.parent,
                damage: enemy_damage_to_use * this.target.GetHealth(),
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE
            }
            let enemy_damage = ApplyDamage(damageTable_enemy);
            let damageTable_self = {
                victim: this.parent,
                attacker: this.parent,
                damage: this.health_cost_percent * this.parent.GetHealth(),
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL
            }
            let self_damage = ApplyDamage(damageTable_self);
            let duration = this.ability.GetDuration() * (1 - this.target.GetStatusResistance());
            if (this.target.GetTeamNumber() == this.parent.GetTeamNumber()) {
                duration = this.ability.GetDuration();
            }
            this.target.AddNewModifier(this.parent, this.ability, "modifier_imba_huskar_life_break_slow", {
                duration: duration
            });
            this.parent.MoveToTargetToAttack(this.target);
            if (this.caster.HasScepter() && this.caster != this.target) {
                let taunt_modifier = this.target.AddNewModifier(this.caster, this.ability, "modifier_imba_huskar_life_break_taunt", {
                    duration: this.taunt_duration
                });
                if (taunt_modifier) {
                    taunt_modifier.SetDuration(this.taunt_duration * (1 - this.target.GetStatusResistance()), true);
                }
            }
            let random_angle = RandomInt(0, 359);
            CreateModifierThinker(this.parent, this.ability, "modifier_imba_huskar_life_break_sac_dagger", {
                duration: this.sac_dagger_duration,
                random_angle: random_angle,
                distance: this.sac_dagger_distance,
                rotation_speed: this.sac_dagger_rotation_speed,
                contact_radius: this.sac_dagger_contact_radius,
                damage: enemy_damage * this.sac_dagger_dmg_pct * 0.01
            }, this.parent.GetAbsOrigin() + Vector(math.cos(math.rad(random_angle)), math.sin(math.rad((random_angle)))) * this.sac_dagger_distance as Vector, this.parent.GetTeamNumber(), false);
            let tracker_modifier = this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_huskar_life_break_sac_dagger_tracker", {
                duration: this.sac_dagger_duration
            });
            if (tracker_modifier) {
                tracker_modifier.SetStackCount(enemy_damage * this.sac_dagger_dmg_pct * 0.01);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_huskar_life_break_charge extends BaseModifier_Plus {
    public pfx: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
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
        return GameActivity_t.ACT_DOTA_CAST_LIFE_BREAK_START;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.GetStackCount() == 1) {
            return "dominator";
        } else {
            return "";
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            // if (BATTLEPASS_HUSKAR && Battlepass.GetRewardUnlocked(this.GetParentPlus().GetPlayerID()) >= BATTLEPASS_HUSKAR["huskar_immortal"]) {
            this.SetStackCount(1);
            this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_huskar/huskar_life_break_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            // }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.pfx) {
                ParticleManager.DestroyParticle(this.pfx, false);
                ParticleManager.ReleaseParticleIndex(this.pfx);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_huskar_life_break_slow extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public movespeed: number;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_huskar_lifebreak.vpcf";
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.movespeed = this.ability.GetSpecialValueFor("movespeed");
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            return this.movespeed * (-1);
        } else {
            return this.movespeed;
        }
    }
}
@registerModifier()
export class modifier_imba_huskar_life_break_sac_dagger extends BaseModifier_Plus {
    public random_angle: any;
    public distance: number;
    public rotation_speed: number;
    public contact_radius: number;
    public damage: number;
    public damage_interval: number;
    public counter: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf";
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.random_angle = params.random_angle;
        this.distance = params.distance;
        this.rotation_speed = params.rotation_speed;
        this.contact_radius = params.contact_radius;
        this.damage = params.damage;
        this.damage_interval = 0.1;
        this.counter = 0;
        this.OnIntervalThink();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().IsAlive()) {
            this.Destroy();
        }
        this.GetParentPlus().SetOrigin(this.GetCasterPlus().GetOrigin() + Vector(math.cos(math.rad(this.random_angle)), math.sin(math.rad((this.random_angle)))) * this.distance as Vector);
        this.random_angle = this.random_angle + (this.rotation_speed * FrameTime());
        let forward_vector = (this.GetCasterPlus().GetOrigin() - this.GetParentPlus().GetOrigin() as Vector).Normalized();
        this.GetParentPlus().SetForwardVector(Vector(forward_vector.y, forward_vector.x * (-1), forward_vector.z));
        this.counter = this.counter + FrameTime();
        if (this.counter >= this.damage_interval) {
            this.counter = 0;
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetOrigin(), undefined, this.contact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable: ApplyDamageOptions = {
                    victim: enemy,
                    damage: this.damage * this.damage_interval * 0.5,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
                damageTable.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                ApplyDamage(damageTable);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/particle/phantom_assassin_dagger_model.vmdl";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return 300;
    }
}
@registerModifier()
export class modifier_imba_huskar_life_break_sac_dagger_tracker extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_huskar_life_break_taunt extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetForceAttackTarget(this.GetCasterPlus());
        this.GetParentPlus().MoveToTargetToAttack(this.GetCasterPlus());
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetForceAttackTarget(this.GetCasterPlus());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetForceAttackTarget(undefined);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        };
    }
}
@registerModifier()
export class modifier_special_bonus_imba_huskar_life_break_cast_range extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_huskar_pure_burning_spears extends BaseModifier_Plus {
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
