
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_terrorblade_reflection extends BaseAbility_Plus {
    public responses: any;
    public responses_morph: any;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("range");
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + (this.GetSpecialValueFor("infinity_radius_per_stack") * this.GetCasterPlus().findBuffStack("modifier_imba_terrorblade_reflection_infinity_mirror_stacks", this.GetCasterPlus())) - this.GetCasterPlus().GetCastRangeBonus();
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_terrorblade_reflection_cooldown");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_terrorblade_reflection_infinity_mirror_stacks";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let spawn_range = 108;
        let slow_modifier = undefined;
        if (this.GetCasterPlus().GetName() == "npc_dota_hero_terrorblade") {
            if (RollPercentage(1)) {
                if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                    EmitSoundOnClient("terrorblade_terr_morph_reflection_01", this.GetCasterPlus().GetPlayerOwner());
                } else {
                    EmitSoundOnClient("terrorblade_terr_reflection_01", this.GetCasterPlus().GetPlayerOwner());
                }
            } else if (RollPercentage(3)) {
                if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                    EmitSoundOnClient("terrorblade_terr_morph_reflection_06", this.GetCasterPlus().GetPlayerOwner());
                } else {
                    EmitSoundOnClient("terrorblade_terr_reflection_06", this.GetCasterPlus().GetPlayerOwner());
                }
            } else if (RollPercentage(20)) {
                if (!this.responses) {
                    this.responses = {
                        1: "terrorblade_terr_reflection_02",
                        2: "terrorblade_terr_reflection_03",
                        3: "terrorblade_terr_reflection_04",
                        4: "terrorblade_terr_reflection_05",
                        5: "terrorblade_terr_reflection_07"
                    }
                }
                if (!this.responses_morph) {
                    this.responses_morph = {
                        1: "terrorblade_terr_morph_reflection_02",
                        2: "terrorblade_terr_morph_reflection_03",
                        3: "terrorblade_terr_morph_reflection_04",
                        4: "terrorblade_terr_morph_reflection_05",
                        5: "terrorblade_terr_morph_reflection_07"
                    }
                }
                if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                    EmitSoundOnClient(this.responses_morph[RandomInt(1, GameFunc.GetCount(this.responses_morph))], this.GetCasterPlus().GetPlayerOwner());
                } else {
                    EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
                }
            }
        }
        for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("range") + (this.GetSpecialValueFor("infinity_radius_per_stack") * this.GetCasterPlus().findBuffStack("modifier_imba_terrorblade_reflection_infinity_mirror_stacks", this.GetCasterPlus())), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false))) {
            if (enemy.GetHullRadius() > 8) {
                spawn_range = 108;
            } else {
                spawn_range = 72;
            }
            enemy.EmitSound("Hero_Terrorblade.Reflection");
            let illusions = this.GetCasterPlus().CreateIllusion(enemy, {
                outgoing_damage: this.GetTalentSpecialValueFor("illusion_outgoing_damage"),
                incoming_damage: -100,
                bounty_base: 0,
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: this.GetSpecialValueFor("illusion_duration") + (this.GetSpecialValueFor("infinity_duration_per_stack") * this.GetCasterPlus().findBuffStack("modifier_imba_terrorblade_reflection_infinity_mirror_stacks", this.GetCasterPlus()))
            });
            for (const [_, illusion] of ipairs(illusions)) {
                illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_terrorblade_reflection_unit", {
                    enemy_entindex: enemy.entindex()
                });
                illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_terrorblade_reflection_invulnerability", {});
            }
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_terrorblade_reflection_slow", {
                duration: this.GetSpecialValueFor("illusion_duration") * (1 - enemy.GetStatusResistance())
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_terrorblade_reflection_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_terrorblade_reflection_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_terrorblade_reflection_cooldown"), "modifier_special_bonus_imba_terrorblade_reflection_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_terrorblade_reflection_slow extends BaseModifier_Plus {
    public move_slow: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_terrorblade/terrorblade_reflection_slow.vpcf";
    }
    BeCreated(keys: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.move_slow = this.GetSpecialValueFor("move_slow") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow;
    }
}
@registerModifier()
export class modifier_imba_terrorblade_reflection_unit extends BaseModifier_Plus {
    public enemy_entindex: any;
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_terrorblade_reflection.vpcf";
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.enemy_entindex = keys.enemy_entindex;
    }
    /**  CheckState(): Partial<Record<modifierstate, boolean>> {
         if (EntIndexToHScript(this.enemy_entindex) && !EntIndexToHScript(this.enemy_entindex).IsNull() && this.GetParentPlus().IsAlive() && EntIndexToHScript(this.enemy_entindex).IsAlive()) {
             if (!EntIndexToHScript(this.enemy_entindex).IsInvisible() || this.GetParentPlus().CanEntityBeSeenByMyTeam(EntIndexToHScript(this.enemy_entindex))) {
                 ExecuteOrderFromTable({
                     UnitIndex: this.GetParentPlus().entindex(),
                     OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                     TargetIndex: this.enemy_entindex
                 });
             } else {
                 ExecuteOrderFromTable({
                     UnitIndex: this.GetParentPlus().entindex(),
                     OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                     Position: EntIndexToHScript(this.enemy_entindex).GetAbsOrigin()
                 });
             }
         } else {
             this.GetParentPlus().ForceKill(false);
         }
     }*/

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (EntIndexToHScript(this.enemy_entindex) && !EntIndexToHScript(this.enemy_entindex).IsNull() && keys.unit == EntIndexToHScript(this.enemy_entindex) && keys.unit.IsRealHero() && this.GetParentPlus().GetOwnerPlus() /**&& this.GetParentPlus().GetOwnerPlus().GetAssignedHero()*/ && this.GetParentPlus().GetOwnerPlus()/**.GetAssignedHero() */.HasModifier("modifier_imba_terrorblade_reflection_infinity_mirror_stacks")) {
            this.GetParentPlus().GetOwnerPlus()/**.GetAssignedHero() */.findBuff<modifier_imba_terrorblade_reflection_infinity_mirror_stacks>("modifier_imba_terrorblade_reflection_infinity_mirror_stacks").IncrementStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_terrorblade_reflection_infinity_mirror_stacks extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(keys?: any/** keys */): number {
        if (this.GetAbilityPlus()) {
            if (keys.fail_type == 0) {
                return this.GetSpecialValueFor("range") + (this.GetSpecialValueFor("infinity_radius_per_stack") * this.GetStackCount());
            } else if (keys.fail_type == 1) {
                return this.GetSpecialValueFor("illusion_duration") + (this.GetSpecialValueFor("infinity_duration_per_stack") * this.GetStackCount());
            }
        }
    }
}
@registerAbility()
export class imba_terrorblade_conjure_image extends BaseAbility_Plus {
    public responses: any;
    public responses_morph: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_terrorblade_conjure_image_autocast";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Terrorblade.ConjureImage");
        if (this.GetCasterPlus().GetName() == "npc_dota_hero_terrorblade") {
            if (RollPercentage(2)) {
                if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                    EmitSoundOnClient("terrorblade_terr_morph_conjureimage_03", this.GetCasterPlus().GetPlayerOwner());
                } else {
                    EmitSoundOnClient("terrorblade_terr_conjureimage_03", this.GetCasterPlus().GetPlayerOwner());
                }
            } else if (RollPercentage(3)) {
                if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                    EmitSoundOnClient("terrorblade_terr_morph_conjureimage_01", this.GetCasterPlus().GetPlayerOwner());
                } else {
                    EmitSoundOnClient("terrorblade_terr_conjureimage_01", this.GetCasterPlus().GetPlayerOwner());
                }
            } else if (RollPercentage(20)) {
                if (!this.responses) {
                    this.responses = {
                        1: "terrorblade_terr_conjureimage_02",
                        2: "terrorblade_terr_demon_09",
                        3: "terrorblade_terr_demon_10",
                        4: "terrorblade_terr_demon_11"
                    }
                }
                if (!this.responses_morph) {
                    this.responses_morph = {
                        1: "terrorblade_terr_morph_conjureimage_02",
                        2: "terrorblade_terr_morph_demon_09",
                        3: "terrorblade_terr_morph_demon_10",
                        4: "terrorblade_terr_morph_demon_11"
                    }
                }
                if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                    EmitSoundOnClient(this.responses_morph[RandomInt(1, GameFunc.GetCount(this.responses_morph))], this.GetCasterPlus().GetPlayerOwner());
                } else {
                    EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
                }
            }
        }
        let illusions = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(), {
            outgoing_damage: this.GetSpecialValueFor("illusion_outgoing_damage"),
            incoming_damage: this.GetSpecialValueFor("illusion_incoming_damage"),
            bounty_base: this.GetCasterPlus().GetIllusionBounty(),
            bounty_growth: undefined,
            outgoing_damage_structure: undefined,
            outgoing_damage_roshan: undefined,
            duration: this.GetSpecialValueFor("illusion_duration")
        });
        if (illusions) {
            for (const [_, illusion] of ipairs(illusions)) {
                illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_terrorblade_conjureimage", {});
                illusion.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3_END);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_terrorblade_conjure_image_autocast extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().GetAutoCastState() && this.GetAbilityPlus().IsFullyCastable() && !this.GetAbilityPlus().IsInAbilityPhase() && !this.GetCasterPlus().IsHexed() && !this.GetCasterPlus().IsNightmared() && !this.GetCasterPlus().IsOutOfGame() && !this.GetCasterPlus().IsSilenced() && !this.GetCasterPlus().IsStunned() && !this.GetCasterPlus().IsChanneling() && !this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_conjure_image_autocast_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_terrorblade_conjure_image_autocast_cooldown", {
                duration: 1
            });
            if (this.GetCasterPlus().GetPlayerID) {
                if (this.GetCasterPlus().GetAggroTarget()) {
                    this.GetCasterPlus().CastAbilityImmediately(this.GetAbilityPlus(), this.GetCasterPlus().GetPlayerID());
                } else {
                    this.GetCasterPlus().CastAbilityNoTarget(this.GetAbilityPlus(), this.GetCasterPlus().GetPlayerID());
                }
            } else if (this.GetCasterPlus().GetPlayerOwner && this.GetCasterPlus().GetPlayerOwner().GetPlayerID) {
                if (this.GetCasterPlus().GetAggroTarget()) {
                    this.GetCasterPlus().CastAbilityImmediately(this.GetAbilityPlus(), this.GetCasterPlus().GetPlayerOwner().GetPlayerID());
                } else {
                    this.GetCasterPlus().CastAbilityNoTarget(this.GetAbilityPlus(), this.GetCasterPlus().GetPlayerOwner().GetPlayerID());
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_terrorblade_conjure_image_autocast_cooldown extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
}
@registerAbility()
export class imba_terrorblade_metamorphosis extends BaseAbility_Plus {
    public responses: any;
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Terrorblade.Metamorphosis");
        if (this.GetCasterPlus().GetName() == "npc_dota_hero_terrorblade") {
            if (!this.responses) {
                this.responses = {
                    1: "terrorblade_terr_morph_metamorphosis_01",
                    2: "terrorblade_terr_morph_metamorphosis_02",
                    3: "terrorblade_terr_morph_metamorphosis_03",
                    4: "terrorblade_terr_morph_metamorphosis_04",
                    5: "terrorblade_terr_morph_metamorphosis_05",
                    6: "terrorblade_terr_morph_metamorphosis_06",
                    7: "terrorblade_terr_morph_metamorphosis_07",
                    8: "terrorblade_terr_morph_metamorphosis_08",
                    9: "terrorblade_terr_morph_metamorphosis_09",
                    10: "terrorblade_terr_morph_demon_12",
                    11: "terrorblade_terr_morph_demon_13",
                    12: "terrorblade_terr_morph_demon_14"
                }
            }
            EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_terrorblade_metamorphosis");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_terrorblade_metamorphosis_transform", {
            duration: this.GetSpecialValueFor("transformation_time")
        });
        for (const [_, unit] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("metamorph_aura_tooltip"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false))) {
            if (unit != this.GetCasterPlus() && unit.IsIllusion() && unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID() && unit.GetName() == this.GetCasterPlus().GetName()) {
                unit.RemoveModifierByName("modifier_imba_terrorblade_metamorphosis");
                unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_terrorblade_metamorphosis_transform", {
                    duration: this.GetSpecialValueFor("transformation_time")
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_terrorblade_metamorphosis_attack_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_terrorblade_metamorphosis_attack_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_terrorblade_metamorphosis_attack_range"), "modifier_special_bonus_imba_terrorblade_metamorphosis_attack_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_terrorblade_metamorphosis_transform extends BaseModifier_Plus {
    public duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.duration = this.GetSpecialValueFor("duration");
        if (!IsServer()) {
            return;
        }
        let transform_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_terrorblade/terrorblade_metamorphosis_transform.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(transform_particle);
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_terrorblade_metamorphosis_transform_aura_applier", {});
        if (this.GetParentPlus().HasAbility("imba_terrorblade_terror_wave")) {
            this.GetParentPlus().findAbliityPlus<imba_terrorblade_terror_wave>("imba_terrorblade_terror_wave").SetActivated(false);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_terrorblade_metamorphosis", {
            duration: this.duration
        });
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_terrorblade_metamorphosis extends BaseModifier_Plus {
    public bonus_range: number;
    public bonus_damage: number;
    public speed_loss: number;
    public previous_attack_cability: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_range = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_range");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.speed_loss = this.GetSpecialValueFor("speed_loss") * (-1);
        if (!IsServer()) {
            return;
        }
        this.previous_attack_cability = this.GetParentPlus().GetAttackCapability();
        this.GetParentPlus().SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK);
        if (this.GetParentPlus().HasAbility("imba_terrorblade_terror_wave")) {
            if (!this.GetParentPlus().findAbliityPlus<imba_terrorblade_terror_wave>("imba_terrorblade_terror_wave").IsTrained()) {
                this.GetParentPlus().findAbliityPlus<imba_terrorblade_terror_wave>("imba_terrorblade_terror_wave").SetLevel(1);
            }
            this.GetParentPlus().findAbliityPlus<imba_terrorblade_terror_wave>("imba_terrorblade_terror_wave").SetActivated(true);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3_END);
        this.GetParentPlus().SetAttackCapability(this.previous_attack_cability);
        this.GetParentPlus().RemoveModifierByName("modifier_imba_terrorblade_metamorphosis_transform_aura_applier");
        if (this.GetParentPlus().HasAbility("imba_terrorblade_terror_wave")) {
            this.GetParentPlus().findAbliityPlus<imba_terrorblade_terror_wave>("imba_terrorblade_terror_wave").SetActivated(false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            5: Enum_MODIFIER_EVENT.ON_ATTACK,
            6: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            7: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            8: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            9: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/heroes/terrorblade/demon.vmdl";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        return "Hero_Terrorblade_Morphed.Attack";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName(): string {
        return "particles/units/heroes/hero_terrorblade/terrorblade_metamorphosis_base_attack.vpcf";
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.GetParentPlus().EmitSound("Hero_Terrorblade_Morphed.preAttack");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.GetParentPlus().EmitSound("Hero_Terrorblade_Morphed.Attack");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.GetParentPlus().EmitSound("Hero_Terrorblade_Morphed.projectileImpact");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetParentPlus().GetName() != "npc_dota_hero_rubick") {
            return this.bonus_range;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.speed_loss;
    }
}
@registerModifier()
export class modifier_imba_terrorblade_metamorphosis_transform_aura extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_terrorblade_metamorphosis_transform", {
            duration: this.GetSpecialValueFor("transformation_time")
        });
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveModifierByName("modifier_imba_terrorblade_metamorphosis_transform");
        this.GetParentPlus().RemoveModifierByName("modifier_imba_terrorblade_metamorphosis");
    }
}
@registerModifier()
export class modifier_imba_terrorblade_metamorphosis_transform_aura_applier extends BaseModifier_Plus {
    public metamorph_aura_tooltip: any;
    BeCreated(p_0: any,): void {
        this.metamorph_aura_tooltip = this.GetSpecialValueFor("metamorph_aura_tooltip");
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
    GetAuraDuration(): number {
        return 1;
    }
    GetAuraRadius(): number {
        return this.metamorph_aura_tooltip;
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
        return "modifier_imba_terrorblade_metamorphosis_transform_aura";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return hTarget == this.GetParentPlus() || this.GetParentPlus().IsIllusion() || !hTarget.IsIllusion() || hTarget.GetPlayerOwnerID() != this.GetCasterPlus().GetPlayerOwnerID() || hTarget.HasModifier("modifier_terrorblade_reflection_invulnerability");
    }
}
@registerAbility()
export class imba_terrorblade_terror_wave extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    IsDisabledByDefault() {
        return true;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        EmitGlobalSound("Hero_Terrorblade.Metamorphosis.Scepter");
        CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_terrorblade_metamorphosis_fear_thinker", {
            duration: this.GetSpecialValueFor("spawn_delay") + (this.GetSpecialValueFor("radius") / this.GetSpecialValueFor("speed"))
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_terrorblade_metamorphosis_fear_thinker extends BaseModifier_Plus {
    public fear_duration: number;
    public radius: number;
    public speed: number;
    public spawn_delay: number;
    public bLaunched: any;
    public feared_units: any;
    public fear_modifier: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.fear_duration = this.GetSpecialValueFor("fear_duration");
        this.radius = this.GetSpecialValueFor("radius");
        this.speed = this.GetSpecialValueFor("speed");
        this.spawn_delay = this.GetSpecialValueFor("spawn_delay");
        if (!IsServer()) {
            return;
        }
        this.bLaunched = false;
        this.feared_units = {}
        this.fear_modifier = undefined;
        this.StartIntervalThink(this.spawn_delay);
    }
    OnIntervalThink(): void {
        if (!this.bLaunched) {
            this.bLaunched = true;
            let wave_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_terrorblade/terrorblade_scepter.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(wave_particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(wave_particle, 1, Vector(this.speed, this.speed, this.speed));
            ParticleManager.SetParticleControl(wave_particle, 2, Vector(this.speed, this.speed, this.speed));
            ParticleManager.ReleaseParticleIndex(wave_particle);
            this.StartIntervalThink(-1);
            this.StartIntervalThink(FrameTime());
        } else {
            for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, math.min(this.speed * (this.GetElapsedTime() - this.spawn_delay), this.radius), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                if (!this.feared_units[enemy.entindex()] && (enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() >= math.min(this.speed * (this.GetElapsedTime() - this.spawn_delay), this.radius) - 50) {
                    enemy.EmitSound("Hero_Terrorblade.Metamorphosis.Fear");
                    this.fear_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_terrorblade_fear", {
                        duration: this.fear_duration
                    });
                    if (this.fear_modifier) {
                        this.fear_modifier.SetDuration(this.fear_duration * (1 - enemy.GetStatusResistance()), true);
                    }
                    this.feared_units[enemy.entindex()] = true;
                }
            }
        }
    }
}
@registerAbility()
export class imba_terrorblade_power_rend extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (!target.GetStrength) {
            return UnitFilterResult.UF_FAIL_OTHER;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (target == this.GetCasterPlus()) {
            return "#dota_hud_error_cant_cast_on_self";
        }
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter()) {
            this.SetHidden(false);
            if (!this.IsTrained()) {
                this.SetLevel(1);
            }
        } else {
            this.SetHidden(true);
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let caster_strength = this.GetCasterPlus().GetStrength();
        let caster_agility = this.GetCasterPlus().GetAgility();
        let caster_intellect = this.GetCasterPlus().GetIntellect();
        let target_strength = target.GetStrength();
        let target_agility = target.GetAgility();
        let target_intellect = target.GetIntellect();
        this.GetCasterPlus().EmitSound("Hero_Terrorblade.Sunder.Cast");
        target.EmitSound("Hero_Terrorblade.Sunder.Target");
        let rend_particle_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_terrorblade/terrorblade_sunder.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControlEnt(rend_particle_1, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(rend_particle_1, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(rend_particle_1, 15, Vector(255, 0, 0));
        ParticleManager.SetParticleControl(rend_particle_1, 16, Vector(1, 0, 0));
        ParticleManager.ReleaseParticleIndex(rend_particle_1);
        let rend_particle_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_terrorblade/terrorblade_sunder.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(rend_particle_2, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(rend_particle_2, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(rend_particle_2, 15, Vector(255, 0, 0));
        ParticleManager.SetParticleControl(rend_particle_2, 16, Vector(1, 0, 0));
        ParticleManager.ReleaseParticleIndex(rend_particle_2);
        let caster_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_terrorblade_power_rend", {
            duration: this.GetSpecialValueFor("duration")
        }) as modifier_imba_terrorblade_power_rend;
        if (caster_modifier) {
            caster_modifier.strength_differential = target_strength - caster_strength;
            caster_modifier.agility_differential = target_agility - caster_agility;
            caster_modifier.intellect_differential = target_intellect - caster_intellect;
        }
        let target_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_terrorblade_power_rend", {
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
        }) as modifier_imba_terrorblade_power_rend;
        if (target_modifier) {
            target_modifier.strength_differential = caster_strength - target_strength;
            target_modifier.agility_differential = caster_agility - target_agility;
            target_modifier.intellect_differential = caster_intellect - target_intellect;
        }
    }
}
@registerModifier()
export class modifier_imba_terrorblade_power_rend extends BaseModifier_Plus {
    strength_differential: number;
    agility_differential: number;
    intellect_differential: number;
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        // if (this.GetParentPlus().CalculateStatBonus) {
        // this.GetParentPlus().CalculateStatBonus(true);
        // }
        this.StartIntervalThink(-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.strength_differential) {
            return this.strength_differential;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.agility_differential) {
            return this.agility_differential;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.intellect_differential) {
            return this.intellect_differential;
        }
    }
}
@registerAbility()
export class imba_terrorblade_sunder extends BaseAbility_Plus {
    public responses: any;
    public responses_morph: any;
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (target == this.GetCasterPlus()) {
            return "#dota_hud_error_cant_cast_on_self";
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCursorTarget && this.GetCursorTarget() && this.GetCursorTarget().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && this.GetCursorTarget().IsMagicImmune()) {
            return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_terrorblade_sunder_cooldown") + this.GetSpecialValueFor("spell_immunity_cooldown_increase");
        } else {
            return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_terrorblade_sunder_cooldown");
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let caster_health_percent = this.GetCasterPlus().GetHealthPercent();
        let target_health_percent = target.GetHealthPercent();
        this.GetCasterPlus().EmitSound("Hero_Terrorblade.Sunder.Cast");
        target.EmitSound("Hero_Terrorblade.Sunder.Target");
        if (this.GetCasterPlus().GetName() == "npc_dota_hero_terrorblade") {
            if (!this.responses) {
                this.responses = {
                    1: "terrorblade_terr_demonattack_08",
                    2: "terrorblade_terr_sunder_01",
                    3: "terrorblade_terr_sunder_02",
                    4: "terrorblade_terr_sunder_04",
                    5: "terrorblade_terr_sunder_05",
                    6: "terrorblade_terr_sunder_07",
                    7: "terrorblade_terr_sunder_08",
                    8: "terrorblade_terr_sunder_09",
                    9: "terrorblade_terr_sunder_10",
                    10: "terrorblade_terr_sunder_11"
                }
            }
            if (!this.responses_morph) {
                this.responses_morph = {
                    1: "terrorblade_terr_morph_demonattack_08",
                    2: "terrorblade_terr_morph_sunder_01",
                    3: "terrorblade_terr_morph_sunder_02",
                    4: "terrorblade_terr_morph_sunder_04",
                    5: "terrorblade_terr_morph_sunder_05",
                    6: "terrorblade_terr_morph_sunder_07",
                    7: "terrorblade_terr_morph_sunder_08",
                    8: "terrorblade_terr_morph_sunder_09",
                    9: "terrorblade_terr_morph_sunder_10",
                    10: "terrorblade_terr_morph_sunder_11"
                }
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_terrorblade_metamorphosis")) {
                EmitSoundOnClient(this.responses_morph[RandomInt(1, GameFunc.GetCount(this.responses_morph))], this.GetCasterPlus().GetPlayerOwner());
            } else {
                EmitSoundOnClient(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))], this.GetCasterPlus().GetPlayerOwner());
            }
        }
        let sunder_particle_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_terrorblade/terrorblade_sunder.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControlEnt(sunder_particle_1, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(sunder_particle_1, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(sunder_particle_1);
        let sunder_particle_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_terrorblade/terrorblade_sunder.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(sunder_particle_2, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(sunder_particle_2, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(sunder_particle_2);
        this.GetCasterPlus().SetHealth(this.GetCasterPlus().GetMaxHealth() * math.max(target_health_percent, this.GetSpecialValueFor("hit_point_minimum_pct")) * 0.01);
        target.SetHealth(target.GetMaxHealth() * math.max(caster_health_percent, this.GetSpecialValueFor("hit_point_minimum_pct")) * 0.01);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_terrorblade_sunder_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_terrorblade_sunder_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_terrorblade_sunder_cooldown"), "modifier_special_bonus_imba_terrorblade_sunder_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_terrorblade_reflection_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_terrorblade_metamorphosis_attack_range extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_terrorblade_sunder_cooldown extends BaseModifier_Plus {
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
