
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus, BaseOrbAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_outworld_devourer_arcane_orb extends BaseOrbAbility_Plus {
    public damage_dealt: number;
    public particle_explosion_fx: any;
    public particle_explosion_scatter_fx: any;
    GetIntrinsicModifierName(): string {
        return "modifier_generic_orb_effect_lua";
    }
    GetProjectileName() {
        return "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_arcane_orb.vpcf";
    }
    OnOrbFire() {
        this.GetCasterPlus().EmitSound("Hero_ObsidianDestroyer.ArcaneOrb");
        if (this.GetCasterPlus().HasModifier("modifier_imba_outworld_devourer_essence_flux")) {
            this.GetCasterPlus().findBuff<modifier_imba_outworld_devourer_essence_flux>("modifier_imba_outworld_devourer_essence_flux").RollForProc();
        }
    }
    OnOrbImpact(keys: ModifierAttackEvent) {
        if (!keys.target.IsMagicImmune()) {
            let damage = this.GetCasterPlus().GetMana() * this.GetTalentSpecialValueFor("mana_pool_damage_pct") * 0.01;
            if (keys.target.IsIllusion() || keys.target.IsSummoned()) {
                damage = damage + this.GetSpecialValueFor("universe_bonus_dmg");
            }
            this.damage_dealt = ApplyDamage({
                victim: keys.target,
                damage: damage,
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, damage, undefined);
            if ((keys.target.IsIllusion() || keys.target.IsSummoned()) && this.damage_dealt > 0 && this.damage_dealt >= keys.target.GetHealth()) {
                this.particle_explosion_fx = ResHelper.CreateParticleEx("particles/hero/outworld_devourer/arcane_orb_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.target);
                ParticleManager.SetParticleControl(this.particle_explosion_fx, 1, keys.target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.particle_explosion_fx);
                this.particle_explosion_scatter_fx = ResHelper.CreateParticleEx("particles/hero/outworld_devourer/arcane_orb_explosion_f.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(this.particle_explosion_scatter_fx, 0, keys.target.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_explosion_scatter_fx, 3, Vector(this.GetSpecialValueFor("universe_splash_radius"), 0, 0));
                ParticleManager.ReleaseParticleIndex(this.particle_explosion_scatter_fx);
                for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), keys.target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("universe_splash_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                    ApplyDamage({
                        victim: enemy,
                        damage: damage - this.GetSpecialValueFor("universe_bonus_dmg"),
                        damage_type: this.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this
                    });
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, damage - this.GetSpecialValueFor("universe_bonus_dmg"), undefined);
                }
            }
            if (this.GetCasterPlus().HasAbility("imba_outworld_devourer_sanity_eclipse") && this.GetCasterPlus().findAbliityPlus<imba_outworld_devourer_sanity_eclipse>("imba_outworld_devourer_sanity_eclipse").IsTrained() && (keys.target.IsRealHero() || keys.target.IsIllusion()) && keys.target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_outworld_devourer_sanity_eclipse>("imba_outworld_devourer_sanity_eclipse"), "modifier_imba_outworld_devourer_sanity_eclipse_charge", {
                    duration: this.GetSpecialValueFor("counter_duration"),
                    charges: 1
                });
            }
        }
        return 1
    }
}
@registerAbility()
export class imba_outworld_devourer_astral_imprisonment extends BaseAbility_Plus {
    RequiresScepterForCharges() {
        return true;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_outworld_devourer_astral_imprisonment_movement";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastRange(location, target);
        } else {
            return super.GetCastRange(location, target) + this.GetSpecialValueFor("scepter_range_bonus");
        }
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return 0;
        }
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().HasModifier("modifier_generic_charges")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!target.TriggerSpellAbsorb(this)) {
            target.EmitSound("Hero_ObsidianDestroyer.AstralImprisonment");
            let prison_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_outworld_devourer_astral_imprisonment_prison", {
                duration: this.GetSpecialValueFor("prison_duration")
            });
            if (prison_modifier && target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                prison_modifier.SetDuration(this.GetSpecialValueFor("prison_duration") * (1 - target.GetStatusResistance()), true);
                this.GetCasterPlus().AddNewModifier(target, this, "modifier_imba_outworld_devourer_astral_imprisonment_movement", {
                    duration: this.GetSpecialValueFor("prison_duration") * (1 - target.GetStatusResistance())
                });
            } else {
                this.GetCasterPlus().AddNewModifier(target, this, "modifier_imba_outworld_devourer_astral_imprisonment_movement", {
                    duration: this.GetSpecialValueFor("prison_duration")
                });
            }
            if (this.GetCasterPlus().HasAbility("imba_outworld_devourer_sanity_eclipse") && this.GetCasterPlus().findAbliityPlus<imba_outworld_devourer_sanity_eclipse>("imba_outworld_devourer_sanity_eclipse").IsTrained() && (target.IsRealHero() || target.IsIllusion()) && target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_outworld_devourer_sanity_eclipse>("imba_outworld_devourer_sanity_eclipse"), "modifier_imba_outworld_devourer_sanity_eclipse_charge", {
                    duration: this.GetSpecialValueFor("counter_duration"),
                    charges: 3
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_outworld_devourer_astral_imprisonment_prison extends BaseModifier_Plus {
    public damage: number;
    public radius: number;
    public universal_movespeed: number;
    public damage_type: number;
    public movement_position: any;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.damage = this.GetAbilityPlus().GetTalentSpecialValueFor("damage");
        this.radius = this.GetSpecialValueFor("radius");
        this.universal_movespeed = this.GetSpecialValueFor("universal_movespeed");
        if (this.GetParentPlus() != this.GetCasterPlus() && this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            this.universal_movespeed = this.universal_movespeed * 2;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        let ring_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
        this.AddParticle(ring_particle, false, false, -1, false, false);
    }
    OnIntervalThink(): void {
        if (this.movement_position && this.GetAbilityPlus()) {
            if (this.GetParentPlus().GetAbsOrigin() != this.movement_position) {
                this.GetParentPlus().SetAbsOrigin(this.GetParentPlus().GetAbsOrigin() + ((this.movement_position - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized() * math.min(FrameTime() * this.universal_movespeed, (this.movement_position - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D())) as Vector);
            } else {
                this.movement_position = undefined;
                this.StartIntervalThink(-1);
            }
        } else {
            this.StartIntervalThink(-1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            return {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
            };
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_ObsidianDestroyer.AstralImprisonment");
        this.GetParentPlus().EmitSound("Hero_ObsidianDestroyer.AstralImprisonment.End");
        let end_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison_end_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(end_particle, 1, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(end_particle);
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), true);
        for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            ApplyDamage({
                victim: enemy,
                damage: this.damage,
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, this.damage, undefined);
        }
    }
}
@registerAbility()
export class imba_outworld_devourer_essence_flux extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_outworld_devourer_essence_flux";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_ObsidianDestroyer.Equilibrium.Cast");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_outworld_devourer_essence_flux_active", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_imba_outworld_devourer_essence_flux extends BaseModifier_Plus {
    public proc_particle: any;
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
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsToggle() && !keys.ability.IsItem() && keys.ability.GetName() !== "imba_outworld_devourer_astral_imprisonment_movement" && this.GetParentPlus().GetMaxMana) {
            this.RollForProc();
        }
    }
    RollForProc() {
        if (GFuncRandom.PRD(this.GetSpecialValueFor("proc_chance"), this)) {
            this.proc_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_essence_effect.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.proc_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(this.proc_particle);
            this.GetParentPlus().GiveMana(this.GetParentPlus().GetMaxMana() * this.GetSpecialValueFor("mana_restore") * 0.01);
        }
    }
}
@registerModifier()
export class modifier_imba_outworld_devourer_essence_flux_active extends BaseModifier_Plus {
    public mana_steal_active: any;
    public movement_slow: any;
    public slow_duration: number;
    public duration: number;
    public equal_atk_speed_diff: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_obsidian_matter.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.mana_steal_active = this.GetSpecialValueFor("mana_steal_active");
        this.movement_slow = this.GetSpecialValueFor("movement_slow");
        this.slow_duration = this.GetSpecialValueFor("slow_duration");
        this.duration = this.GetSpecialValueFor("duration");
        this.equal_atk_speed_diff = this.GetSpecialValueFor("equal_atk_speed_diff");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.equal_atk_speed_diff * this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetCasterPlus()) {
            keys.unit.EmitSound("Hero_ObsidianDestroyer.Equilibrium.Damage");
            keys.unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_outworld_devourer_essence_flux_debuff", {
                duration: this.slow_duration * (1 - keys.unit.GetStatusResistance())
            });
            this.IncrementStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_outworld_devourer_essence_flux_debuff extends BaseModifier_Plus {
    public movement_slow: any;
    public slow_duration: number;
    public equal_atk_speed_diff: number;
    public particle: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_obsidian_matter_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.movement_slow = this.GetAbilityPlus().GetTalentSpecialValueFor("movement_slow") * (-1);
        this.slow_duration = this.GetSpecialValueFor("slow_duration");
        this.equal_atk_speed_diff = this.GetSpecialValueFor("equal_atk_speed_diff") * (-1);
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle, 2, this.GetParentPlus().GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetDuration(this.slow_duration * (1 - this.GetParentPlus().GetStatusResistance()), true);
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.equal_atk_speed_diff * this.GetStackCount();
    }
}
@registerAbility()
export class imba_outworld_devourer_astral_imprisonment_movement extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    CastFilterResultLocation(location: Vector): UnitFilterResult {
        if (this.GetCasterPlus().HasModifier("modifier_imba_outworld_devourer_astral_imprisonment_movement")) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorLocation(location: Vector): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_outworld_devourer_astral_imprisonment_movement")) {
            return "#dota_hud_error_no_astral_imprisonments_active";
        }
    }
    OnSpellStart(): void {
        for (const [_, astral_mod] of ipairs(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_outworld_devourer_astral_imprisonment_movement"))) {
            if (astral_mod.GetCasterPlus().HasModifier("modifier_imba_outworld_devourer_astral_imprisonment_prison")) {
                let prison_modifier = astral_mod.GetCasterPlus().findBuff<modifier_imba_outworld_devourer_astral_imprisonment_prison>("modifier_imba_outworld_devourer_astral_imprisonment_prison");
                prison_modifier.movement_position = this.GetCursorPosition();
                prison_modifier.OnIntervalThink();
                prison_modifier.StartIntervalThink(FrameTime());
            }
        }
    }
}
@registerModifier()
export class modifier_imba_outworld_devourer_astral_imprisonment_movement extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerAbility()
export class imba_outworld_devourer_sanity_eclipse extends BaseAbility_Plus {
    public eclipse_cast_particle: any;
    public eclipse_damage_particle: ParticleID;
    public eclipse_mana_particle: any;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_ObsidianDestroyer.SanityEclipse.Cast");
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_ObsidianDestroyer.SanityEclipse", this.GetCasterPlus());
        this.eclipse_cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_area.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.eclipse_cast_particle, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.eclipse_cast_particle, 1, Vector(this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius"), 1));
        ParticleManager.SetParticleControl(this.eclipse_cast_particle, 2, Vector(1, 1, this.GetSpecialValueFor("radius")));
        ParticleManager.ReleaseParticleIndex(this.eclipse_cast_particle);
        for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false))) {
            if (((!enemy.IsInvulnerable() && !enemy.IsOutOfGame()) || enemy.HasModifier("modifier_imba_outworld_devourer_astral_imprisonment_prison")) && enemy.GetMaxMana) {
                this.eclipse_damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_damage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                ParticleManager.ReleaseParticleIndex(this.eclipse_damage_particle);
                if (!enemy.IsIllusion() && (GFuncEntity.Custom_bIsStrongIllusion(enemy))) {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.GetSpecialValueFor("base_damage") + ((this.GetCasterPlus().GetMaxMana() - enemy.GetMaxMana()) * this.GetTalentSpecialValueFor("damage_multiplier")),
                        damage_type: this.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
                        attacker: this.GetCasterPlus(),
                        ability: this
                    });
                } else if (enemy.IsIllusion() && (GFuncEntity.Custom_bIsStrongIllusion(enemy))) {
                    enemy.Kill(this, this.GetCasterPlus());
                }
                if (enemy.IsAlive() && enemy.GetMaxMana) {
                    this.eclipse_mana_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_mana_loss.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                    ParticleManager.ReleaseParticleIndex(this.eclipse_mana_particle);
                    enemy.ReduceMana(enemy.GetMaxMana() * this.GetSpecialValueFor("max_mana_burn_pct") * 0.01);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_outworld_devourer_sanity_eclipse_charge extends BaseModifier_Plus {
    public stack_mana: number;
    BeCreated(keys: any): void {
        if (keys && keys.charges) {
            this.SetStackCount(this.GetStackCount() + keys.charges);
        }
        this.stack_mana = this.GetSpecialValueFor("stack_mana");
        if (!IsServer()) {
            return;
        }
        // this.GetParentPlus().CalculateStatBonus(true);
    }
    BeRefresh(keys: any): void {
        this.OnCreated(keys);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.GetStackCount() * this.stack_mana;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_outworld_devourer_sanity_eclipse_multiplier extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_outworld_devourer_arcane_orb_damage extends BaseModifier_Plus {
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
