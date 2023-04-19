
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_chen_penitence extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().GetUnitName().includes("centchenaur") && RollPercentage(50)) {
            this.GetCasterPlus().EmitSound("chen_chen_ability_penit_0" + RandomInt(2, 3));
        }
        this.GetCasterPlus().EmitSound("Hero_Chen.PenitenceCast");
        let projectile = {
            Target: this.GetCursorTarget(),
            Source: this.GetCasterPlus(),
            Ability: this,
            EffectName: "particles/units/heroes/hero_chen/chen_penitence_proj.vpcf",
            iMoveSpeed: this.GetSpecialValueFor("speed"),
            vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 20,
            bProvidesVision: false,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1
        }
        ProjectileManager.CreateTrackingProjectile(projectile);
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, kv: any): boolean | void {
        if (!IsServer() || !hTarget) {
            return;
        }
        if (hTarget && !hTarget.IsRealUnit()) { return }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return undefined;
        }
        hTarget.EmitSound("Hero_Chen.PenitenceImpact");
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_penitence.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, hTarget);
        ParticleManager.ReleaseParticleIndex(particle);
        hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_penitence", {
            duration: this.GetSpecialValueFor("duration") * (1 - hTarget.GetStatusResistance())
        });
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_chen_remnants_of_penitence")) {
            hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_penitence_remnants", {
                duration: this.GetSpecialValueFor("duration") * (1 - hTarget.GetStatusResistance())
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_chen_remnants_of_penitence") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_chen_remnants_of_penitence")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_chen_remnants_of_penitence"), "modifier_special_bonus_imba_chen_remnants_of_penitence", {});
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
export class modifier_imba_chen_penitence extends BaseModifier_Plus {
    public bonus_movement_speed: number;
    public buff_duration: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_chen/chen_penitence_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_movement_speed = this.GetSpecialValueFor("bonus_movement_speed");
        this.buff_duration = this.GetSpecialValueFor("buff_duration");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_START
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_movement_speed;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus() && keys.attacker.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_chen_penitence_buff", {
                duration: this.buff_duration || 2
            });
        }
    }
}
@registerModifier()
export class modifier_imba_chen_penitence_buff extends BaseModifier_Plus {
    public bonus_attack_speed: number;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");
        if (this.GetParentPlus().IsCreep()) {
            this.bonus_attack_speed = this.bonus_attack_speed * this.GetSpecialValueFor("creep_mult");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
}
@registerModifier()
export class modifier_imba_chen_penitence_remnants extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_chen_remnants_of_penitence");
    }
}
@registerAbility()
export class imba_chen_divine_favor extends BaseAbility_Plus {
    public responses: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_chen_divine_favor_aura";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
    GetCooldown(iLevel: number): number {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_chen_divine_favor_cd_reduction");
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().GetUnitName().includes("centchenaur")) {
            if (RollPercentage(50)) {
                if (!this.responses) {
                    this.responses = {
                        ["chen_chen_ability_holyp_01"]: 0,
                        ["chen_chen_move_07"]: 0
                    }
                }
                if (this.responses["chen_chen_ability_holyp_01"] == 0 || GameRules.GetDOTATime(true, true) - this.responses["chen_chen_ability_holyp_01"] >= 120) {
                    this.GetCasterPlus().EmitSound("chen_chen_ability_holyp_01");
                    this.responses["chen_chen_ability_holyp_01"] = GameRules.GetDOTATime(true, true);
                } else if (this.responses["chen_chen_move_07"] == 0 || GameRules.GetDOTATime(true, true) - this.responses["chen_chen_move_07"] >= 120) {
                    this.GetCasterPlus().EmitSound("chen_chen_move_07");
                    this.responses["chen_chen_move_07"] = GameRules.GetDOTATime(true, true);
                }
            }
        }
        this.GetCasterPlus().EmitSound("Hero_Chen.DivineFavor.Cast");
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_divine_favor.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCursorTarget());
        ParticleManager.ReleaseParticleIndex(particle);
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_divine_favor", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_chen_divine_favor_cd_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_chen_divine_favor_cd_reduction")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_chen_divine_favor_cd_reduction"), "modifier_special_bonus_imba_chen_divine_favor_cd_reduction", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => { return unit != this.GetCasterPlus() && !unit.HasModifier("modifier_imba_chen_divine_favor") });
    }
}
@registerModifier()
export class modifier_imba_chen_divine_favor extends BaseModifier_Plus {
    public heal_amp: any;
    public heal_rate: any;
    public damage_bonus: number;
    public creep_damage_mult: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_chen/chen_divine_favor_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.heal_amp = this.GetSpecialValueFor("heal_amp");
        this.heal_rate = this.GetSpecialValueFor("heal_rate");
        this.damage_bonus = this.GetSpecialValueFor("damage_bonus");
        this.creep_damage_mult = this.GetSpecialValueFor("creep_damage_mult");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
        4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_SOURCE)
    Custom_AllHealAmplify_Percentage() {
        return this.heal_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.heal_rate;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetParentPlus().IsRealUnit()) {
            return this.damage_bonus * this.creep_damage_mult;
        } else {
            return this.damage_bonus;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.heal_amp;
    }
}
@registerModifier()
export class modifier_imba_chen_divine_favor_aura extends BaseModifier_Plus {
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
        return this.GetSpecialValueFor("aura_radius");
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
        return "modifier_imba_chen_divine_favor_aura_buff";
    }
    GetAuraEntityReject(hTarget: IBaseNpc_Plus): boolean {
        return this.GetCasterPlus().PassivesDisabled() || (!hTarget.GetOwnerEntity()) || hTarget.HasModifier("modifier_imba_chen_divine_favor");
    }
}
@registerModifier()
export class modifier_imba_chen_divine_favor_aura_buff extends BaseModifier_Plus {
    public heal_amp_aura: any;
    public heal_rate_aura: any;
    public damage_bonus_aura: number;
    public army_damage_multiplier: number;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.heal_amp_aura = this.GetSpecialValueFor("heal_amp_aura");
            this.heal_rate_aura = this.GetSpecialValueFor("heal_rate_aura");
            this.damage_bonus_aura = this.GetSpecialValueFor("damage_bonus_aura");
            this.army_damage_multiplier = this.GetSpecialValueFor("army_damage_multiplier");
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
        4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
    });
    } */
    Custom_AllHealAmplify_Percentage() {
        return this.heal_amp_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.heal_rate_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetParentPlus().IsRealUnit()) {
            return this.damage_bonus_aura * this.army_damage_multiplier;
        } else {
            return this.damage_bonus_aura;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.heal_amp_aura;
    }
}
@registerAbility()
export class imba_chen_holy_persuasion extends BaseAbility_Plus {
    teleport_vector: Vector;
    immortalize_vector: Vector;
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        if (IsServer() && hTarget && hTarget.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return 0;
        } else {
            return super.GetCastRange(vLocation, hTarget);
        }
    }
    CastFilterResultTarget(hTarget: IBaseNpc_Plus): UnitFilterResult {
        if (hTarget.GetUnitLabel() == "living_tower") {
            return UnitFilterResult.UF_FAIL_ANCIENT;
        }
        if (!IsServer()) {
            return;
        }
        if (hTarget == this.GetCasterPlus() || (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsCreep()) && hTarget.GetLevel() <= this.GetSpecialValueFor("level_req") && (!hTarget.IsAncient() || (hTarget.IsAncient() && this.GetCasterPlus().HasAbility("imba_chen_hand_of_god") && this.GetCasterPlus().findAbliityPlus<imba_chen_hand_of_god>("imba_chen_hand_of_god").IsTrained() && this.GetCasterPlus().HasScepter())) || (hTarget.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && (hTarget.IsRealUnit() || hTarget.IsClone() || hTarget.GetOwnerEntity() == this.GetCasterPlus() || (hTarget.GetPlayerID() == this.GetCasterPlus().GetPlayerID()) || hTarget.IsOther()))) {
            return UnitFilterResult.UF_SUCCESS;
        } else if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsCreep() && hTarget.GetLevel() > this.GetSpecialValueFor("level_req")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsCreep() && hTarget.IsAncient()) {
            return UnitFilterResult.UF_FAIL_ANCIENT;
        } else if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsConsideredHero()) {
            return UnitFilterResult.UF_FAIL_HERO;
        } else if (hTarget.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilterResult.UF_FAIL_OTHER;
        }
    }
    GetCustomCastErrorTarget(hTarget: IBaseNpc_Plus): string {
        if (!IsServer()) {
            return;
        }
        if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && hTarget.IsCreep() && hTarget.GetLevel() > this.GetSpecialValueFor("level_req")) {
            return "#dota_hud_error_cant_cast_creep_level";
        } else if (hTarget.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return "#dota_hud_error_cant_cast_on_creep_not_player_controlled";
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetLevel() == this.GetMaxLevel() && this.GetCasterPlus().GetUnitName().includes("chen")) {
            this.GetCasterPlus().EmitSound("chen_chen_item_04");
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        let weapon_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_teleport_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(weapon_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(weapon_particle);
        if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.GetCasterPlus().EmitSound("Hero_Chen.HolyPersuasionCast");
            target.EmitSound("Hero_Chen.HolyPersuasionEnemy");
            target.Purge(true, true, false, false, false);
            // if (target.GetUnitName().includes("guys_")) {
            let new_lane_creep = this.GetCasterPlus().CreateSummon(target.GetUnitName(), target.GetAbsOrigin(), 60, false);
            new_lane_creep.SetBaseMaxHealth(target.GetMaxHealth());
            new_lane_creep.SetHealth(target.GetHealth());
            new_lane_creep.SetBaseDamageMin(target.GetBaseDamageMin());
            new_lane_creep.SetBaseDamageMax(target.GetBaseDamageMax());
            new_lane_creep.SetMinimumGoldBounty(target.GetGoldBounty());
            new_lane_creep.SetMaximumGoldBounty(target.GetGoldBounty());
            target.AddNoDraw();
            target.ForceKill(false);
            target = new_lane_creep;
            // }
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_holy_persuasion_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControl(particle, 1, target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle);
            if (target.GetMaxHealth() < this.GetSpecialValueFor("health_min")) {
                let health_difference = this.GetSpecialValueFor("health_min") - target.GetMaxHealth();
                target.SetBaseMaxHealth(target.GetMaxHealth() + health_difference);
                target.SetHealth(target.GetHealth() + health_difference);
            }
            if (target.SetMana && target.GetMaxMana) {
                target.SetMana(target.GetMaxMana());
            }
            target.SetOwner(this.GetCasterPlus());
            target.SetTeam(this.GetCasterPlus().GetTeam());
            // target.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), false);
            if (!this.GetAutoCastState()) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion", {});
                let persuasion_tracker_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_tracker", {}) as modifier_imba_chen_holy_persuasion_tracker;
                persuasion_tracker_modifier.creep = target;
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_counter", {});
                let persuaded_creeps_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_tracker") as modifier_imba_chen_holy_persuasion_tracker[];
                let persuaded_creeps_count = GameFunc.GetCount(persuaded_creeps_modifiers);
                let persuaded_ancient_creeps_count = 0;
                let first_ancient_creep = undefined;
                let first_ancient_creep_modifier = undefined;
                for (const [_, modifier] of GameFunc.iPair(persuaded_creeps_modifiers)) {
                    if (!modifier.creep || modifier.creep.IsNull()) {
                        modifier.Destroy();
                    } else if (modifier.creep.IsAncient()) {
                        persuaded_ancient_creeps_count = persuaded_ancient_creeps_count + 1;
                        if (persuaded_ancient_creeps_count == 1) {
                            first_ancient_creep = modifier.creep;
                            first_ancient_creep_modifier = modifier;
                        }
                    }
                }
                if (this.GetCasterPlus().HasScepter()) {
                    let hand_of_god_ability = this.GetCasterPlus().findAbliityPlus<imba_chen_hand_of_god>("imba_chen_hand_of_god");
                    if (hand_of_god_ability && hand_of_god_ability.IsTrained() && target.IsAncient() && persuaded_ancient_creeps_count > hand_of_god_ability.GetSpecialValueFor("ancient_creeps_scepter")) {
                        first_ancient_creep.ForceKill(false);
                        first_ancient_creep_modifier.Destroy();
                    }
                }
                persuaded_creeps_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_tracker") as modifier_imba_chen_holy_persuasion_tracker[];
                persuaded_creeps_count = GameFunc.GetCount(persuaded_creeps_modifiers);
                if (persuaded_creeps_count > this.GetTalentSpecialValueFor("max_units") && persuaded_creeps_modifiers[0]) {
                    persuaded_creeps_modifiers[0].creep.ForceKill(false);
                    persuaded_creeps_modifiers[0].Destroy();
                }
            } else {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_immortalized", {});
                let immortalized_tracker_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_immortalized_tracker", {}) as modifier_imba_chen_holy_persuasion_tracker;
                immortalized_tracker_modifier.creep = target;
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_immortalized_counter", {});
                let immortalized_creeps_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_immortalized_tracker") as modifier_imba_chen_holy_persuasion_tracker[];
                let immortalized_creeps_count = GameFunc.GetCount(immortalized_creeps_modifiers);
                let immortalized_ancient_creeps_count = 0;
                let first_ancient_creep = undefined;
                let first_ancient_creep_modifier = undefined;
                for (const [_, modifier] of GameFunc.iPair(immortalized_creeps_modifiers)) {
                    if (!modifier.creep || modifier.creep.IsNull()) {
                        modifier.Destroy();
                    } else if (modifier.creep.IsAncient()) {
                        immortalized_ancient_creeps_count = immortalized_ancient_creeps_count + 1;
                        if (immortalized_ancient_creeps_count == 1) {
                            first_ancient_creep = modifier.creep;
                            first_ancient_creep_modifier = modifier;
                        }
                    }
                }
                if (this.GetCasterPlus().HasScepter()) {
                    let hand_of_god_ability = this.GetCasterPlus().findAbliityPlus<imba_chen_hand_of_god>("imba_chen_hand_of_god");
                    if (hand_of_god_ability && hand_of_god_ability.IsTrained() && target.IsAncient() && immortalized_ancient_creeps_count > hand_of_god_ability.GetSpecialValueFor("ancient_creeps_scepter")) {
                        first_ancient_creep.ForceKill(false);
                        first_ancient_creep_modifier.Destroy();
                    }
                }
                immortalized_creeps_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_immortalized_tracker") as modifier_imba_chen_holy_persuasion_tracker[];
                immortalized_creeps_count = GameFunc.GetCount(immortalized_creeps_modifiers);
                if (immortalized_creeps_count > this.GetTalentSpecialValueFor("immortalize_max_units") && immortalized_creeps_modifiers[0]) {
                    immortalized_creeps_modifiers[0].creep.ForceKill(false);
                    immortalized_creeps_modifiers[0].Destroy();
                }
            }
            // let target_xp = target.GetDeathXP();
            // let target_gold_min = target.GetMinimumGoldBounty();
            // let target_gold_max = target.GetMaximumGoldBounty();
            // let commonwealth_xp = target_xp * this.GetSpecialValueFor("commonwealth_pct") * 0.01;
            // let commonwealth_gold = RandomInt(target_gold_min, target_gold_max) * this.GetSpecialValueFor("commonwealth_pct") * 0.01;
            // let commonwealth_xp_self = commonwealth_xp * this.GetSpecialValueFor("commonwealth_caster_pct") * 0.01;
            // let commonwealth_gold_self = commonwealth_gold * this.GetSpecialValueFor("commonwealth_caster_pct") * 0.01;
            // let commonwealth_xp_others_total = commonwealth_xp - commonwealth_xp_self;
            // let commonwealth_gold_others_total = commonwealth_gold - commonwealth_gold_self;
            // target.SetDeathXP(math.max(target_xp - commonwealth_xp, 0));
            // target.SetMinimumGoldBounty(math.max(target_gold_min - commonwealth_gold, 0));
            // target.SetMaximumGoldBounty(math.max(target_gold_max - commonwealth_gold, 0));
            // this.GetCasterPlus().AddExperience(commonwealth_xp_self, EDOTA_ModifyXP_Reason.DOTA_ModifyXP_CreepKill, true, true);
            // this.GetCasterPlus().ModifyGold(commonwealth_gold_self, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_CreepKill);
            // SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, this.GetCasterPlus(), commonwealth_xp_self, undefined);
            // SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, this.GetCasterPlus(), commonwealth_gold_self, undefined);
            // let ally_num = PlayerResource.GetPlayerCountForTeam(this.GetCasterPlus().GetTeamNumber());
            // let commonwealth_xp_others = math.max(commonwealth_xp_others_total / math.max(ally_num - 1, 1), 0);
            // let commonwealth_gold_others = math.max(commonwealth_gold_others_total / math.max(ally_num - 1, 1), 0);
            // for (let ally = 0; ally < ally_num; ally++) {
            // let hero = PlayerResource.GetPlayer(PlayerResource.GetNthPlayerIDOnTeam(this.GetCasterPlus().GetTeamNumber(), ally)).GetAssignedHero();
            // if (hero != this.GetCasterPlus()) {
            // hero.AddExperience(commonwealth_xp_others, EDOTA_ModifyXP_Reason.DOTA_ModifyXP_CreepKill, true, true);
            // hero.ModifyGold(commonwealth_gold_others, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_CreepKill);
            // SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, this.GetCasterPlus(), commonwealth_xp_self, undefined);
            // SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, this.GetCasterPlus(), commonwealth_gold_self, undefined);
            // }
            // }
        } else {
            if (target == this.GetCasterPlus()) {
                let owned_units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false) as IBaseNpc_Plus[];
                for (const [_, owned_unit] of GameFunc.iPair(owned_units)) {
                    if (owned_unit != this.GetCasterPlus() && !owned_unit.IsIllusion() && (owned_unit.GetOwnerEntity() == this.GetCasterPlus() || (owned_unit.GetPlayerID() == this.GetCasterPlus().GetPlayerID())) && !owned_unit.HasModifier("modifier_imba_chen_holy_persuasion_teleport")) {
                        owned_unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_teleport", {
                            duration: this.GetSpecialValueFor("teleport_delay")
                        });
                    }
                }
            } else {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_holy_persuasion_teleport", {
                    duration: this.GetSpecialValueFor("teleport_delay")
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
export class modifier_imba_chen_holy_persuasion extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
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
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus() || !this.GetAbilityPlus() || !this.GetParentPlus().IsAlive()) {
            this.GetParentPlus().ForceKill(false);
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DOMINATED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_DEATH,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("movement_speed_bonus");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (!IsValid(this.GetCasterPlus())) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            let persuaded_creeps_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_tracker") as modifier_imba_chen_holy_persuasion_tracker[];
            for (const [_, modifier] of GameFunc.iPair(persuaded_creeps_modifiers)) {
                if (modifier.creep == this.GetParentPlus()) {
                    modifier.Destroy();
                    this.Destroy();
                    return;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_chen_holy_persuasion_tracker extends BaseModifier_Plus {
    creep: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_chen_holy_persuasion_counter")) {
            this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_chen_holy_persuasion_counter", this.GetCasterPlus()).SetStackCount(GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName(this.GetName())));
        }
    }
}
@registerModifier()
export class modifier_imba_chen_holy_persuasion_counter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    OnStackCountChanged(p_0: number,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() == 0) {
            this.Destroy();
        }
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_tracker")));
    }

}
@registerModifier()
export class modifier_imba_chen_holy_persuasion_teleport extends BaseModifier_Plus {
    public distance: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_chen/chen_teleport.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.distance = this.GetSpecialValueFor("teleport_distance");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Chen.TeleportLoop");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Chen.TeleportLoop");
        if (this.GetRemainingTime() <= 0) {
            let caster_position = this.GetCasterPlus().GetAbsOrigin();
            if (this.GetAbilityPlus() && this.GetCasterPlus() && this.GetCasterPlus().IsAlive()) {
                let ability = this.GetAbilityPlus<imba_chen_holy_persuasion>();
                if (!ability.teleport_vector) {
                    ability.teleport_vector = Vector(this.distance, 0, 0);
                }
                EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_Chen.TeleportOut", this.GetCasterPlus());
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_teleport_flash.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(particle);
                FindClearSpaceForUnit(this.GetParentPlus(), this.GetCasterPlus().GetAbsOrigin() + ability.teleport_vector as Vector, false);
                EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_Chen.TeleportIn", this.GetCasterPlus());
                let parent = this.GetParentPlus();
                this.AddTimer(FrameTime(), () => {
                    if (parent) {
                        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_teleport_flash.vpcf", ParticleAttachment_t.PATTACH_POINT, parent);
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                });
                this.GetParentPlus().Stop();
                ability.teleport_vector = RotatePosition(Vector(0, 0, 0), QAngle(0, 90, 0), ability.teleport_vector);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    }
    return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() && keys.attacker != this.GetParentPlus() && (keys.attacker.IsRealUnit()) && keys.original_damage > 0) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_chen_holy_persuasion_immortalized extends BaseModifier_Plus {
    public distance: number;
    public immortalize_vector: any;
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_medusa_stone_gaze.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.distance = this.GetSpecialValueFor("teleport_distance");
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetAbilityPlus() && this.GetParentPlus().IsAlive() && this.GetCasterPlus().IsAlive()) {
            let ability = this.GetAbilityPlus<imba_chen_holy_persuasion>();

            if (!ability.immortalize_vector) {
                ability.immortalize_vector = RotatePosition(Vector(0, 0, 0), QAngle(0, 45, 0), Vector(this.distance * 2, 0, 0));
            }
            this.immortalize_vector = ability.immortalize_vector;
            this.GetParentPlus().SetAbsOrigin(GetGroundPosition(this.GetCasterPlus().GetAbsOrigin() + this.immortalize_vector, undefined));
            this.GetParentPlus().MoveToNPC(this.GetCasterPlus());
            ability.immortalize_vector = RotatePosition(Vector(0, 0, 0), QAngle(0, -90, 0), ability.immortalize_vector);
            this.StartIntervalThink(0.1);
        } else {
            this.GetParentPlus().ForceKill(false);
        }
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus()) {
            this.GetParentPlus().ForceKill(false);
        }
        this.GetParentPlus().MoveToPosition(GetGroundPosition(this.GetCasterPlus().GetAbsOrigin() + this.immortalize_vector, undefined));
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_DOMINATED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true
        }
        if (this.GetCasterPlus().IsInvisible()) {
            state[modifierstate.MODIFIER_STATE_INVISIBLE] = true;
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
        4: Enum_MODIFIER_EVENT.ON_DEATH,
        5: Enum_MODIFIER_EVENT.ON_ORDER
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return -100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        return 10000;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return -20;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            this.AddTimer(FrameTime(), () => {
                this.GetParentPlus().Interrupt();
                this.GetParentPlus().MoveToPosition(GetGroundPosition(this.GetCasterPlus().GetAbsOrigin() + this.immortalize_vector, undefined));
            });
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() || keys.unit == this.GetCasterPlus()) {
            let immortalized_creeps_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_immortalized_tracker") as modifier_imba_chen_holy_persuasion_immortalized_tracker[];
            for (const [_, modifier] of GameFunc.iPair(immortalized_creeps_modifiers)) {
                if (modifier.creep == this.GetParentPlus()) {
                    modifier.Destroy();
                    this.Destroy();
                    this.GetParentPlus().Kill(this.GetAbilityPlus(), keys.attacker);
                    return;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_chen_holy_persuasion_immortalized_tracker extends BaseModifier_Plus {
    creep: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_chen_holy_persuasion_immortalized_counter")) {
            this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_chen_holy_persuasion_immortalized_counter", this.GetCasterPlus()).SetStackCount(GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName(this.GetName())));
        }
    }
}
@registerModifier()
export class modifier_imba_chen_holy_persuasion_immortalized_counter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    OnStackCountChanged(p_0: number,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() == 0) {
            this.Destroy();
        }
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_chen_holy_persuasion_immortalized_tracker")));
    }

}
@registerAbility()
export class imba_chen_test_of_faith extends BaseAbility_Plus {
    GetCooldown(iLevel: number): number {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_chen_test_of_faith_cd_reduction");
    }
    OnHeroLevelUp(): void {
        this.SetLevel(math.min(math.floor(this.GetCasterPlus().GetLevel() / 3), 4));
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && target.TriggerSpellAbsorb(this)) {
            return;
        }
        target.EmitSound("Hero_Chen.Test_of_Faith");
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_test_of_faith.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(particle);
        if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            let heal_value = this.GetSpecialValueFor("heal_max");
            if (target != this.GetCasterPlus()) {
                heal_value = RandomInt(this.GetSpecialValueFor("heal_min"), this.GetSpecialValueFor("heal_max"));
            }
            heal_value = heal_value + (PlayerResource.GetAssists(target.GetPlayerID()) * this.GetSpecialValueFor("faithful_assist_mult"));
            target.ApplyHeal(heal_value, this);
        } else {
            let damage_min = this.GetSpecialValueFor("damage_min");
            let damage_max = this.GetSpecialValueFor("damage_max");
            if (this.GetCasterPlus().GetPlayerID() && target.GetPlayerID()) {
                let caster_assists = PlayerResource.GetAssists(this.GetCasterPlus().GetPlayerID());
                let target_assists = PlayerResource.GetAssists(target.GetPlayerID());
                damage_max = damage_max + math.max((caster_assists - target_assists) * this.GetSpecialValueFor("unfaithful_assist_mult"), 0);
            }
            let damage_value = RandomInt(damage_min, damage_max);
            let damageTable = {
                victim: target,
                damage: damage_value,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, damage_value, undefined);
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_chen_test_of_faith_cd_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_chen_test_of_faith_cd_reduction")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_chen_test_of_faith_cd_reduction"), "modifier_special_bonus_imba_chen_test_of_faith_cd_reduction", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        if (RollPercentage(50)) {
            return AI_ability.TARGET_if_enemy(this);
        }
        return AI_ability.TARGET_if_friend(this);
    }
}
@registerAbility()
export class imba_chen_hand_of_god extends BaseAbility_Plus {
    GetCooldown(iLevel: number): number {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_chen_hand_of_god_cooldown");
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let allies = this.GetCasterPlus().GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(this.GetCasterPlus().GetTeam())
        let voiceline = undefined;
        if (this.GetCasterPlus().GetUnitName().includes("chen")) {
            voiceline = "chen_chen_ability_handgod_0" + RandomInt(1, 3);
        }
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.IsRealUnit() || ally.IsClone() || ally.GetOwnerEntity() == this.GetCasterPlus() || (ally.GetPlayerID() == this.GetCasterPlus().GetPlayerID())) {
                if (voiceline && ally.IsRealUnit()) {
                    ally.EmitSound(voiceline);
                }
                if (ally.IsRealUnit()) {
                    ally.EmitSound("Hero_Chen.HandOfGodHealHero");
                } else if (ally.IsCreep()) {
                    ally.EmitSound("Hero_Chen.HandOfGodHealCreep");
                }
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_hand_of_god.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally);
                ParticleManager.ReleaseParticleIndex(particle);
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_chen_divine_favor_hand_of_god") && this.GetCasterPlus().HasAbility("imba_chen_divine_favor") && this.GetCasterPlus().findAbliityPlus<imba_chen_divine_favor>("imba_chen_divine_favor").IsTrained()) {
                    ally.AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_chen_divine_favor>("imba_chen_divine_favor"), "modifier_imba_chen_divine_favor", {
                        duration: this.GetCasterPlus().findAbliityPlus<imba_chen_divine_favor>("imba_chen_divine_favor").GetSpecialValueFor("duration")
                    });
                }
                let overheal_amount = this.GetTalentSpecialValueFor("heal_amount") - (ally.GetMaxHealth() - ally.GetHealth());
                if (overheal_amount > 0) {
                    ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chen_hand_of_god_overheal", {
                        overheal_amount: overheal_amount
                    });
                }
                ally.ApplyHeal(this.GetTalentSpecialValueFor("heal_amount"), this);
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_chen_hand_of_god_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_chen_hand_of_god_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_chen_hand_of_god_cooldown"), "modifier_special_bonus_imba_chen_hand_of_god_cooldown", {});
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
export class modifier_imba_chen_hand_of_god_overheal extends BaseModifier_Plus {
    public overheal_loss_per_tick: any;
    public overheal_tick_rate: any;
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        this.overheal_loss_per_tick = this.GetSpecialValueFor("overheal_loss_per_tick");
        this.overheal_tick_rate = this.GetSpecialValueFor("overheal_tick_rate");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(params.overheal_amount);
        this.StartIntervalThink(this.overheal_tick_rate);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetStackCount() - this.overheal_loss_per_tick);
        // if (this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
        if (this.GetStackCount() <= 0) {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS
    }
    return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_chen_divine_favor_cd_reduction extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_chen_test_of_faith_cd_reduction extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_chen_hand_of_god_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_chen_remnants_of_penitence extends BaseModifier_Plus {
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
