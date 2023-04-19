
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_crystal_maiden_arcane_dynamo extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_arcane_dynamo";
    }
    IsInnateAbility() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "crystal_maiden_arcane_dynamo";
    }
}
@registerModifier()
export class modifier_imba_arcane_dynamo extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ability_slow_modifier: any;
    public max_stacks: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ability_slow_modifier = "modifier_imba_crystal_maiden_ability_slow";
        this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
        this.StartIntervalThink(0.2);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.PassivesDisabled()) {
                this.SetStackCount(0);
                return undefined;
            }
            let mana_percentage = this.caster.GetMana() / this.caster.GetMaxMana();
            let stacks = math.ceil(mana_percentage * this.max_stacks);
            stacks = stacks * math.max(1, (this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_4")));
            this.SetStackCount(stacks);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
        3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.caster || this.caster.IsNull()) {
            return;
        }
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        if (this.caster.IsIllusion()) {
            return undefined;
        }
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        if (this.caster.IsIllusion()) {
            return undefined;
        }
        return this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (this.caster.HasTalent("special_bonus_imba_crystal_maiden_5") && kv.attacker == this.caster) {
            if (kv.inflictor && !kv.inflictor.IsItem()) {
                let duration = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_5", "duration");
                kv.unit.AddNewModifier(this.caster, this.ability, this.ability_slow_modifier, {
                    duration: duration * (1 - kv.unit.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_ability_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public move_slow: any;
    public attack_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.move_slow = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_5", "slow");
        this.attack_slow = this.move_slow;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.move_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return -this.attack_slow;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
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
@registerAbility()
export class imba_crystal_maiden_crystal_nova extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("nova_radius");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_crystal_maiden_3") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_crystal_maiden_3").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_crystal_maiden_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_crystal_maiden_3", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let particle_nova = "particles/units/heroes/hero_crystalmaiden/maiden_crystal_nova.vpcf";
        let sound_nova = "soundevents/game_sounds_heroes/game_sounds_crystalmaiden.vsndevts";
        let modifier_nova_debuff = "modifier_imba_crystal_nova_slow";
        let modifier_thinker_ally = "modifier_imba_crystal_nova_snowfield_ally_aura";
        let modifier_thinker_enemy = "modifier_imba_crystal_nova_snowfield_enemy_aura";
        let nova_radius = this.GetSpecialValueFor("nova_radius");
        let nova_slow_duration = this.GetSpecialValueFor("nova_slow_duration");
        let nova_damage = this.GetTalentSpecialValueFor("nova_damage");
        let snowfield_duration = this.GetSpecialValueFor("snowfield_duration");
        let snowfield_vision_radius = this.GetSpecialValueFor("snowfield_vision_radius");
        EmitSoundOnLocationWithCaster(target_point, "Hero_Crystal.CrystalNova", caster);
        let thinker = BaseModifier_Plus.CreateBuffThinker(caster, ability, modifier_thinker_ally, {
            duration: snowfield_duration
        }, target_point, caster.GetTeamNumber(), false);
        thinker.AddNewModifier(caster, ability, modifier_thinker_enemy, {
            duration: snowfield_duration
        });
        this.CreateVisibilityNode(target_point, snowfield_vision_radius, snowfield_duration);
        let nova_pfx = ResHelper.CreateParticleEx(particle_nova, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, thinker);
        ParticleManager.SetParticleControl(nova_pfx, 0, target_point);
        ParticleManager.SetParticleControl(nova_pfx, 1, Vector(nova_radius, nova_slow_duration, nova_radius));
        ParticleManager.SetParticleControl(nova_pfx, 2, target_point);
        ParticleManager.ReleaseParticleIndex(nova_pfx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, nova_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(caster, this, "modifier_imba_crystal_nova_slow", {
                duration: nova_slow_duration * (1 - enemy.GetStatusResistance())
            });
            ApplyDamage({
                attacker: caster,
                victim: enemy,
                ability: ability,
                damage: nova_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_crystal_maiden_3 extends BaseModifier_Plus {
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
export class modifier_imba_crystal_nova_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("nova_slow_percentage") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("nova_slow_percentage") * (-1);
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
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
export class modifier_imba_crystal_nova_snowfield_ally_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_snowfield_snow: any;
    public snowfield_radius: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_snowfield_snow = "particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_snow.vpcf";
        this.snowfield_radius = this.ability.GetSpecialValueFor("snowfield_radius");
        let snowfield_pfx = ResHelper.CreateParticleEx(this.particle_snowfield_snow, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.parent);
        ParticleManager.SetParticleControl(snowfield_pfx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(snowfield_pfx, 1, Vector(this.snowfield_radius, 0, 0));
        this.AddParticle(snowfield_pfx, false, false, -1, false, false);
    }
    GetAuraRadius(): number {
        return this.snowfield_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_crystal_nova_snowfield_buff";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_crystal_nova_snowfield_enemy_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_snowfield_snow: any;
    public snowfield_radius: number;
    public snowfield_damage_per_tick: number;
    public snowfield_damage_interval: number;
    public damage_per_tick: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_snowfield_snow = "particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_snow.vpcf";
        this.snowfield_radius = this.ability.GetSpecialValueFor("snowfield_radius");
        this.snowfield_damage_per_tick = this.ability.GetSpecialValueFor("snowfield_damage_per_tick");
        this.snowfield_damage_interval = this.ability.GetSpecialValueFor("snowfield_damage_interval");
        this.damage_per_tick = this.snowfield_damage_per_tick * this.snowfield_damage_interval;
        if (IsServer()) {
            this.StartIntervalThink(this.snowfield_damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.snowfield_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                ApplyDamage({
                    attacker: this.caster,
                    victim: enemy,
                    ability: this.ability,
                    damage: this.damage_per_tick,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
            }
        }
    }
    GetAuraRadius(): number {
        return this.snowfield_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_crystal_nova_snowfield_debuff";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_crystal_nova_snowfield_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public snowfield_ally_buff: any;
    public damage_reduction_pct: number;
    public health_regen: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.snowfield_ally_buff = this.ability.GetSpecialValueFor("snowfield_ally_buff");
        this.damage_reduction_pct = this.GetSpecialValueFor("damage_reduction_pct") || 0;
        this.health_regen = this.GetSpecialValueFor("health_regen") || 0;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.snowfield_ally_buff;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -this.damage_reduction_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen;
    }
}
@registerModifier()
export class modifier_imba_crystal_nova_snowfield_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public snowfield_enemy_slow: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.snowfield_enemy_slow = this.ability.GetSpecialValueFor("snowfield_enemy_slow");
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.snowfield_enemy_slow * (-1);
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_crystal_maiden_frostbite extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_crystal_maiden_frostbite_passive_ready";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().HasModifier("modifier_imba_crystal_maiden_frostbite_handler")) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget() as IBaseNpc_Plus;
            let position = this.GetCursorPosition();
            let duration = this.GetTalentSpecialValueFor("duration");
            let duration_creep = this.GetTalentSpecialValueFor("duration_creep");
            let duration_stun = this.GetSpecialValueFor("duration_stun");
            let damage_interval = this.GetSpecialValueFor("damage_interval");
            if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.IsConsideredHero() || target.IsAncient()) {
                    target.AddNewModifier(caster, this, "modifier_imba_crystal_maiden_frostbite_enemy", {
                        duration: duration * (1 - target.GetStatusResistance())
                    });
                } else {
                    target.AddNewModifier(caster, this, "modifier_imba_crystal_maiden_frostbite_enemy", {
                        duration: duration_creep * (1 - target.GetStatusResistance())
                    });
                }
            } else {
                target.AddNewModifier(caster, this, "modifier_imba_crystal_maiden_frostbite_ally", {
                    duration: duration
                });
            }
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_frostbite_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ORDER
    });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(p_0: ModifierUnitEvent,): void {
        if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_frostbite_enemy extends BaseModifier_Plus {
    public passive_proc: any;
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage_interval: number;
    public total_damage: number;
    public duration: number;
    public total_ticks: any;
    public damage_per_tick: number;
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.passive_proc = kv.passive_proc || false;
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
            if (this.GetParentPlus().IsConsideredHero() || this.GetParentPlus().IsAncient()) {
                this.total_damage = this.ability.GetSpecialValueFor("total_damage");
                this.duration = this.ability.GetTalentSpecialValueFor("duration");
            } else {
                this.total_damage = this.ability.GetSpecialValueFor("creep_total_damage");
                this.duration = this.ability.GetTalentSpecialValueFor("duration_creep");
            }
            this.total_ticks = (this.duration / this.damage_interval) + 1;
            this.damage_per_tick = this.total_damage / this.total_ticks;
            this.OnIntervalThink();
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
            this.StartIntervalThink(this.damage_interval * (1 - this.GetParentPlus().GetStatusResistance()));
        }
    }
    BeDestroy(): void {
        let icy_touch_slow_modifier = "modifier_imba_crystal_maiden_frostbite_enemy_talent";
        if (this.passive_proc && !this.parent.IsMagicImmune() && this.caster.HasTalent("special_bonus_imba_crystal_maiden_1")) {
            let duration = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_1", "duration");
            this.parent.AddNewModifier(this.caster, this.ability, icy_touch_slow_modifier, {
                duration: duration * (1 - this.parent.GetStatusResistance())
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            ApplyDamage({
                attacker: this.caster,
                victim: this.parent,
                ability: this.ability,
                damage: this.damage_per_tick,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_frostbite_enemy_talent extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public speed_update_rate: number;
    public initial_slow_pct: number;
    public move_slow_pct: number;
    public move_slow_change_per_update: any;
    Init(kv: any): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.speed_update_rate = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_1", "speed_update_rate") || -1;
        this.initial_slow_pct = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_1", "initial_slow_pct") || 0;
        this.move_slow_pct = this.initial_slow_pct;
        this.move_slow_change_per_update = this.initial_slow_pct * this.speed_update_rate / this.GetDuration();
        this.StartIntervalThink(this.speed_update_rate);
    }

    OnIntervalThink(): void {
        this.move_slow_pct = this.move_slow_pct - this.move_slow_change_per_update;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.move_slow_pct;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
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
export class modifier_imba_crystal_maiden_frostbite_ally extends BaseModifier_Plus {
    public heal_per_tick: any;
    public mana_per_tick: any;
    public ally_damage_reduction: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.heal_per_tick = this.GetSpecialValueFor("heal_per_tick");
        this.mana_per_tick = this.GetSpecialValueFor("mana_per_tick");
        this.ally_damage_reduction = this.GetSpecialValueFor("ally_damage_reduction");
        if (IsServer()) {
            this.StartIntervalThink(this.GetSpecialValueFor("damage_interval"));
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
        }
    }
    OnIntervalThink(): void {
        this.GetParentPlus().ApplyHeal(this.heal_per_tick, this.GetAbilityPlus());
        this.GetParentPlus().GiveMana(this.mana_per_tick);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, this.GetParentPlus(), this.mana_per_tick, undefined);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.ally_damage_reduction;
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_frostbite_passive_ready extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_recharge: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_recharge = "modifier_imba_crystal_maiden_frostbite_passive_recharging";
        if (this.caster.HasModifier(this.modifier_recharge)) {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
        2: Enum_MODIFIER_EVENT.ON_ORDER
    });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (this.ability.IsStolen()) {
                if (!this.caster.findAbliityPlus<imba_crystal_maiden_frostbite>("imba_crystal_maiden_frostbite")) {
                    this.caster.RemoveModifierByName("modifier_imba_crystal_maiden_frostbite_passive_ready");
                    return undefined;
                }
            }
            let attacker = keys.attacker;
            let unit = keys.unit;
            let cooldown = this.GetSpecialValueFor("duration_passive_recharge");
            if (unit == this.caster && attacker.GetTeam() != unit.GetTeam() && attacker.IsRealUnit() && !attacker.IsMagicImmune()) {
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                attacker.AddNewModifier(unit, this.GetAbilityPlus(), "modifier_imba_crystal_maiden_frostbite_enemy", {
                    duration: this.GetAbilityPlus().GetLevelSpecialValueFor("duration", 0) * (1 - attacker.GetStatusResistance()),
                    passive_proc: true
                });
                attacker.EmitSound("Hero_Crystal.Frostbite");
                unit.AddNewModifier(unit, this.GetAbilityPlus(), "modifier_imba_crystal_maiden_frostbite_passive_recharging", {
                    duration: cooldown
                });
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_crystal_maiden_frostbite_handler");
        } else {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_crystal_maiden_frostbite_handler", {});
        }
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_frostbite_passive_recharging extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_ready: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.modifier_ready = "modifier_imba_crystal_maiden_frostbite_passive_ready";
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "crystal_maiden_frostbite_cooldown";
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_ready, {});
        }
    }
}
@registerAbility()
export class imba_crystal_maiden_brilliance_aura extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_crystal_maiden_brilliance_aura_emitter";
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_crystal_maiden_brilliance_aura_manacost_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_crystal_maiden_brilliance_aura_manacost_reduction")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_crystal_maiden_brilliance_aura_manacost_reduction"), "modifier_special_bonus_imba_crystal_maiden_brilliance_aura_manacost_reduction", {});
        }
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_brilliance_aura_emitter extends BaseModifier_Plus {
    GetAuraRadius(): number {
        return 25000;
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
        return "modifier_imba_crystal_maiden_brilliance_aura";
    }
    IsAura(): boolean {
        if (this.GetCasterPlus().PassivesDisabled()) {
            return false;
        }
        if (this.GetCasterPlus().IsIllusion()) {
            return false;
        }
        return true;
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
export class modifier_imba_crystal_maiden_brilliance_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_self: number;
    public spellpower_threshold_pct: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.bonus_self = this.ability.GetSpecialValueFor("bonus_self");
        this.spellpower_threshold_pct = this.ability.GetSpecialValueFor("spellpower_threshold_pct");
        if (IsServer()) {
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                return;
            }
            if (this.parent && this.parent.GetManaPercent() > this.spellpower_threshold_pct) {
                this.SetStackCount(this.GetSpecialValueFor("bonus_spellpower"));
            } else {
                this.SetStackCount(0);
            }
        }
    }

    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
        3: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
        4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
        5: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE_STACKING
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (!this.GetAbilityPlus()) {
            return;
        }
        if (this.parent == this.caster) {
            return this.GetSpecialValueFor("mana_regen") * this.bonus_self;
        } else {
            return this.GetSpecialValueFor("mana_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.GetAbilityPlus()) {
            return;
        }
        if (this.parent == this.caster) {
            return this.GetSpecialValueFor("magic_resistance") * this.bonus_self;
        } else {
            return this.GetSpecialValueFor("magic_resistance");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (!this.GetAbilityPlus()) {
            return;
        }
        return this.GetSpecialValueFor("bonus_int");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE_STACKING)
    CC_GetModifierPercentageManacostStacking(): number {
        return this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_brilliance_aura_manacost_reduction") || 0;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }

}
@registerAbility()
export class imba_crystal_maiden_freezing_field extends BaseAbility_Plus {
    public frostbite_duration: number;
    public radius: number;
    public caster: IBaseNpc_Plus;
    public frametime: number;
    public explosion_radius: number;
    public damage: number;
    public are_we_nuclear: any;
    public shard_damage_mul: number;
    public shard_rate: any;
    public quadrant: any;
    public freezing_field_center: any;
    public explosion_interval: number;
    public freezing_field_aura: IBaseNpc_Plus;
    public freezing_field_particle: any;
    public shards: any;
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK;
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        let duration = this.GetSpecialValueFor("duration");
        let stun_duration = this.GetSpecialValueFor("stun_duration");
        this.frostbite_duration = this.GetSpecialValueFor("frostbite_duration");
        this.radius = this.GetSpecialValueFor("radius");
        this.caster = this.GetCasterPlus();
        if (IsServer()) {
            this.frametime = 0;
            this.explosion_radius = this.GetSpecialValueFor("explosion_radius");
            this.damage = this.GetSpecialValueFor("damage");
            if (this.caster.HasTalent("special_bonus_imba_crystal_maiden_7")) {
                this.are_we_nuclear = true;
                this.shard_damage_mul = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_7", "shard_damage_mul");
                this.shard_rate = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_7", "shard_rate");
            }
            this.quadrant = 1;
            this.freezing_field_center = this.caster.GetAbsOrigin();
            if (this.caster.HasScepter()) {
                this.freezing_field_center = this.GetCursorPosition();
            }
            this.explosion_interval = this.GetSpecialValueFor("explosion_interval");
            if (this.caster.HasTalent("special_bonus_imba_crystal_maiden_8")) {
                this.explosion_interval = this.explosion_interval * this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_8");
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.freezing_field_center, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(enemy, this, "modifier_imba_crystal_maiden_frostbite_enemy", {
                    duration: this.frostbite_duration * (1 - enemy.GetStatusResistance())
                });
            }
            this.freezing_field_aura = BaseModifier_Plus.CreateBuffThinker(this.caster, this, "modifier_imba_crystal_maiden_freezing_field_aura", {
                duration: duration
            }, this.freezing_field_center, this.caster.GetTeamNumber(), false);
            this.freezing_field_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_snow.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.freezing_field_aura, this.caster);
            ParticleManager.SetParticleControl(this.freezing_field_particle, 0, this.freezing_field_center);
            ParticleManager.SetParticleControl(this.freezing_field_particle, 1, Vector(1000, 0, 0));
            ParticleManager.SetParticleControl(this.freezing_field_particle, 5, Vector(1000, 0, 0));
            if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE)) {
                EmitSoundOnLocationWithCaster(this.freezing_field_center, "Hero_Crystal.CrystalNova", this.caster);
                this.EmitSound("Imba.CrystalMaidenLetItGo0" + RandomInt(1, 3));
                if (this.are_we_nuclear) {
                    this.EmitSound("Imba.CrystalMaidenTacticalNuke");
                }
            } else {
                this.EmitSound("hero_Crystal.freezingField.wind");
            }
        }
        this.caster.AddNewModifier(this.caster, this, "modifier_imba_crystal_maiden_freezing_field_armor_bonus", {
            duration: duration
        });
    }
    OnChannelThink(p_0: number,): void {
        this.frametime = this.frametime + FrameTime();
        if (!this.are_we_nuclear && this.frametime >= this.explosion_interval) {
            this.frametime = 0;
            let castDistance = RandomInt(this.GetSpecialValueFor("explosion_min_dist"), this.GetSpecialValueFor("explosion_max_dist"));
            let angle = RandomInt(0, 90);
            let dy = castDistance * math.sin(angle);
            let dx = castDistance * math.cos(angle);
            let attackPoint = Vector(0, 0, 0);
            let particle_name = "particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_explosion.vpcf";
            let target_loc = this.freezing_field_center;
            if (this.quadrant == 1) {
                attackPoint = Vector(target_loc.x - dx, target_loc.y + dy, target_loc.z);
            } else if (this.quadrant == 2) {
                attackPoint = Vector(target_loc.x + dx, target_loc.y + dy, target_loc.z);
            } else if (this.quadrant == 3) {
                attackPoint = Vector(target_loc.x + dx, target_loc.y - dy, target_loc.z);
            } else {
                attackPoint = Vector(target_loc.x - dx, target_loc.y - dy, target_loc.z);
            }
            this.quadrant = 4 % (this.quadrant + 1);
            let units = FindUnitsInRadius(this.caster.GetTeam(), attackPoint, undefined, this.explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
            for (const [_, v] of GameFunc.iPair(units)) {
                ApplyDamage({
                    victim: v,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this
                });
            }
            let fxIndex = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.caster, this.caster);
            ParticleManager.SetParticleControl(fxIndex, 0, attackPoint);
            ParticleManager.SetParticleControl(fxIndex, 1, attackPoint);
            ParticleManager.ReleaseParticleIndex(fxIndex);
            EmitSoundOnLocationWithCaster(attackPoint, "hero_Crystal.freezingField.explosion", this.GetCasterPlus());
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (IsServer()) {
            this.StopSound("hero_Crystal.freezingField.wind");
            this.StopSound("Imba.CrystalMaidenLetItGo01");
            this.StopSound("Imba.CrystalMaidenLetItGo02");
            this.StopSound("Imba.CrystalMaidenLetItGo03");
            AnimationHelper.EndAnimation(this.caster);
            ParticleManager.ClearParticle(this.freezing_field_particle, false);
            if (this.are_we_nuclear) {
                let meteor_delay = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_7", "meteor_delay");
                this.StopSound("Imba.CrystalMaidenTacticalNuke");
                let particle_name = "particles/hero/crystal_maiden/maiden_freezing_field_explosion.vpcf";
                this.shards = math.floor(this.frametime / this.shard_rate);
                let fxIndex = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, this.caster);
                ParticleManager.SetParticleControl(fxIndex, 0, this.freezing_field_center);
                ParticleManager.SetParticleControl(fxIndex, 1, this.freezing_field_center);
                ParticleManager.ReleaseParticleIndex(fxIndex);
                EmitSoundOnLocationForAllies(this.freezing_field_center, "hero_Crystal.freezingField.explosion", this.caster);
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.freezing_field_center, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                this.AddTimer(meteor_delay, () => {
                    if (GameFunc.GetCount(enemies) > 0) {
                        let shards = 0;
                        shards = shards + 1;
                        let enemy = enemies[math.random(1, GameFunc.GetCount(enemies))];
                        let extra_data = {
                            damage: this.damage * this.shard_damage_mul
                        }
                        let projectile = {
                            Target: enemy,
                            Source: this.freezing_field_center,
                            Ability: this,
                            EffectName: "particles/units/heroes/hero_winter_wyvern/wyvern_splinter_blast.vpcf",
                            iMoveSpeed: 800,
                            vSourceLoc: this.freezing_field_center,
                            bDrawsOnMinimap: false,
                            bDodgeable: false,
                            bIsAttack: false,
                            bVisibleToEnemies: true,
                            bReplaceExisting: false,
                            flExpireTime: GameRules.GetGameTime() + 10,
                            bProvidesVision: true,
                            iVisionRadius: 400,
                            iVisionTeamNumber: this.caster.GetTeamNumber(),
                            ExtraData: extra_data
                        }
                        ProjectileManager.CreateTrackingProjectile(projectile);
                        if (shards < this.shards) {
                            return 0.1;
                        } else {
                            this.freezing_field_center = undefined;
                            if (this.freezing_field_aura && !this.freezing_field_aura.IsNull()) {
                                SafeDestroyUnit(this.freezing_field_aura);
                                this.freezing_field_aura = undefined;
                            }
                            return undefined;
                        }
                    } else {
                        this.freezing_field_center = undefined;
                        if (this.freezing_field_aura && !this.freezing_field_aura.IsNull()) {
                            SafeDestroyUnit(this.freezing_field_aura);
                            this.freezing_field_aura = undefined;
                        }
                    }
                });
            }
            if (this.caster.HasModifier("modifier_imba_crystal_maiden_freezing_field_armor_bonus")) {
                this.caster.RemoveModifierByName("modifier_imba_crystal_maiden_freezing_field_armor_bonus");
            }
            if (this.freezing_field_aura && !this.freezing_field_aura.IsNull()) {
                this.freezing_field_aura.ForceKill(false);
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (hTarget) {
            if (hTarget && !hTarget.IsRealUnit()) { return }
            ApplyDamage({
                attacker: caster,
                victim: hTarget,
                ability: this,
                damage: ExtraData.damage,
                damage_type: this.GetAbilityDamageType()
            });
        }
    }
    GetManaCost(level: number): number {
        return 800;
    }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_freezing_field_aura extends BaseModifier_Plus {
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_crystal_maiden_freezing_field_slow";
    }
    IsAura(): boolean {
        return true;
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
export class modifier_imba_crystal_maiden_freezing_field_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public move_slow_pct: number;
    public attack_speed_slow: number;
    public frostbite_duration: number;
    public frostbite_delay: number;
    public tick_rate: any;
    public accumulated_exposure: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.move_slow_pct = this.ability.GetSpecialValueFor("slow");
        this.attack_speed_slow = this.ability.GetSpecialValueFor("attack_slow");
        if (this.caster.HasTalent("special_bonus_imba_crystal_maiden_6")) {
            this.frostbite_duration = this.ability.GetSpecialValueFor("frostbite_duration") * this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_6", "duration_multiplier");
            this.frostbite_delay = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_6", "delay");
            this.tick_rate = this.caster.GetTalentValue("special_bonus_imba_crystal_maiden_6", "tick_rate");
            this.accumulated_exposure = 0;
            if (IsServer()) {
                this.StartIntervalThink(this.tick_rate);
            }
        }
    }
    OnIntervalThink(): void {
        if (!this.parent.HasModifier("modifier_imba_crystal_maiden_frostbite_enemy")) {
            this.accumulated_exposure = this.accumulated_exposure + this.tick_rate;
        }
        if (this.accumulated_exposure >= this.frostbite_delay) {
            this.accumulated_exposure = this.accumulated_exposure - this.frostbite_delay;
            this.parent.AddNewModifier(this.caster, this.ability, "modifier_imba_crystal_maiden_frostbite_enemy", {
                duration: this.frostbite_duration * (1 - this.parent.GetStatusResistance())
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.move_slow_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return -this.attack_speed_slow;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_crystal_maiden_freezing_field_armor_bonus extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public bonus_armor: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.bonus_armor = this.ability.GetSpecialValueFor("bonus_armor");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_4;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_crystal_maiden_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_crystal_maiden_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_crystal_maiden_frostbite_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_crystal_maiden_crystal_nova_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_crystal_maiden_brilliance_aura_manacost_reduction extends BaseModifier_Plus {
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
