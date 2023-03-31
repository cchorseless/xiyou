import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus, BaseOrbAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_ancient_apparition_cold_feet extends BaseAbility_Plus {
    GetCooldown(level: number): number {
        return 20;
    }

    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }

    GetAOERadius(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_cold_feet_aoe");
    }

    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_cold_feet_aoe")) {
            return super.GetBehavior();
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
    }

    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_cold_feet_aoe")) {
            let target = this.GetCursorTarget();
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
            if (!target.HasModifier("imba_ancient_apparition_cold_feet")) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_cold_feet", {});
            }
        } else {
            let enemies = this.GetCasterPlus().FindUnitsInRadiusPlus(this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_cold_feet_aoe"), this.GetCursorPosition(),);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.HasModifier("imba_ancient_apparition_cold_feet")) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_cold_feet", {});
                }
            }
        }
    }

    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_cold_feet_aoe") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_ancient_apparition_cold_feet_aoe")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_ancient_apparition_cold_feet_aoe"), "modifier_special_bonus_imba_ancient_apparition_cold_feet_aoe", {});
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_cold_feet extends BaseModifier_Plus {
    public duration: number;
    public damage: number;
    public break_distance: number;
    public stun_duration: number;
    public damageTable: ApplyDamageOptions;
    public original_position: any;
    public counter: number;
    public ticks: any;
    public interval: number;

    IgnoreTenacity() {
        return true;
    }

    BeCreated(p_0: any,): void {
        this.duration = this.GetSpecialValueFor("AbilityDuration");
        this.damage = this.GetSpecialValueFor("damage");
        this.break_distance = this.GetSpecialValueFor("break_distance");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        if (!IsServer()) {
            return;
        }
        this.damageTable = {
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.original_position = this.GetParentPlus().GetAbsOrigin();
        this.counter = 1;
        this.ticks = 0;
        this.interval = 0.1;
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.ColdFeetCast");
        let cold_feet_marker_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_apparition_cold_feet_marker.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        this.AddParticle(cold_feet_marker_particle, false, false, -1, false, false);
        let cold_feet_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_apparition_cold_feet.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(cold_feet_particle, false, false, -1, false, false);
        this.OnIntervalThink();
        this.StartIntervalThink(this.interval);
    }

    OnIntervalThink(): void {
        if (GFuncVector.AsVector(this.GetParentPlus().GetAbsOrigin() - this.original_position).Length2D() < this.break_distance) {
            this.counter = this.counter + this.interval;
            if (this.counter >= 1) {
                if (this.ticks < this.duration) {
                    EmitSoundOnClient("Hero_Ancient_Apparition.ColdFeetTick", this.GetParentPlus().GetPlayerOwner());
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage, undefined);
                    ApplyDamage(this.damageTable);
                    this.ticks = this.ticks + 1;
                    this.counter = 0;
                } else {
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_ancient_apparition_cold_feet_freeze", {
                        duration: this.stun_duration * (1 - this.GetParentPlus().GetStatusResistance())
                    });
                    this.Destroy();
                }
            }
        } else {
            this.Destroy();
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit.GetTeamNumber() == this.GetParentPlus().GetTeamNumber() &&
            keys.target == this.GetParentPlus()
            && keys.unit != this.GetParentPlus() && !keys.unit.IsMagicImmune()) {
            if (!keys.unit.HasModifier("imba_ancient_apparition_cold_feet")) {
                keys.unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_ancient_apparition_cold_feet", {});
            }
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_cold_feet_freeze extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_ancient_apparition/ancient_apparition_cold_feet_frozen.vpcf";
    }

    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }

    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.ColdFeetFreeze");
        if (this.GetCasterPlus().GetUnitName().includes("ancient_apparition")) {
            this.GetCasterPlus().EmitSound("ancient_apparition_appa_ability_coldfeet_0" + RandomInt(2, 4));
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
        return state;
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
            2: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit.GetTeamNumber() == this.GetParentPlus().GetTeamNumber() && keys.target == this.GetParentPlus() && keys.unit != this.GetParentPlus() && !keys.unit.IsMagicImmune()) {
            if (!keys.unit.HasModifier("imba_ancient_apparition_cold_feet")) {
                keys.unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_ancient_apparition_cold_feet_freeze", {
                    duration: this.GetRemainingTime()
                });
            }
        }
    }
}

@registerAbility()
export class imba_ancient_apparition_ice_vortex extends BaseAbility_Plus {
    public anti_abrasion_ability: imba_ancient_apparition_anti_abrasion;
    public responses: { [k: string]: number };

    GetCooldown(level: number): number {
        return 20;
    }

    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        let r = AI_ability.POSITION_if_enemy(this);
        return r;
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    OnUpgrade(): void {
        if (!this.anti_abrasion_ability) {
            this.anti_abrasion_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_anti_abrasion>("imba_ancient_apparition_anti_abrasion");
        }
        if (this.anti_abrasion_ability) {
            this.anti_abrasion_ability.SetLevel(this.GetLevel());
        }
    }

    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Ancient_Apparition.IceVortexCast");
        if (this.GetCasterPlus().GetUnitName().includes("ancient_apparition")) {
            if (!this.responses) {
                this.responses = {
                    "ancient_apparition_appa_ability_vortex_01": 0,
                    "ancient_apparition_appa_ability_vortex_02": 0,
                    "ancient_apparition_appa_ability_vortex_03": 0,
                    "ancient_apparition_appa_ability_vortex_04": 0,
                    "ancient_apparition_appa_ability_vortex_05": 0,
                    "ancient_apparition_appa_ability_vortex_06": 0
                }
            }
            for (const response in this.responses) {
                const timer = this.responses[response];
                if (GameRules.GetDOTATime(true, true) - timer >= 60) {
                    this.GetCasterPlus().EmitSound(response);
                    this.responses[response] = GameRules.GetDOTATime(true, true);
                }
            }
        }
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_ice_vortex_thinker", {
            duration: this.GetSpecialValueFor("vortex_duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }

    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_ice_vortex_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_ancient_apparition_ice_vortex_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_ancient_apparition_ice_vortex_cooldown"), "modifier_special_bonus_imba_ancient_apparition_ice_vortex_cooldown", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_ice_vortex_boost") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_ancient_apparition_ice_vortex_boost")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_ancient_apparition_ice_vortex_boost"), "modifier_special_bonus_imba_ancient_apparition_ice_vortex_boost", {});
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_ice_vortex_thinker extends BaseModifier_Plus {
    public radius: number;
    public vision_aoe: number;
    public vortex_duration: number;

    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.vision_aoe = this.GetSpecialValueFor("vision_aoe");
        this.vortex_duration = this.GetSpecialValueFor("vortex_duration");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.IceVortex");
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.IceVortex.lp");
        let vortex_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_ice_vortex.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(vortex_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(vortex_particle, 5, Vector(this.radius, 0, 0));
        this.AddParticle(vortex_particle, false, false, -1, false, false);
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.vision_aoe, this.vortex_duration, false);
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Ancient_Apparition.IceVortex.lp");
        this.GetParentPlus().RemoveSelf();
    }

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
        return this.radius;
    }

    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }

    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
    }

    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }

    GetModifierAura(): string {
        return "modifier_imba_ancient_apparition_ice_vortex";
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_ice_vortex extends BaseModifier_Plus {
    public radius: number;
    public movement_speed_pct: number;
    public spell_resist_pct: number;

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.radius = this.GetSpecialValueFor("radius");
            this.movement_speed_pct = this.GetSpecialValueFor("movement_speed_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_ice_vortex_boost");
            this.spell_resist_pct = this.GetSpecialValueFor("spell_resist_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_ice_vortex_boost");
        } else {
            this.radius = 0;
            this.movement_speed_pct = 0;
            this.spell_resist_pct = 0;
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus() && this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return this.movement_speed_pct;
        } else {
            return this.movement_speed_pct * (-1);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus() && this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return this.spell_resist_pct;
        } else {
            return 0;
        }
    }
}

@registerAbility()
export class imba_ancient_apparition_chilling_touch extends BaseOrbAbility_Plus {
    public imbued_ice_ability: imba_ancient_apparition_imbued_ice;

    OnUpgrade(): void {
        if (!this.imbued_ice_ability) {
            this.imbued_ice_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_imbued_ice>("imba_ancient_apparition_imbued_ice");
        }
        if (this.imbued_ice_ability) {
            this.imbued_ice_ability.SetLevel(this.GetLevel());
        }
        this.ToggleAutoCast()
    }

    ProcsMagicStick(): boolean {
        return false;
    }

    GetIntrinsicModifierName(): string {
        return "modifier_generic_orb_effect";
    }

    GetProjectileName() {
        return "particles/units/heroes/hero_ancient_apparition/ancient_apparition_chilling_touch_projectile.vpcf";
    }

    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetCasterPlus().Script_GetAttackRange() + this.GetSpecialValueFor("attack_range_bonus") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_chilling_touch_range");
    }

    OnOrbFire() {
        this.GetCasterPlus().EmitSound("Hero_Ancient_Apparition.ChillingTouch.Cast");
    }

    OnOrbImpact(keys: ModifierAttackEvent) {
        if (keys.target.IsMagicImmune()) {
            return 0;
        }
        keys.target.EmitSound("Hero_Ancient_Apparition.ChillingTouch.Target");
        keys.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_chilling_touch_slow", {
            duration: this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance())
        });
        keys.target.ApplyStunned(this, this.GetCasterPlus(), this.GetSpecialValueFor("packed_ice_duration") * (1 - keys.target.GetStatusResistance()));
        let damage = this.GetSpecialValueFor("damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_chilling_touch_damage");
        ApplyDamage({
            victim: keys.target,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, damage, undefined);
        return 1;
    }

    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_chilling_touch_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_ancient_apparition_chilling_touch_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_ancient_apparition_chilling_touch_range"), "modifier_special_bonus_imba_ancient_apparition_chilling_touch_range", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ancient_apparition_chilling_touch_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_ancient_apparition_chilling_touch_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_ancient_apparition_chilling_touch_damage"), "modifier_special_bonus_imba_ancient_apparition_chilling_touch_damage", {});
        }
    }

    GetCooldown(level: number): number {
        return 0;
    }

    GetManaCost(level: number): number {
        return 1;
    }

    AutoSpellSelf() {
        let r = AI_ability.TARGET_if_enemy(this);
        return r;
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_chilling_touch_slow extends BaseModifier_Plus {
    public slow: any;
    public packed_ice_duration: number;

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.slow = this.GetSpecialValueFor("slow");
            this.packed_ice_duration = this.GetSpecialValueFor("packed_ice_duration");
        } else {
            this.slow = 0;
            this.packed_ice_duration = 0;
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        return {
            [modifierstate.MODIFIER_STATE_FROZEN]: this.GetElapsedTime() <= this.packed_ice_duration * (1 - this.GetParentPlus().GetStatusResistance())
        };
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.slow) {
            return this.slow * (-1);
        }
    }
}

@registerAbility()
export class imba_ancient_apparition_imbued_ice extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    OnSpellStart(): void {
        let position = this.GetCursorPosition();
        this.GetCasterPlus().EmitSound("Hero_Ancient_Apparition.Imbued_Ice_Cast");
        let imbued_ice_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_apparition_chilling_touch.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(imbued_ice_particle, 0, position);
        ParticleManager.SetParticleControl(imbued_ice_particle, 1, Vector(this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius"), 0));
        ParticleManager.ReleaseParticleIndex(imbued_ice_particle);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_imbued_ice", {
            duration: this.GetSpecialValueFor("buff_duration")
        });
        let allies = this.GetCasterPlus().FindUnitsInRadiusPlus(this.GetSpecialValueFor("radius"), position, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, null, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally != this.GetCasterPlus()) {
                ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_imbued_ice", {
                    duration: this.GetSpecialValueFor("buff_duration")
                });
            }
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_imbued_ice extends BaseModifier_Plus {
    public number_of_attacks: any;
    public damage_per_attack: number;
    public move_speed_slow: number;
    public move_speed_duration: number;
    public damage_table: ApplyDamageOptions;

    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.number_of_attacks = this.GetSpecialValueFor("number_of_attacks");
        this.damage_per_attack = this.GetSpecialValueFor("damage_per_attack");
        this.move_speed_slow = this.GetSpecialValueFor("move_speed_slow");
        this.move_speed_duration = this.GetSpecialValueFor("move_speed_duration");
        this.damage_table = {
            victim: undefined,
            damage: this.damage_per_attack,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetParentPlus(),
            ability: this.GetAbilityPlus()
        }
        let imbued_ice_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_apparition_chilling_touch_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(imbued_ice_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(imbued_ice_particle, false, false, -1, false, false);
        this.SetStackCount(this.number_of_attacks);
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.target.IsMagicImmune() && !keys.target.IsBuilding()) {
            this.DecrementStackCount();
            keys.target.EmitSound("Hero_Ancient_Apparition.ChillingTouch.Target");
            this.damage_table.victim = keys.target;
            ApplyDamage(this.damage_table);
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, this.damage_per_attack, undefined);
            keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_ancient_apparition_imbued_ice_slow", {
                duration: this.move_speed_duration * (1 - keys.target.GetStatusResistance())
            });
            if (this.GetStackCount() <= 0) {
                this.Destroy();
            }
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_imbued_ice_slow extends BaseModifier_Plus {
    public move_speed_slow: number;

    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.move_speed_slow = this.GetSpecialValueFor("move_speed_slow");
        } else {
            this.move_speed_slow = 0;
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed_slow;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }
}

@registerAbility()
export class imba_ancient_apparition_anti_abrasion extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Ancient_Apparition.IceVortexCast");
        let vortex_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_anti_abrasion_thinker", {
            duration: this.GetSpecialValueFor("vortex_duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_anti_abrasion_thinker extends BaseModifier_Plus {
    public radius: number;
    public vision_aoe: any;
    public vortex_duration: number;

    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.vision_aoe = this.GetSpecialValueFor("vision_aoe");
        this.vortex_duration = this.GetSpecialValueFor("vortex_duration");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.IceVortex");
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.IceVortex.lp");
        let vortex_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_anti_abrasion.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(vortex_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(vortex_particle, 5, Vector(this.radius, 0, 0));
        this.AddParticle(vortex_particle, false, false, -1, false, false);
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.vision_aoe, this.vortex_duration, false);
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Ancient_Apparition.IceVortex.lp");
        this.GetParentPlus().RemoveSelf();
    }

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
        return this.radius;
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
        return "modifier_ice_slide";
    }

    GetAuraDuration(): number {
        return 0.25;
    }
}

@registerAbility()
export class imba_ancient_apparition_ice_blast extends BaseAbility_Plus {
    public release_ability: imba_ancient_apparition_ice_blast_release;
    public ice_blast_dummy: any;
    public initial_projectile: any;

    GetAssociatedSecondaryAbilities(): string {
        return "imba_ancient_apparition_ice_blast_release";
    }

    OnUpgrade(): void {
        if (!this.release_ability) {
            this.release_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_ice_blast_release>("imba_ancient_apparition_ice_blast_release");
        }
        if (!this.release_ability) {
            this.release_ability = this.GetCasterPlus().addAbilityPlus<imba_ancient_apparition_ice_blast_release>("imba_ancient_apparition_ice_blast_release", 1);
        }
        if (this.release_ability && !this.release_ability.IsTrained()) {
            this.release_ability.SetLevel(1);
        }
    }

    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition((this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector()) as Vector);
        }
        EmitSoundOnClient("Hero_Ancient_Apparition.IceBlast.Tracker", this.GetCasterPlus().GetPlayerOwner());
        let velocity = GFuncVector.AsVector(this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()).Normalized() * this.GetSpecialValueFor("speed") as Vector;
        this.ice_blast_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_ancient_apparition_ice_blast_thinker", {
            x: velocity.x,
            y: velocity.y
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);

        let v = (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()) as Vector;
        let linear_projectile = {
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            fDistance: math.huge,
            fStartRadius: 0,
            fEndRadius: 0,
            Source: this.GetCasterPlus(),
            bDrawsOnMinimap: true,
            bVisibleToEnemies: false,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 30.0,
            bDeleteOnHit: false,
            vVelocity: Vector(velocity.x, velocity.y, 0),
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("target_sight_radius"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                direction_x: v.x,
                direction_y: v.y,
                direction_z: v.z,
                ice_blast_dummy: this.ice_blast_dummy.entindex()
            }
        }
        this.initial_projectile = ProjectileManager.CreateLinearProjectile(linear_projectile);
        if (!this.release_ability) {
            this.release_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_ice_blast_release>("imba_ancient_apparition_ice_blast_release");
        }
        if (this.release_ability) {
            this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), this.release_ability.GetAbilityName(), false, true);
        }
    }

    GetCooldown(level: number): number {
        return 20;
    }

    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        let r = AI_ability.POSITION_if_enemy(this, 1000);
        if (r) {
            this.AddTimer(1, () => {
                if (GFuncEntity.IsValid(this.release_ability)) {
                    ExecuteOrderFromTable({
                        UnitIndex: this.GetCasterPlus().entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: this.release_ability.entindex(),
                    });
                }
            })
        }
        return r;
    }

    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (data.ice_blast_dummy) {
            EntIndexToHScript(data.ice_blast_dummy).SetAbsOrigin(location);
        }
        if (!this.GetCasterPlus().IsAlive() && this.release_ability) {
            this.release_ability.OnSpellStart();
        }
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && !target.IsRealUnit()) { return }
        if (!target && data.ice_blast_dummy) {
            let npc = EntIndexToHScript(data.ice_blast_dummy) as IBaseNpc_Plus;
            let ice_blast_thinker_modifier = npc.FindModifierByNameAndCaster("modifier_imba_ancient_apparition_ice_blast_thinker", this.GetCasterPlus());
            if (ice_blast_thinker_modifier) {
                ice_blast_thinker_modifier.Destroy();
            }
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_ice_blast_thinker extends BaseModifier_Plus {
    public release_ability: any;

    IsPurgable(): boolean {
        return false;
    }

    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        let ice_blast_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_ancient_apparition/ancient_apparition_ice_blast_initial.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(ice_blast_particle, 1, Vector(params.x, params.y, 0));
        this.AddParticle(ice_blast_particle, false, false, -1, false, false);
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.release_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_ice_blast_release>("imba_ancient_apparition_ice_blast_release");
        if (this.GetAbilityPlus() && this.GetAbilityPlus().IsHidden() && this.release_ability) {
            this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), this.release_ability.GetName(), true, false);
        }
        // this.GetParentPlus().RemoveSelf();
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_ice_blast extends BaseModifier_Plus {
    public dot_damage: number;
    public kill_pct: number;
    public caster: IBaseNpc_Plus;
    public damage_table: ApplyDamageOptions;

    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }

    GetEffectName(): string {
        return "particles/units/heroes/hero_ancient_apparition/ancient_apparition_ice_blast_debuff.vpcf";
    }

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }

    Init(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.dot_damage = params.dot_damage;
        this.kill_pct = params.kill_pct;
        if (params.caster_entindex) {
            this.caster = EntIndexToHScript(params.caster_entindex) as IBaseNpc_Plus;
        } else {
            this.caster = this.GetCasterPlus();
        }
        this.damage_table = {
            victim: this.GetParentPlus(),
            damage: this.dot_damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.caster,
            ability: this.GetAbilityPlus()
        }
        this.StartIntervalThink(1 - this.GetParentPlus().GetStatusResistance());
    }


    OnIntervalThink(): void {
        this.GetParentPlus().EmitSound("Hero_Ancient_Apparition.IceBlastRelease.Tick");
        ApplyDamage(this.damage_table);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.dot_damage, undefined);
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT)
    CC_OnTakeDamageKillCredit(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && (this.GetParentPlus().GetHealth() / this.GetParentPlus().GetMaxHealth()) * 100 <= this.kill_pct) {
            if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().IsInvulnerable()) {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), this.caster);
            } else {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), keys.attacker);
            }
            if (!this.GetParentPlus().IsAlive()) {
                let ice_blast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_apparition_ice_blast_death.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(ice_blast_particle);
            }
        }
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_ice_blast_global_cooling extends BaseModifier_Plus {
    public global_cooling_move_speed_reduction: number;

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }

    BeCreated(p_0: any,): void {
        this.global_cooling_move_speed_reduction = this.GetSpecialValueFor("global_cooling_move_speed_reduction");
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.global_cooling_move_speed_reduction * (-1);
    }
}

@registerModifier()
export class modifier_imba_ancient_apparition_ice_blast_cold_hearted extends BaseModifier_Plus {
    public cold_hearted_pct: number;

    Init(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.cold_hearted_pct = this.GetSpecialValueFor("cold_hearted_pct") * 0.01;
        } else {
            this.cold_hearted_pct = 0.5;
        }
        this.SetStackCount(this.GetStackCount() + (params.regen * this.cold_hearted_pct));
    }



    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetStackCount();
    }
}

@registerAbility()
export class imba_ancient_apparition_ice_blast_release extends BaseAbility_Plus {
    public ice_blast_ability: imba_ancient_apparition_ice_blast;
    public initial_projectile: any;

    IsStealable(): boolean {
        return false;
    }

    GetAssociatedPrimaryAbilities(): string {
        return "imba_ancient_apparition_ice_blast";
    }

    ProcsMagicStick(): boolean {
        return false;
    }

    OnSpellStart(): void {
        if (!this.ice_blast_ability) {
            this.ice_blast_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_ice_blast>("imba_ancient_apparition_ice_blast");
        }
        if (this.ice_blast_ability) {
            if (this.ice_blast_ability.ice_blast_dummy && this.ice_blast_ability.initial_projectile) {
                let vector = (this.ice_blast_ability.ice_blast_dummy.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()) as Vector;
                let velocity = vector.Normalized() * math.max(vector.Length2D() / 2, 750) as Vector;
                let final_radius = math.min(this.ice_blast_ability.GetSpecialValueFor("radius_min") + ((vector.Length2D() / this.ice_blast_ability.GetSpecialValueFor("speed")) * this.ice_blast_ability.GetSpecialValueFor("radius_grow")), this.ice_blast_ability.GetSpecialValueFor("radius_max"));
                this.GetCasterPlus().EmitSound("Hero_Ancient_Apparition.IceBlastRelease.Cast");
                let ice_blast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ancient_apparition/ancient_apparition_ice_blast_final.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(ice_blast_particle, 0, this.GetCasterPlus().GetAbsOrigin());
                ParticleManager.SetParticleControl(ice_blast_particle, 1, velocity);
                ParticleManager.SetParticleControl(ice_blast_particle, 5, Vector(math.min(vector.Length2D() / velocity.Length2D(), 2), 0, 0));
                ParticleManager.ReleaseParticleIndex(ice_blast_particle);
                let marker_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_ancient_apparition/ancient_apparition_ice_blast_marker.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
                ParticleManager.SetParticleControl(marker_particle, 0, this.ice_blast_ability.ice_blast_dummy.GetAbsOrigin());
                ParticleManager.SetParticleControl(marker_particle, 1, Vector(final_radius, 1, 1));
                AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.ice_blast_ability.ice_blast_dummy.GetAbsOrigin(), 650, 4, false);
                let linear_projectile = {
                    Ability: this,
                    vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
                    fDistance: vector.Length2D(),
                    fStartRadius: this.ice_blast_ability.GetSpecialValueFor("path_radius"),
                    fEndRadius: this.ice_blast_ability.GetSpecialValueFor("path_radius"),
                    Source: this.GetCasterPlus(),
                    bHasFrontalCone: false,
                    bReplaceExisting: false,
                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE,
                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE,
                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                    fExpireTime: GameRules.GetGameTime() + 10.0,
                    bDeleteOnHit: true,
                    vVelocity: velocity,
                    bProvidesVision: true,
                    iVisionRadius: this.ice_blast_ability.GetSpecialValueFor("target_sight_radius"),
                    iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                    ExtraData: {
                        marker_particle: marker_particle,
                        final_radius: final_radius
                    }
                }
                this.initial_projectile = ProjectileManager.CreateLinearProjectile(linear_projectile);
                this.ice_blast_ability.ice_blast_dummy.Destroy();
                ProjectileManager.DestroyLinearProjectile(this.ice_blast_ability.initial_projectile);
                this.ice_blast_ability.ice_blast_dummy = undefined;
                this.ice_blast_ability.initial_projectile = undefined;
            }
            this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), this.ice_blast_ability.GetAbilityName(), false, true);
        }
    }

    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (this.ice_blast_ability) {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), location, this.ice_blast_ability.GetSpecialValueFor("target_sight_radius"), 3, false);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.ice_blast_ability.GetSpecialValueFor("path_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            let duration = this.ice_blast_ability.GetSpecialValueFor("frostbite_duration");
            if (this.GetCasterPlus().HasScepter()) {
                duration = this.ice_blast_ability.GetSpecialValueFor("frostbite_duration_scepter");
            }
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.IsInvulnerable()) {
                    enemy.AddNewModifier(enemy, this.ice_blast_ability, "modifier_imba_ancient_apparition_ice_blast", {
                        duration: duration * (1 - enemy.GetStatusResistance()),
                        dot_damage: this.ice_blast_ability.GetSpecialValueFor("dot_damage"),
                        kill_pct: this.ice_blast_ability.GetSpecialValueFor("kill_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_ice_blast_kill_threshold"),
                        caster_entindex: this.GetCasterPlus().entindex()
                    });
                } else {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.ice_blast_ability, "modifier_imba_ancient_apparition_ice_blast", {
                        duration: duration * (1 - enemy.GetStatusResistance()),
                        dot_damage: this.ice_blast_ability.GetSpecialValueFor("dot_damage"),
                        kill_pct: this.ice_blast_ability.GetSpecialValueFor("kill_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_ancient_apparition_ice_blast_kill_threshold")
                    });
                }
            }
        }
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && !target.IsRealUnit()) { return }
        if (!target && this.ice_blast_ability) {
            EmitSoundOnLocationWithCaster(location, "Hero_Ancient_Apparition.IceBlast.Target", this.GetCasterPlus());
            if (data.marker_particle) {
                ParticleManager.ClearParticle(data.marker_particle, false);
            }
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, data.final_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            let damage = this.ice_blast_ability.GetSpecialValueFor("AbilityDamage");
            let damageTable: ApplyDamageOptions = {
                victim: undefined,
                damage: damage,
                damage_type: this.ice_blast_ability.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            let duration = this.ice_blast_ability.GetSpecialValueFor("frostbite_duration");
            if (this.GetCasterPlus().HasScepter()) {
                duration = this.ice_blast_ability.GetSpecialValueFor("frostbite_duration_scepter");
            }
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.IsInvulnerable()) {
                    enemy.AddNewModifier(enemy, this.ice_blast_ability, "modifier_imba_ancient_apparition_ice_blast", {
                        duration: duration * (1 - enemy.GetStatusResistance()),
                        dot_damage: this.ice_blast_ability.GetSpecialValueFor("dot_damage"),
                        kill_pct: this.ice_blast_ability.GetSpecialValueFor("kill_pct"),
                        caster_entindex: this.GetCasterPlus().entindex()
                    });
                } else {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.ice_blast_ability, "modifier_imba_ancient_apparition_ice_blast", {
                        duration: duration * (1 - enemy.GetStatusResistance()),
                        dot_damage: this.ice_blast_ability.GetSpecialValueFor("dot_damage"),
                        kill_pct: this.ice_blast_ability.GetSpecialValueFor("kill_pct")
                    });
                }
                if (!enemy.IsMagicImmune()) {
                    damageTable.victim = enemy;
                    ApplyDamage(damageTable);
                }
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.ice_blast_ability, "modifier_imba_ancient_apparition_ice_blast_cold_hearted", {
                    duration: duration,
                    regen: enemy.GetHealthRegen()
                });
            }
        }
    }
}

@registerModifier()
export class modifier_special_bonus_imba_ancient_apparition_chilling_touch_range extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ancient_apparition_ice_vortex_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ancient_apparition_chilling_touch_damage extends BaseModifier_Plus {
    public chilling_touch_ability: any;
    public imbued_ice_ability: any;

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
        this.chilling_touch_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_chilling_touch>("imba_ancient_apparition_chilling_touch");
        this.imbued_ice_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_imbued_ice>("imba_ancient_apparition_imbued_ice");
        if (this.chilling_touch_ability && this.imbued_ice_ability) {
            this.imbued_ice_ability.SetHidden(false);
            this.imbued_ice_ability.SetLevel(this.chilling_touch_ability.GetLevel());
        }
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.imbued_ice_ability) {
            this.imbued_ice_ability.SetHidden(true);
        }
    }
}

@registerModifier()
export class modifier_special_bonus_imba_ancient_apparition_ice_vortex_boost extends BaseModifier_Plus {
    public ice_vortex_ability: any;
    public anti_abrasion_ability: any;

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
        this.ice_vortex_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_ice_vortex>("imba_ancient_apparition_ice_vortex");
        this.anti_abrasion_ability = this.GetCasterPlus().findAbliityPlus<imba_ancient_apparition_anti_abrasion>("imba_ancient_apparition_anti_abrasion");
        if (this.ice_vortex_ability && this.anti_abrasion_ability) {
            this.anti_abrasion_ability.SetHidden(false);
            this.anti_abrasion_ability.SetLevel(this.ice_vortex_ability.GetLevel());
        }
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.anti_abrasion_ability) {
            this.anti_abrasion_ability.SetHidden(true);
        }
    }
}

@registerModifier()
export class modifier_special_bonus_imba_ancient_apparition_ice_blast_kill_threshold extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ancient_apparition_cold_feet_aoe extends BaseModifier_Plus {
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
