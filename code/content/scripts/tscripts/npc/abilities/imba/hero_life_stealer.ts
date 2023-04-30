
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_life_stealer_rage extends BaseAbility_Plus {
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_LifeStealer.Rage");
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_LIFESTEALER_RAGE);
        this.GetCasterPlus().Purge(false, true, false, false, false);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_rage", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_imba_life_stealer_rage extends BaseModifier_Plus {
    public attack_speed_bonus: number;
    public movement_speed_bonus: number;
    public insanity_attack_stacks: number;
    public insanity_other_stacks: number;
    public insanity_stack_duration: number;
    public insanity_stack_activation: number;
    public insanity_active_range: number;
    public insanity_active_duration: number;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_life_stealer_rage.vpcf";
    }
    Init(p_0: any,): void {
        this.attack_speed_bonus = this.GetSpecialValueFor("attack_speed_bonus");
        this.movement_speed_bonus = this.GetSpecialValueFor("movement_speed_bonus");
        this.insanity_attack_stacks = this.GetSpecialValueFor("insanity_attack_stacks");
        this.insanity_other_stacks = this.GetSpecialValueFor("insanity_other_stacks");
        this.insanity_stack_duration = this.GetSpecialValueFor("insanity_stack_duration");
        this.insanity_stack_activation = this.GetSpecialValueFor("insanity_stack_activation");
        this.insanity_active_range = this.GetSpecialValueFor("insanity_active_range");
        this.insanity_active_duration = this.GetSpecialValueFor("insanity_active_duration");
        if (!IsServer()) {
            return;
        }
        let rage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_rage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(rage_particle, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(rage_particle, false, false, -1, true, false);
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed_bonus;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            if (keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
                keys.unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_life_stealer_rage_insanity", {
                    duration: this.insanity_stack_duration,
                    stacks: this.insanity_attack_stacks,
                    other_stacks: this.insanity_other_stacks,
                    stack_activation: this.insanity_stack_activation,
                    active_range: this.insanity_active_range,
                    active_duration: this.insanity_active_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_rage_insanity extends BaseModifier_Plus {
    public stack_activation: number;
    public other_stacks: number;
    public active_range: number;
    public active_duration: number;
    IsPurgable(): boolean {
        return false;
    }
    Init(params: any): void {
        if (this.GetAbilityPlus()) {
            this.stack_activation = this.GetSpecialValueFor("insanity_stack_activation");
        }
        if (!IsServer()) {
            return;
        }
        this.other_stacks = params.other_stacks;
        this.stack_activation = params.stack_activation;
        this.active_range = params.active_range;
        this.active_duration = params.active_duration;
        if (params.stacks) {
            this.SetStackCount(this.GetStackCount() + params.stacks);
        }
    }

    OnStackCountChanged(stackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() >= this.stack_activation) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.active_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            if (GameFunc.GetCount(enemies) >= 2) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_life_stealer_rage_insanity_active", {
                    duration: this.active_duration * (1 - this.GetParentPlus().GetStatusResistance()),
                    active_range: this.active_range,
                    target_entindex: enemies[1].entindex()
                });
                enemies[1].AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_life_stealer_rage_insanity_target", {
                    duration: this.active_duration * (1 - this.GetParentPlus().GetStatusResistance())
                });
            } else {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_life_stealer_rage_insanity_active", {
                    duration: this.active_duration * (1 - this.GetParentPlus().GetStatusResistance()),
                    active_range: this.active_range
                });
            }
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.attacker.FindModifierByNameAndCaster("modifier_imba_life_stealer_rage", this.GetCasterPlus())) {
            this.SetStackCount(this.GetStackCount() + 1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.stack_activation;
    }
}
@registerModifier()
export class modifier_imba_life_stealer_rage_insanity_active extends BaseModifier_Plus {
    public active_range: number;
    public target: IBaseNpc_Plus;
    IsPurgable(): boolean {
        return false;
    }
    Init(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.active_range = params.active_range;
        if (params.target_entindex) {
            this.target = EntIndexToHScript(params.target_entindex) as IBaseNpc_Plus;
            this.GetParentPlus().MoveToTargetToAttack(this.target);
            this.GetParentPlus().SetForceAttackTargetAlly(this.target);
        }
        this.StartIntervalThink(0.5);
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.target || !this.target.IsAlive()) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.active_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            if (GameFunc.GetCount(enemies) >= 2) {
                let insanity_target_modifier = enemies[1].AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_life_stealer_rage_insanity_target", {
                    duration: this.GetRemainingTime()
                });
                this.target = enemies[1];
                this.GetParentPlus().MoveToTargetToAttack(this.target);
                this.GetParentPlus().SetForceAttackTargetAlly(this.target);
            } else {
                this.GetParentPlus().SetForceAttackTargetAlly(undefined);
                this.target = undefined;
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetForceAttackTargetAlly(undefined);
    }
}
@registerModifier()
export class modifier_imba_life_stealer_rage_insanity_target extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT)
    CC_OnTakeDamageKillCredit(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && this.GetParentPlus().GetHealth() <= keys.damage) {
            if (keys.attacker.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), this.GetCasterPlus());
            } else {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), keys.attacker);
            }
        }
    }
}
@registerAbility()
export class imba_life_stealer_feast extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_life_stealer_feast";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("banquet_cast_range");
    }
    GetCooldown(level: number): number {
        return this.GetSpecialValueFor("banquet_cooldown");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_LIFESTEALER_RAGE);
        let banquet = this.GetCasterPlus().CreateSummon("npc_dota_life_stealer_banquet", this.GetCursorPosition(), this.GetSpecialValueFor("engorge_duration"), true);
        if (banquet) {
            banquet.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_feast_banquet", {});
            FindClearSpaceForUnit(banquet, banquet.GetAbsOrigin(), false);
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_feast extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (keys.target && !keys.target.IsOther() && !keys.target.IsBuilding() && !(keys.target as IBaseNpc_Plus).IsRoshan() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            let heal_amount = keys.target.GetMaxHealth() * this.GetAbilityPlus().GetSpecialValueFor("hp_leech_percent") * 0.01;
            let lifesteal_particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(lifesteal_particle);
            if (heal_amount > this.GetParentPlus().GetMaxHealth() - this.GetParentPlus().GetHealth()) {
                let health_differential = heal_amount - (this.GetParentPlus().GetMaxHealth() - this.GetParentPlus().GetHealth());
                let engorge_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_feast_engorge", keys.target);
                if (!engorge_modifier) {
                    this.GetParentPlus().AddNewModifier(keys.target, this.GetAbilityPlus(), "modifier_imba_life_stealer_feast_engorge", {
                        duration: this.GetSpecialValueFor("engorge_duration"),
                        stacks: health_differential * this.GetSpecialValueFor("engorge_pct") * 0.01
                    });
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_life_stealer_feast_engorge_counter", {
                        duration: this.GetSpecialValueFor("engorge_duration"),
                        stacks: health_differential * this.GetSpecialValueFor("engorge_pct") * 0.01
                    });
                    // this.GetParentPlus().CalculateStatBonus(true);
                }
            }
            this.GetParentPlus().ApplyHeal(heal_amount, this.GetAbilityPlus());
            if (this.GetAbilityPlus() && this.GetAbilityPlus().GetAbilityName() == "imba_life_stealer_feast") {
                return heal_amount;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("attack_speed_bonus");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.GetParentPlus().findBuffStack("modifier_imba_life_stealer_feast_engorge_counter", this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_imba_life_stealer_feast_engorge extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(params.stacks);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let engorge_counter_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_feast_engorge_counter", this.GetCasterPlus());
        if (engorge_counter_modifier) {
            engorge_counter_modifier.SetStackCount(engorge_counter_modifier.GetStackCount() - this.GetStackCount());
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_feast_engorge_counter extends BaseModifier_Plus {
    Init(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetStackCount() + params.stacks);
    }

}
@registerModifier()
export class modifier_imba_life_stealer_feast_banquet extends BaseModifier_Plus {
    public destroy_attacks: any;
    public hero_attack_multiplier: any;
    public health_increments: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.destroy_attacks = this.GetSpecialValueFor("destroy_attacks");
        this.hero_attack_multiplier = this.GetSpecialValueFor("hero_attack_multiplier");
        if (!IsServer()) {
            return;
        }
        let engorge_counter_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_feast_engorge_counter", this.GetCasterPlus());
        if (engorge_counter_modifier) {
            this.SetStackCount(engorge_counter_modifier.GetStackCount());
            for (const [_, engorge_modifier] of GameFunc.iPair(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_life_stealer_feast_engorge"))) {
                engorge_modifier.Destroy();
            }
            engorge_counter_modifier.Destroy();
        }
        this.GetParentPlus().SetBaseMaxHealth(this.GetParentPlus().GetMaxHealth() + this.GetStackCount());
        this.GetParentPlus().SetMaxHealth(this.GetParentPlus().GetMaxHealth() + this.GetStackCount());
        this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() + this.GetStackCount());
        this.health_increments = this.GetParentPlus().GetMaxHealth() / this.destroy_attacks;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: Enum_MODIFIER_EVENT.ON_ATTACKED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus()) {
            let damage_amount = math.min(this.health_increments, this.GetParentPlus().GetHealth());
            if (keys.attacker.IsRealUnit()) {
                damage_amount = math.min(this.health_increments * this.hero_attack_multiplier, this.GetParentPlus().GetHealth());
            }
            this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - damage_amount);
            if (keys.attacker.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                keys.attacker.ApplyHeal(damage_amount, this.GetAbilityPlus());
                let lifesteal_particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
                ParticleManager.ReleaseParticleIndex(lifesteal_particle);
            }
            if (this.GetParentPlus().GetHealthPercent() > 75) {
                this.GetParentPlus().SetModel("models/props_gameplay/cheese_04.vmdl");
            } else if (this.GetParentPlus().GetHealthPercent() > 50) {
                this.GetParentPlus().SetModel("models/props_gameplay/cheese_03.vmdl");
            } else if (this.GetParentPlus().GetHealthPercent() > 25) {
                this.GetParentPlus().SetModel("models/props_gameplay/cheese_02.vmdl");
            } else {
                this.GetParentPlus().SetModel("models/props_gameplay/cheese_01.vmdl");
            }
            if (this.GetParentPlus().GetHealth() <= 0) {
                let infest_effect_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest_effect", this.GetCasterPlus());
                if (infest_effect_modifier) {
                    infest_effect_modifier.Destroy();
                }
                this.GetParentPlus().Kill(undefined, keys.attacker);
                this.GetParentPlus().RemoveSelf();
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_life_stealer_open_wounds extends BaseAbility_Plus {
    public responses: { [k: string]: number };
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return undefined;
        }
        this.GetCasterPlus().EmitSound("Hero_LifeStealer.OpenWounds.Cast");
        target.EmitSound("Hero_LifeStealer.OpenWounds");
        if (this.GetCasterPlus().GetUnitName().includes("life_stealer") && RollPercentage(75)) {
            if (!this.responses) {
                this.responses = {
                    ["life_stealer_lifest_ability_openwound_01"]: 0,
                    ["life_stealer_lifest_ability_openwound_02"]: 0,
                    ["life_stealer_lifest_ability_openwound_03"]: 0,
                    ["life_stealer_lifest_ability_openwound_04"]: 0,
                    ["life_stealer_lifest_ability_openwound_05"]: 0,
                    ["life_stealer_lifest_ability_openwound_06"]: 0
                }
            }
            for (const [response, timer] of GameFunc.Pair(this.responses)) {
                if (GameRules.GetDOTATime(true, true) - timer >= 60) {
                    this.GetCasterPlus().EmitSound(response);
                    this.responses[response] = GameRules.GetDOTATime(true, true);
                    return;
                }
            }
        }
        let impact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_open_wounds_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(impact_particle);
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_open_wounds", {
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
        });
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_open_wounds_cross_contamination", {
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
        });
    }
}
@registerModifier()
export class modifier_imba_life_stealer_open_wounds extends BaseModifier_Plus {
    public heal_percent: any;
    public slow_steps: number[];
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_life_stealer_open_wounds.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.heal_percent = this.GetAbilityPlus().GetSpecialValueFor("heal_percent");
        if (!IsServer()) {
            return;
        }
        let target = this.GetParentPlus();
        let impact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_open_wounds.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(impact_particle);
        this.slow_steps = []
        for (let step = 0; step <= this.GetSpecialValueFor("duration") - 1; step++) {
            this.slow_steps.push(this.GetAbilityPlus().GetLevelSpecialValueFor("slow_steps", step));
        }
        this.SetStackCount(this.slow_steps[math.floor(this.GetElapsedTime()) + 1]);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.slow_steps[math.floor(this.GetElapsedTime()) + 1] || 0);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_LifeStealer.OpenWounds");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus() == keys.unit && keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.attacker.IsBuilding() && !keys.attacker.IsOther()) {
            let heal_amount = keys.damage * this.heal_percent * 0.01;
            keys.attacker.ApplyHeal(heal_amount, this.GetAbilityPlus());
            let lifesteal_particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
            ParticleManager.ReleaseParticleIndex(lifesteal_particle);
            let cross_contamination_modifier = keys.unit.FindModifierByNameAndCaster("modifier_imba_life_stealer_open_wounds_cross_contamination", this.GetCasterPlus()) as modifier_imba_life_stealer_open_wounds_cross_contamination;
            if (cross_contamination_modifier && cross_contamination_modifier.attacking_units && !cross_contamination_modifier.attacking_units.includes(keys.attacker)) {
                cross_contamination_modifier.attacking_units.push(keys.attacker);
                cross_contamination_modifier.IncrementStackCount();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_open_wounds_cross_contamination extends BaseModifier_Plus {
    public cross_contamination_pct: number;
    public attacking_units: IBaseNpc_Plus[];
    BeCreated(p_0: any,): void {
        this.cross_contamination_pct = this.GetSpecialValueFor("cross_contamination_pct");
        this.attacking_units = []
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.cross_contamination_pct;
    }
}
@registerAbility()
export class imba_life_stealer_infest extends BaseAbility_Plus {
    public responses: { [k: string]: number };
    GetAssociatedSecondaryAbilities(): string {
        return "imba_life_stealer_consume";
    }
    GetAbilityTargetTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (target == this.GetCasterPlus() || target.GetClassname() == "npc_imba_rattletrap_cog") {
            return UnitFilterResult.UF_FAIL_OTHER;
        } else {
            return UnitFilterResult.UF_SUCCESS;
        }
        return UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
    }
    OnUpgrade(): void {
        let consume_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_consume>("imba_life_stealer_consume");
        if (consume_ability && consume_ability.GetLevel() != this.GetLevel()) {
            consume_ability.SetLevel(this.GetLevel());
        }
    }
    OnAbilityPhaseStart(): boolean {
        let target = this.GetCursorTarget();
        if (!target.IsAlive() || target.IsInvulnerable() || target.IsOutOfGame()) {
            return false;
        } else {
            return true;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter() || this.GetAbilityName() != "imba_life_stealer_infest_723") {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("cast_range_scepter");
        }
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter() || this.GetAbilityName() != "imba_life_stealer_infest_723") {
            return super.GetCooldown(level);
        } else {
            return this.GetSpecialValueFor("cooldown_scepter");
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        if (!target.IsAlive() || target.IsInvulnerable() || target.IsOutOfGame()) {
            this.RefundManaCost();
            this.EndCooldown();
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_LifeStealer.Infest");
        if (this.GetCasterPlus().GetUnitName().includes("life_stealer") && RollPercentage(75)) {
            if (!this.responses) {
                this.responses = {
                    ["life_stealer_lifest_ability_infest_cast_01"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_02"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_03"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_04"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_05"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_06"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_07"]: 0,
                    ["life_stealer_lifest_ability_infest_cast_08"]: 0,
                    ["life_stealer_lifest_ability_infest_burst_02"]: 0,
                    ["life_stealer_lifest_ability_infest_burst_03"]: 0,
                    ["life_stealer_lifest_ability_infest_hero_02"]: 0,
                    ["life_stealer_lifest_ability_infest_hero_03"]: 0,
                    ["life_stealer_lifest_ability_infest_hero_04"]: 0
                }
            }
            for (const [response, timer] of GameFunc.Pair(this.responses)) {
                if (GameRules.GetDOTATime(true, true) - timer >= 60) {
                    this.GetCasterPlus().EmitSound(response);
                    this.responses[response] = GameRules.GetDOTATime(true, true);
                    return;
                }
            }
        }
        let infest_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infest_cast.vpcf", ParticleAttachment_t.PATTACH_POINT, target);
        ParticleManager.SetParticleControl(infest_particle, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(infest_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(infest_particle);
        this.GetCasterPlus().Purge(true, true, false, false, false);
        ProjectileHelper.ProjectileDodgePlus(this.GetCasterPlus());
        let infest_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_infest", {
            target_ent: target.entindex()
        }) as modifier_imba_life_stealer_infest;
        let infest_effect_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_infest_effect", {}) as modifier_imba_life_stealer_infest_effect;
        if (infest_modifier && infest_effect_modifier) {
            infest_modifier.infest_effect_modifier = infest_effect_modifier;
            infest_effect_modifier.infest_modifier = infest_modifier;
        }
        if (this.GetAbilityName() == "imba_life_stealer_infest_723" && (!target.IsRealUnit() || (target.IsRealUnit() && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber())) && !target.IsBuilding() && !target.IsOther() && !target.IsRoshan()) {
            target.ApplyHeal(this.GetSpecialValueFor("bonus_health"), this);
        }
        if (this.GetCasterPlus().GetTeamNumber() == target.GetTeamNumber() && target.IsConsideredHero()) {
            // PlayerResource.NewSelection(this.GetCasterPlus().GetPlayerID(), target);
        }
        let rage_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_rage>("imba_life_stealer_rage") || this.GetCasterPlus().FindAbilityByName("imba_life_stealer_rage_723");
        let feast_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_feast>("imba_life_stealer_feast") || this.GetCasterPlus().FindAbilityByName("imba_life_stealer_feast_723");
        if (rage_ability) {
            rage_ability.SetHidden(true);
        }
        if (feast_ability) {
            feast_ability.SetHidden(true);
        }
        let assimilate_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate>("imba_life_stealer_assimilate");
        let eject_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate_eject>("imba_life_stealer_assimilate_eject");
        if (assimilate_ability) {
            assimilate_ability.SetHidden(true);
        }
        if (eject_ability) {
            eject_ability.SetHidden(true);
        }
        let control_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_control>("imba_life_stealer_control");
        let ability_to_swap = this.GetCasterPlus().GetAbilityByIndex(2) as IBaseAbility_Plus;
        if (control_ability && ability_to_swap) {
            if (!control_ability.IsTrained()) {
                control_ability.SetLevel(1);
            }
            if (target.IsCreep() && !target.IsConsideredHero() && (!target.GetOwner() || target.GetOwner() != this.GetCasterPlus()) && !target.IsRoshan()) {
                control_ability.SetActivated(true);
            } else {
                control_ability.SetActivated(false);
            }
            this.GetCasterPlus().SwapAbilities(ability_to_swap.GetAbilityName(), control_ability.GetAbilityName(), false, true);
            if (infest_modifier) {
                infest_modifier.ability_to_swap = ability_to_swap;
            }
            if (control_ability.IsActivated() && this.GetAbilityName() == "imba_life_stealer_infest_723") {
                control_ability.OnSpellStart();
            }
        }
        let consume_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_consume>("imba_life_stealer_consume");
        if (consume_ability) {
            this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), consume_ability.GetAbilityName(), false, true);
        }
        if (this.GetCasterPlus().HasAbility("imba_life_stealer_rage_723") && this.GetCasterPlus().HasScepter() && this.GetAbilityName() == "imba_life_stealer_infest_723" && (!target.IsRealUnit() || (target.IsRealUnit() && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber())) && !target.IsBuilding() && !target.IsOther() && !target.IsRoshan()) {
            let rage_ability = this.GetCasterPlus().findAbliityPlus("imba_life_stealer_rage_723");
            target.EmitSound("Hero_LifeStealer.Rage");
            target.Purge(false, true, false, false, false);
            target.AddNewModifier(this.GetCasterPlus(), rage_ability, "modifier_imba_life_stealer_rage", {
                duration: rage_ability.GetSpecialValueFor("duration")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_infest extends BaseModifier_Plus {
    public radius: number;
    public damage: number;
    public self_regen: any;
    public ability_damage_type: number;
    public target_ent: any;
    public infest_effect_modifier: modifier_imba_life_stealer_infest_effect;
    public ability_to_swap: IBaseAbility_Plus;
    public null_destroy: boolean;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.damage = this.GetSpecialValueFor("damage");
        this.self_regen = this.GetSpecialValueFor("self_regen");
        if (!IsServer()) {
            return;
        }
        this.ability_damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.target_ent = EntIndexToHScript(params.target_ent);
        this.GetParentPlus().AddNoDraw();
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetAbsOrigin(this.target_ent.GetAbsOrigin());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.null_destroy) {
            // PlayerResource.NewSelection(this.GetCasterPlus().GetPlayerID(), this.GetCasterPlus());
            this.GetParentPlus().EmitSound("Hero_LifeStealer.Consume");
            let infest_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infest_emerge_bloody.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(infest_particle);
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_LIFESTEALER_INFEST_END);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.target_ent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    damage: this.damage,
                    damage_type: this.ability_damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
            }
            FindClearSpaceForUnit(this.GetParentPlus(), this.target_ent.GetAbsOrigin(), false);
        }
        this.GetParentPlus().RemoveNoDraw();
        if (this.infest_effect_modifier) {
            this.infest_effect_modifier.Destroy();
        }
        let rage_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_rage>("imba_life_stealer_rage") || this.GetCasterPlus().FindAbilityByName("imba_life_stealer_rage_723");
        let feast_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_feast>("imba_life_stealer_feast") || this.GetCasterPlus().FindAbilityByName("imba_life_stealer_feast_723");
        if (rage_ability) {
            rage_ability.SetHidden(false);
        }
        if (feast_ability) {
            feast_ability.SetHidden(false);
        }
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().HasAbility("imba_life_stealer_infest")) {
            let assimilate_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate>("imba_life_stealer_assimilate");
            let eject_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate_eject>("imba_life_stealer_assimilate_eject");
            if (assimilate_ability) {
                assimilate_ability.SetHidden(false);
            }
            if (eject_ability) {
                eject_ability.SetHidden(false);
            }
        }
        let control_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_control>("imba_life_stealer_control");
        if (control_ability && this.ability_to_swap) {
            this.GetCasterPlus().SwapAbilities(this.ability_to_swap.GetAbilityName(), control_ability.GetAbilityName(), true, false);
            control_ability.SetActivated(false);
        }
        let consume_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_consume>("imba_life_stealer_consume");
        if (consume_ability && this.GetAbilityPlus()) {
            this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), consume_ability.GetAbilityName(), true, false);
        }
        if (this.GetAbilityPlus().GetAbilityName() == "imba_life_stealer_infest_723") {
            this.GetAbilityPlus().UseResources(false, false, false, true);
        }
    }
    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {

        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
        if (!this.infest_effect_modifier || this.infest_effect_modifier.GetParent().GetTeamNumber() == this.GetParentPlus().GetTeamNumber() || !this.infest_effect_modifier.GetParent().IsRealUnit()) {
            state[modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED] = true;
        } else {
            state[modifierstate.MODIFIER_STATE_MUTED] = true;
            state[modifierstate.MODIFIER_STATE_ROOTED] = true;
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.self_regen;
    }
}
@registerModifier()
export class modifier_imba_life_stealer_infest_effect extends BaseModifier_Plus {
    public infest_modifier: modifier_imba_life_stealer_infest;
    public bonus_movement_speed: number;
    public bonus_health: number;
    public chestburster_tick_up_rate: any;
    public chestburster_orders_to_tick_up: any;
    public chestburster_orders_to_tick_down: any;
    public chestburster_ticks_per_damage: number;
    public chestburster_fail_knockback_distance: number;
    public chestburster_fail_knockback_height: any;
    public chestburster_fail_knockback_duration: number;
    public chestburster_fail_stun_duration: number;
    public chestburster_starting_stacks: number;
    public chestburster_success_stacks: number;
    public chestburster_failure_stacks: number;
    public chestburster_min_eject_time: number;
    public parent_tick_count: number;
    public caster_tick_count: number;
    public consume_ability: any;
    IsHidden(): boolean {
        return this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber() || !this.GetParentPlus().IsRealUnit();
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    ShouldUseOverheadOffset(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.bonus_movement_speed = this.GetSpecialValueFor("bonus_movement_speed");
        this.bonus_health = this.GetSpecialValueFor("bonus_health");
        this.chestburster_tick_up_rate = this.GetSpecialValueFor("chestburster_tick_up_rate");
        this.chestburster_orders_to_tick_up = this.GetSpecialValueFor("chestburster_orders_to_tick_up");
        this.chestburster_orders_to_tick_down = this.GetSpecialValueFor("chestburster_orders_to_tick_down");
        this.chestburster_ticks_per_damage = this.GetSpecialValueFor("chestburster_ticks_per_damage");
        this.chestburster_fail_knockback_distance = this.GetSpecialValueFor("chestburster_fail_knockback_distance");
        this.chestburster_fail_knockback_height = this.GetSpecialValueFor("chestburster_fail_knockback_height");
        this.chestburster_fail_knockback_duration = this.GetSpecialValueFor("chestburster_fail_knockback_duration");
        this.chestburster_fail_stun_duration = this.GetSpecialValueFor("chestburster_fail_stun_duration");
        this.chestburster_starting_stacks = this.GetSpecialValueFor("chestburster_starting_stacks");
        this.chestburster_success_stacks = this.GetSpecialValueFor("chestburster_success_stacks");
        this.chestburster_failure_stacks = this.GetSpecialValueFor("chestburster_failure_stacks");
        this.chestburster_min_eject_time = this.GetSpecialValueFor("chestburster_min_eject_time");
        this.parent_tick_count = 0;
        this.caster_tick_count = 0;
        if (!IsServer()) {
            return;
        }
        let infest_overhead_particle;
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !this.GetParentPlus().IsBuilding() && !this.GetParentPlus().IsOther()) {
            infest_overhead_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetParentPlus().GetTeamNumber());
        } else {
            infest_overhead_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        }
        this.AddParticle(infest_overhead_particle, false, false, -1, true, false);
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.GetParentPlus().IsRealUnit()) {
            this.consume_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_consume>("imba_life_stealer_consume");
            if (this.consume_ability) {
                this.consume_ability.SetActivated(false);
            }
            this.SetStackCount(this.chestburster_starting_stacks);
            if (this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", this.GetCasterPlus())) {
                this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", this.GetCasterPlus()).SetStackCount(this.GetStackCount());
            }
            this.StartIntervalThink(this.chestburster_tick_up_rate);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        if (this.GetElapsedTime() >= this.chestburster_min_eject_time && this.consume_ability && !this.consume_ability.IsActivated()) {
            this.consume_ability.SetActivated(true);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.infest_modifier) {
            this.infest_modifier.Destroy();
        }
        if (this.consume_ability && !this.consume_ability.IsActivated()) {
            this.consume_ability.SetActivated(true);
        }
    }
    OnStackCountChanged(stackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.GetParentPlus().IsRealUnit()) {
            if (this.infest_modifier) {
                this.infest_modifier.SetStackCount(this.GetStackCount());
            }
            if (this.GetStackCount() >= this.chestburster_success_stacks) {
                this.GetCasterPlus().ApplyHeal(this.GetParentPlus().GetHealth(), this.GetAbilityPlus());
                this.GetParentPlus().Kill(this.GetAbilityPlus(), this.GetCasterPlus());
                this.Destroy();
            } else if (this.GetStackCount() <= this.chestburster_failure_stacks && this.GetElapsedTime() > 2) {
                let random_vector = RandomVector(this.chestburster_fail_knockback_distance);
                let knockback_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_motion_controller", {
                    distance: this.chestburster_fail_knockback_distance,
                    direction_x: random_vector.x,
                    direction_y: random_vector.y,
                    direction_z: random_vector.z,
                    duration: this.chestburster_fail_knockback_duration,
                    height: this.chestburster_fail_knockback_height,
                    bGroundStop: true,
                    bDecelerate: false,
                    bInterruptible: false,
                    bIgnoreTenacity: true
                });
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                    duration: this.chestburster_fail_stun_duration * (1 - this.GetCasterPlus().GetStatusResistance())
                });
                this.Destroy();
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && (this.GetParentPlus().IsRealUnit() || this.GetParentPlus().IsBuilding() || this.GetParentPlus().IsOther())) {
            return {
                [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: Enum_MODIFIER_EVENT.ON_ORDER,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            6: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP_2,
            7: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return this.bonus_movement_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus( /** keys */): number {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !this.GetParentPlus().IsBuilding() && !this.GetParentPlus().IsOther()) {
            return this.bonus_health;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus() && keys.attacker.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            this.SetStackCount(this.GetStackCount() - this.chestburster_ticks_per_damage);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            this.parent_tick_count = this.parent_tick_count + 1;
            if (this.parent_tick_count >= this.chestburster_orders_to_tick_down) {
                this.DecrementStackCount();
                this.parent_tick_count = 0;
            }
        } else if (keys.unit == this.GetCasterPlus()) {
            this.caster_tick_count = this.caster_tick_count + 1;
            if (this.caster_tick_count >= this.chestburster_orders_to_tick_up) {
                this.IncrementStackCount();
                this.caster_tick_count = 0;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.chestburster_success_stacks;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.chestburster_failure_stacks;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (this.GetParentPlus().IsBuilding() && keys.attacker.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && keys.attacker.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            this.Destroy();
            return -100;
        }
    }
}
@registerAbility()
export class imba_life_stealer_control extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let infest_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", this.GetCasterPlus()) as modifier_imba_life_stealer_infest;
        if (infest_modifier && infest_modifier.infest_effect_modifier && infest_modifier.infest_effect_modifier.GetParent() && !infest_modifier.infest_effect_modifier.GetParent().FindModifierByNameAndCaster("modifier_imba_life_stealer_control", this.GetCasterPlus())) {
            let target = infest_modifier.infest_effect_modifier.GetParent();
            if (target.GetUnitName().includes("guys_")) {
                infest_modifier.null_destroy = true;
                let lane_creep_name = target.GetUnitName();
                let new_lane_creep = BaseNpc_Plus.CreateUnitByName(target.GetUnitName(), target.GetAbsOrigin(), this.GetCasterPlus(), false);
                new_lane_creep.SetBaseMaxHealth(target.GetMaxHealth());
                new_lane_creep.SetHealth(target.GetHealth());
                new_lane_creep.SetBaseDamageMin(target.GetBaseDamageMin());
                new_lane_creep.SetBaseDamageMax(target.GetBaseDamageMax());
                new_lane_creep.SetMinimumGoldBounty(target.GetGoldBounty());
                new_lane_creep.SetMaximumGoldBounty(target.GetGoldBounty());
                target.ForceKill(false);
                target.AddNoDraw();
                target = new_lane_creep;
                this.GetCasterPlus().SetCursorCastTarget(target);
                if (infest_modifier.GetAbility()) {
                    infest_modifier.GetAbility().OnSpellStart();
                }
            }
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_control", {});
            // PlayerResource.NewSelection(this.GetCasterPlus().GetPlayerID(), target);
            for (let slot = 0; slot <= 2; slot++) {
                if (!target.GetAbilityByIndex(slot)) {
                    let empty_ability = target.AddAbility("life_stealer_empty_" + (slot + 1));
                    empty_ability.SetHidden(false);
                }
            }
            let consume_ability = target.AddAbility("imba_life_stealer_consume");
            if (consume_ability) {
                if (infest_modifier.GetAbility()) {
                    consume_ability.SetLevel(infest_modifier.GetAbility().GetLevel());
                } else {
                    consume_ability.SetLevel(1);
                }
                consume_ability.SetHidden(false);
                consume_ability.SetActivated(true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_control extends BaseModifier_Plus {
    public fake_ally: any;
    public acquisition_range: number;
    public acquisition_null_orders: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.fake_ally = true;
        }
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().SetMana && this.GetParentPlus().GetMaxMana) {
            this.GetParentPlus().SetMana(this.GetParentPlus().GetMaxMana());
        }
        this.GetParentPlus().SetOwner(this.GetCasterPlus());
        this.GetParentPlus().SetTeam(this.GetCasterPlus().GetTeam());
        // this.GetParentPlus().SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), false);
        this.acquisition_range = this.GetParentPlus().GetAcquisitionRange();
        this.acquisition_null_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_STOP]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE]: true
        }
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.fake_ally) {
            return {
                [modifierstate.MODIFIER_STATE_FAKE_ALLY]: true,
                [modifierstate.MODIFIER_STATE_DOMINATED]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE,
            2: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        if (this.GetCasterPlus().HasAbility && this.GetCasterPlus().HasAbility("imba_life_stealer_infest")) {
            return this.GetCasterPlus().GetMoveSpeedModifier(this.GetCasterPlus().GetBaseMoveSpeed(), false);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            if (this.acquisition_null_orders[keys.order_type]) {
                this.GetParentPlus().SetAcquisitionRange(0);
            } else {
                this.GetParentPlus().SetAcquisitionRange(this.acquisition_range);
            }
        }
    }
}
@registerAbility()
export class imba_life_stealer_consume extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_life_stealer_infest";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnUpgrade(): void {
        let infest_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_infest>("imba_life_stealer_infest");
        if (infest_ability && infest_ability.GetLevel() != this.GetLevel()) {
            infest_ability.SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().GetUnitName().includes("life_stealer")) {
            this.GetCasterPlus().EmitSound("life_stealer_lifest_ability_infest_burst_01");
        }
        let infest_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", this.GetCasterPlus()) as modifier_imba_life_stealer_infest;
        let caster = this.GetCasterPlus();
        let owner = this.GetCasterPlus().GetOwner() as IBaseNpc_Plus;
        if (!infest_modifier && owner) {
            infest_modifier = owner.FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", owner) as modifier_imba_life_stealer_infest;
            caster = owner;
        }
        if (infest_modifier) {
            if (infest_modifier.infest_effect_modifier) {
                let infest_effect_modifier_parent = infest_modifier.infest_effect_modifier.GetParentPlus();
                if (infest_effect_modifier_parent && infest_effect_modifier_parent.IsCreep() && !infest_effect_modifier_parent.IsRoshan() && (infest_effect_modifier_parent.GetTeamNumber() != caster.GetTeamNumber() || infest_effect_modifier_parent.FindModifierByNameAndCaster("modifier_imba_life_stealer_control", caster) || infest_effect_modifier_parent.FindModifierByNameAndCaster("modifier_imba_life_stealer_control", caster.GetOwnerPlus()))) {
                    if (infest_modifier.GetAbility().GetAbilityName() == "imba_life_stealer_infest") {
                        caster.ApplyHeal(infest_effect_modifier_parent.GetHealth(), this);
                    }
                    infest_effect_modifier_parent.Kill(this, caster);
                    if (caster.GetUnitName().includes("life_stealer")) {
                        if (RollPercentage(5)) {
                            let rare_responses = {
                                "1": "life_stealer_lifest_ability_infest_burst_06",
                                "2": "life_stealer_lifest_ability_infest_burst_08"
                            }
                            caster.EmitSound(GFuncRandom.RandomValue(rare_responses));
                        } else if (RollPercentage(15)) {
                            caster.EmitSound("life_stealer_lifest_ability_rage_01");
                        }
                    }
                }
            }
            infest_modifier.Destroy();
        }
    }
}
@registerAbility()
export class imba_life_stealer_assimilate extends BaseAbility_Plus {
    public consume_radius: number;
    IsStealable(): boolean {
        return false;
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasAbility("imba_life_stealer_infest") && this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", this.GetCasterPlus())) {
            this.SetHidden(false);
            if (!this.IsTrained()) {
                this.SetLevel(1);
            }
        } else {
            this.SetHidden(true);
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_life_stealer_assimilate_handler";
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_OTHER;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_life_stealer_assimilate_handler", this.GetCasterPlus()) == 0) {
            return 0;
        } else {
            return this.GetSpecialValueFor("consume_radius");
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_LifeStealer.Infest");
        if (!this.GetAutoCastState()) {
            this.consume_radius = 0;
        } else {
            this.consume_radius = this.GetSpecialValueFor("consume_radius");
        }
        for (const [_, target] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorTarget().GetAbsOrigin(), undefined, this.consume_radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false))) {
            if (target != this.GetCasterPlus() && !PlayerResource.IsDisableHelpSetForPlayerID(target.GetPlayerID(), this.GetCasterPlus().GetPlayerID())) {
                let infest_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infest_cast.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
                ParticleManager.SetParticleControl(infest_particle, 0, target.GetAbsOrigin());
                ParticleManager.SetParticleControlEnt(infest_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(infest_particle);
                target.Purge(false, true, false, true, true);
                ProjectileHelper.ProjectileDodgePlus(target);
                let assimilate_effect_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_assimilate_effect", {}) as modifier_imba_life_stealer_assimilate_effect;
                let assimilate_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_assimilate", {}) as modifier_imba_life_stealer_assimilate;
                if (assimilate_effect_modifier) {
                    assimilate_effect_modifier.assimilate_modifier = assimilate_modifier;
                    assimilate_modifier.assimilate_effect_modifier = assimilate_effect_modifier;
                }
                target.Interrupt();
                let eject_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate_eject>("imba_life_stealer_assimilate_eject");
                if (eject_ability) {
                    if (!eject_ability.IsTrained()) {
                        eject_ability.SetLevel(1);
                    }
                }
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_life_stealer_assimilate_counter", {});
            }
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_assimilate_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_assimilate extends BaseModifier_Plus {
    public radius: number;
    public damage: number;
    public order_lock_duration: number;
    public ability_damage_type: number;
    public destroy_orders: any;
    public assimilate_effect_modifier: modifier_imba_life_stealer_assimilate_effect;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.damage = this.GetSpecialValueFor("damage");
        this.order_lock_duration = this.GetSpecialValueFor("order_lock_duration");
        if (!IsServer()) {
            return;
        }
        this.ability_damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.GetParentPlus().AddNoDraw();
        this.destroy_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_TAUNT]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE]: true
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_LifeStealer.Consume");
        let assimilate_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infest_emerge_bloody.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(assimilate_particle);
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_LIFESTEALER_EJECT);
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                damage: this.damage,
                damage_type: this.ability_damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetCasterPlus().GetAbsOrigin(), false);
        this.GetParentPlus().RemoveNoDraw();
        if (this.assimilate_effect_modifier && !this.assimilate_effect_modifier.IsNull()) {
            this.assimilate_effect_modifier.Destroy();
        }
        let assimilate_counter_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_assimilate_counter", this.GetCasterPlus());
        if (assimilate_counter_modifier) {
            assimilate_counter_modifier.DecrementStackCount();
            if (assimilate_counter_modifier.GetStackCount() <= 0) {
                assimilate_counter_modifier.Destroy();
            }
        }
    }
    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
        if (this.GetElapsedTime() < this.order_lock_duration) {
            state[modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED] = true;
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() && this.destroy_orders[keys.order_type]) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_assimilate_effect extends BaseModifier_Plus {
    public eject_ability: any;
    public assimilate_modifier: modifier_imba_life_stealer_assimilate;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    ShouldUseOverheadOffset(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let assimilate_overhead_particle;
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            assimilate_overhead_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_life_stealer/life_stealer_assimilated_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetParentPlus().GetTeamNumber());
        } else {
            assimilate_overhead_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_assimilated_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        }
        this.AddParticle(assimilate_overhead_particle, false, false, -1, true, false);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.assimilate_modifier && !this.assimilate_modifier.IsNull()) {
            this.assimilate_modifier.Destroy();
        }
        let assimilate_effect_modifiers = this.GetCasterPlus().FindAllModifiersByName(this.GetName());
        this.eject_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate_eject>("imba_life_stealer_assimilate_eject");
        if (this.eject_ability && GameFunc.GetCount(assimilate_effect_modifiers) <= 0) {
            this.eject_ability.SetActivated(false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HEALTH_GAINED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HEALTH_GAINED)
    CC_OnHealthGained(keys: ModifierHealEvent): void {
        if (keys.unit == this.GetCasterPlus() && this.assimilate_modifier && this.assimilate_modifier.GetParent() && this.assimilate_modifier.GetParent().IsAlive()) {
            this.assimilate_modifier.GetParent().ApplyHeal(keys.gain, this.GetAbilityPlus());
        }
    }
}
@registerModifier()
export class modifier_imba_life_stealer_assimilate_counter extends BaseModifier_Plus {
    public eject_ability: any;
    IsPurgable(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.eject_ability = this.GetCasterPlus().findAbliityPlus<imba_life_stealer_assimilate_eject>("imba_life_stealer_assimilate_eject");
        this.IncrementStackCount();
    }

    OnStackCountChanged(stackCount: number): void {
        if (this.eject_ability) {
            if (this.GetStackCount() > 0) {
                this.eject_ability.SetActivated(true);
            } else {
                this.eject_ability.SetActivated(false);
            }
        }
    }
}
@registerAbility()
export class imba_life_stealer_assimilate_eject extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasAbility("imba_life_stealer_infest") && this.GetCasterPlus().HasScepter() && !this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_life_stealer_infest", this.GetCasterPlus())) {
            this.SetHidden(false);
            if (!this.IsTrained()) {
                this.SetLevel(1);
                this.SetActivated(false);
            }
        } else {
            this.SetHidden(true);
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        let assimilate_effect_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_life_stealer_assimilate_effect") as modifier_imba_life_stealer_assimilate_effect[];
        for (const [_, modifier] of GameFunc.iPair(assimilate_effect_modifiers)) {
            let assimilate_modifier = modifier.assimilate_modifier;
            if (assimilate_modifier && assimilate_modifier.Destroy) {
                assimilate_modifier.Destroy();
            }
        }
    }
}
