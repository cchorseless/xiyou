
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function findtarget(source: IBaseAbility_Plus) {
    let t = source.GetCursorTarget();
    let c = source.GetCaster();
    if (t && c) {
        return [t, c];
    }
}

@registerAbility()
export class imba_bane_enfeeble_723 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_bane_enfeeble_723_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK;
    }
    GetCastAnimation(): GameActivity_t {
        if (this.GetCasterPlus().GetUnitName().includes("bane")) {
            return GameActivity_t.ACT_DOTA_ENFEEBLE;
        } else {
            return GameActivity_t.ACT_DOTA_CAST_ABILITY_1;
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!target.TriggerSpellAbsorb(this)) {
            this.GetCasterPlus().EmitSound("Hero_Bane.Enfeeble.Cast");
            target.EmitSound("Hero_Bane.Enfeeble");
            if (this.GetCasterPlus().GetUnitName().includes("bane") && RollPercentage(75)) {
                this.GetCasterPlus().EmitSound("bane_bane_ability_enfeeble_" + string.format("%02d", RandomInt(1, 14)));
            }
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_bane_enfeeble_723_effect", {
                duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
            });
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_bane_enfeeble_723_handler extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && (!keys.ability.IsItem() && !keys.ability.IsToggle()) && keys.target && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && keys.ability != this.GetAbilityPlus()) {
            keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_bane_enfeeble_723_effect", {
                duration: this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_bane_enfeeble_723_effect extends BaseModifier_Plus {
    public status_resistance_reduction: any;
    public magic_resistance_reduction: any;
    public discomfort_status_resistance_reduction_per_stack: number;
    public discomfort_magic_resistance_reduction_per_stack: number;
    public terror_night_vision_reduction_per_stack: number;
    public total_status_resistance_reduction: any;
    public total_magic_resistance_reduction: any;
    public terror_night_vision_reduction: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_bane/bane_enfeeble.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    Init(p_0: any,): void {
        this.status_resistance_reduction = this.GetSpecialValueFor("status_resistance_reduction") * (-1);
        this.magic_resistance_reduction = this.GetSpecialValueFor("magic_resistance_reduction") * (-1);
        this.discomfort_status_resistance_reduction_per_stack = this.GetSpecialValueFor("discomfort_status_resistance_reduction_per_stack") * (-1);
        this.discomfort_magic_resistance_reduction_per_stack = this.GetSpecialValueFor("discomfort_magic_resistance_reduction_per_stack") * (-1);
        this.terror_night_vision_reduction_per_stack = this.GetSpecialValueFor("terror_night_vision_reduction_per_stack") * (-1);
        this.total_status_resistance_reduction = this.status_resistance_reduction + this.discomfort_status_resistance_reduction_per_stack * this.GetStackCount();
        this.total_magic_resistance_reduction = this.magic_resistance_reduction + this.discomfort_magic_resistance_reduction_per_stack * this.GetStackCount();
        this.terror_night_vision_reduction = this.terror_night_vision_reduction_per_stack * this.GetStackCount();
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.total_status_resistance_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.total_magic_resistance_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.terror_night_vision_reduction;
    }
}
@registerAbility()
export class imba_bane_brain_sap_723 extends BaseAbility_Plus {
    GetCastPoint(): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastPoint();
        } else {
            return this.GetSpecialValueFor("castpoint_scepter");
        }
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return this.GetSpecialValueFor("cooldown_scepter");
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (!this.GetCasterPlus().HasScepter()) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!target.TriggerSpellAbsorb(this)) {
            this.GetCasterPlus().EmitSound("Hero_Bane.BrainSap");
            target.EmitSound("Hero_Bane.BrainSap.Target");
            if (RollPercentage(75)) {
                this.GetCasterPlus().EmitSound("bane_bane_ability_brainsap_" + string.format("%02d", RandomInt(1, 6)));
            }
            let sap_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bane/bane_sap.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(sap_particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(sap_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(sap_particle);
            let damage_heal = ApplyDamage({
                victim: target,
                attacker: this.GetCasterPlus(),
                damage: this.GetTalentSpecialValueFor("brain_sap_damage"),
                damage_type: this.GetAbilityDamageType(),
                ability: this
            });
            this.GetCasterPlus().ApplyHeal(damage_heal, this);
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brain_sap_mana", {
                duration: this.GetSpecialValueFor("addlebrain_duration") * (1 - target.GetStatusResistance())
            });
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerAbility()
export class imba_bane_fiends_grip_723 extends BaseAbility_Plus {
    public target: IBaseNpc_Plus;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_bane_fiends_grip_723_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_bane_3")) {
            return super.GetBehavior();
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
    }
    GetChannelTime(): number {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_bane_3")) {
            return this.GetCasterPlus().findBuffStack("modifier_imba_bane_fiends_grip_723_handler", this.GetCasterPlus()) * 0.01;
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        this.target = this.GetCursorTarget();
        if (!this.target.TriggerSpellAbsorb(this)) {
            if (this.GetCasterPlus().GetUnitName().includes("bane")) {
                this.GetCasterPlus().EmitSound("bane_bane_ability_fiendsgrip_" + string.format("%02d", RandomInt(1, 7)));
            }
            if (!this.GetCasterPlus().HasTalent("special_bonus_imba_bane_3")) {
                this.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_bane_fiends_grip_723", {
                    duration: this.GetChannelTime()
                });
            } else {
                this.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_bane_fiends_grip_723", {
                    duration: (super.GetChannelTime() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bane_fiends_grip_duration")) * (1 - this.target.GetStatusResistance())
                });
            }
        } else {
            this.GetCasterPlus().Interrupt();
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (this.target && !this.target.IsNull() && this.target.FindModifierByNameAndCaster("modifier_imba_bane_fiends_grip_723", this.GetCasterPlus())) {
            this.target.FindModifierByNameAndCaster("modifier_imba_bane_fiends_grip_723", this.GetCasterPlus()).Destroy();
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_bane_fiends_grip_723_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.ability == this.GetAbilityPlus() && keys.target) {
            if (keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                this.SetStackCount(((this.GetAbilityPlus().GetChannelTime() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bane_fiends_grip_duration")) * (1 - keys.target.GetStatusResistance())) * 100);
            } else {
                this.SetStackCount((this.GetAbilityPlus().GetChannelTime() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bane_fiends_grip_duration")) * 100);
            }
        } else {
            this.SetStackCount((this.GetAbilityPlus().GetChannelTime() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bane_fiends_grip_duration")) * 100);
        }
    }
}
@registerModifier()
export class modifier_imba_bane_fiends_grip_723 extends BaseModifier_Plus {
    public fiend_grip_mana_drain: any;
    public fiend_grip_damage: number;
    public fiend_grip_tick_interval: number;
    public mana_drain_per_tick: any;
    public damage_per_tick: number;
    public damage_table: ApplyDamageOptions;
    public mana_drained: any;
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bane/bane_fiends_grip.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.fiend_grip_mana_drain = this.GetSpecialValueFor("fiend_grip_mana_drain");
        this.fiend_grip_damage = this.GetSpecialValueFor("fiend_grip_damage");
        if (!IsServer()) {
            return;
        }
        this.fiend_grip_tick_interval = this.GetSpecialValueFor("fiend_grip_tick_interval") * (1 - this.GetParentPlus().GetStatusResistance());
        this.mana_drain_per_tick = this.fiend_grip_mana_drain * this.fiend_grip_tick_interval;
        this.damage_per_tick = this.fiend_grip_damage * this.fiend_grip_tick_interval;
        this.damage_table = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.damage_per_tick,
            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
            ability: this.GetAbilityPlus()
        }
        this.GetCasterPlus().EmitSound("Hero_Bane.FiendsGrip.Cast");
        this.GetParentPlus().EmitSound("Hero_Bane.Fiends_Grip");
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4);
        this.StartIntervalThink(this.fiend_grip_tick_interval);
    }
    OnIntervalThink(): void {
        ApplyDamage(this.damage_table);
        this.mana_drained = math.min(this.GetParentPlus().GetMaxMana() * this.mana_drain_per_tick * 0.01, this.GetParentPlus().GetMana());
        this.GetParentPlus().ReduceMana(this.mana_drained);
        this.GetCasterPlus().GiveMana(this.mana_drained);
        if (this.GetParentPlus().HasModifier("modifier_imba_bane_enfeeble_723_effect")) {
            this.GetParentPlus().findBuff<modifier_imba_bane_enfeeble_723_effect>("modifier_imba_bane_enfeeble_723_effect").SetDuration(this.GetParentPlus().FindModifierByName("modifier_imba_bane_enfeeble_723_effect").GetRemainingTime() + this.fiend_grip_tick_interval, true);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_Bane.FiendsGrip.Cast");
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4);
        if (this.GetAbilityPlus() && this.GetAbilityPlus().IsChanneling() && this.GetParentPlus() == this.GetAbilityPlus().GetCursorTarget()) {
            this.GetCasterPlus().Interrupt();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: Enum_MODIFIER_EVENT.ON_STATE_CHANGED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_STATE_CHANGED)
    CC_OnStateChanged(keys: ModifierUnitEvent): void {
        if (this.GetElapsedTime() >= 0.03 && (this.GetCasterPlus().IsStunned() ||
            this.GetCasterPlus().IsSilenced() || this.GetCasterPlus().IsHexed() ||
            this.GetCasterPlus().IsOutOfGame() ||
            (this.GetCasterPlus().IsFeared && this.GetCasterPlus().IsFeared()) ||
            this.GetCasterPlus().IsSleeped()) ||
            (this.GetParentPlus().IsInvulnerable() || this.GetParentPlus().IsOutOfGame())) {
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_bane_enfeeble extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let [target, caster] = findtarget(this);
            let enfeeble_duration = this.GetSpecialValueFor("enfeeble_duration");
            let talent_aoe = caster.GetTalentValue("special_bonus_imba_bane_2");
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
            if (caster.HasTalent("special_bonus_imba_bane_2")) {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, talent_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(caster, this, "modifier_imba_enfeeble_debuff", {
                        duration: enfeeble_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            } else {
                target.AddNewModifier(caster, this, "modifier_imba_enfeeble_debuff", {
                    duration: enfeeble_duration * (1 - target.GetStatusResistance())
                });
            }
            EmitSoundOn("Hero_Bane.Enfeeble.Cast", caster);
            EmitSoundOn("hero_bane.enfeeble", target);
            if (RollPercentage(75)) {
                EmitSoundOn("bane_bane_ability_enfeeble_" + string.format("%02d", RandomInt(1, 14)), this.GetCasterPlus());
            }
        }
    }
    GetAbilityTextureName(): string {
        return "bane_enfeeble";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_bane_2")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK;
        }
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let radius;
        if (caster.HasTalent("special_bonus_imba_bane_2")) {
            radius = caster.GetTalentValue("special_bonus_imba_bane_2");
        }
        return radius;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bane_2") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_bane_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_bane_2"), "modifier_special_bonus_imba_bane_2", {});
        }
    }

    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_enfeeble_debuff extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public duration: number;
    public max_stacks: number;
    public stacks_table: number[];
    public strength_bonus: number;
    public agility_bonus: number;
    public intellect_bonus: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_bane/bane_enfeeble.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.duration = this.GetDuration() * (1 - this.parent.GetStatusResistance());
            this.max_stacks = ability.GetSpecialValueFor("max_stacks");
            this.stacks_table = []
            this.stacks_table.push(GameRules.GetGameTime());
            this.StartIntervalThink(0.1);
            this.parent.AddNewModifier(caster, ability, "modifier_imba_enfeeble_debuff_vision_handler", {});
            this.strength_bonus = -(this.parent.GetStrength() * (caster.GetTalentValue("special_bonus_imba_bane_4") * 0.01));
            this.agility_bonus = -(this.parent.GetAgility() * (caster.GetTalentValue("special_bonus_imba_bane_4") * 0.01));
            this.intellect_bonus = -(this.parent.GetIntellect() * (caster.GetTalentValue("special_bonus_imba_bane_4") * 0.01));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.stacks_table.length > 0) {
                for (let i = this.stacks_table.length - 1; i >= 0; i--) {
                    if (this.stacks_table[i] + this.duration < GameRules.GetGameTime()) {
                        this.stacks_table.splice(i, 1);
                    }
                }
                if (this.stacks_table.length == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(this.stacks_table.length);
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            if (this.GetStackCount() < 5) {
                this.stacks_table.push(GameRules.GetGameTime());
            }
            let caster = this.GetCasterPlus();
            this.strength_bonus = -(this.parent.GetStrength() * (caster.GetTalentValue("special_bonus_imba_bane_4") * 0.01));
            this.agility_bonus = -(this.parent.GetAgility() * (caster.GetTalentValue("special_bonus_imba_bane_4") * 0.01));
            this.intellect_bonus = -(this.parent.GetIntellect() * (caster.GetTalentValue("special_bonus_imba_bane_4") * 0.01));
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let vision_modifier_handler = "modifier_imba_enfeeble_debuff_vision_handler";
            if (this.parent.HasModifier(vision_modifier_handler)) {
                this.parent.RemoveModifierByName(vision_modifier_handler);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetStackCount() > 0) {
            return this.GetSpecialValueFor("as_reduction") * (this.GetStackCount());
        } else {
            return this.GetSpecialValueFor("as_reduction");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.strength_bonus) {
            if (this.GetStackCount() > 0) {
                return this.strength_bonus * (this.GetStackCount());
            } else {
                return this.strength_bonus;
            }
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.agility_bonus) {
            if (this.GetStackCount() > 0) {
                return this.agility_bonus * (this.GetStackCount());
            } else {
                return this.agility_bonus;
            }
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.intellect_bonus) {
            if (this.GetStackCount() > 0) {
                return this.intellect_bonus * (this.GetStackCount());
            } else {
                return this.intellect_bonus;
            }
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetSpecialValueFor("bonus_status_resistance");
    }
}
@registerModifier()
export class modifier_imba_enfeeble_debuff_vision_handler extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public check_interval: number;
    public reduction: any;
    public stack_vision_efficiency: number;
    public efficiency: any;
    public vision_reduction: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.check_interval = this.ability.GetSpecialValueFor("check_interval");
        this.reduction = this.ability.GetSpecialValueFor("vision_reduction");
        this.stack_vision_efficiency = this.ability.GetSpecialValueFor("stack_vision_efficiency");
        this.efficiency = (1 - this.stack_vision_efficiency * 0.01);
        this.StartIntervalThink(this.check_interval);
    }

    OnIntervalThink(): void {
        let enfeeble_stacks = this.parent.findBuffStack("modifier_imba_enfeeble_debuff", this.GetCasterPlus());
        this.vision_reduction = this.reduction * (1 - (this.efficiency) ^ enfeeble_stacks) / (1 - this.efficiency);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        if (this.vision_reduction) {
            return this.vision_reduction * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        if (this.vision_reduction) {
            return this.vision_reduction * (-1);
        }
    }
}
@registerAbility()
export class imba_bane_brain_sap extends BaseAbility_Plus {
    GetCastPoint(): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastPoint();
        } else {
            return this.GetSpecialValueFor("castpoint_scepter");
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let enfeeble_debuff = target.findBuff<modifier_imba_enfeeble_debuff>("modifier_imba_enfeeble_debuff");
            let sapdamage = this.GetSpecialValueFor("brain_sap_damage");
            let sapduration = this.GetSpecialValueFor("brain_sap_duration");
            let enfeeble_stack_to_damage = this.GetSpecialValueFor("enfeeble_stack_to_damage");
            let enfeeble_charges = 0;
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
            if (caster.HasTalent("special_bonus_imba_bane_5")) {
                let baby_fiends_grip_duration = caster.GetTalentValue("special_bonus_imba_bane_5", "duration");
                let baby_duration = baby_fiends_grip_duration + 1;
                let baby_bane = caster.CreateSummon("npc_imba_brain_sap_baby_bane", caster.GetAbsOrigin() + RandomVector(100) as Vector, baby_duration);
                baby_bane.AddNewModifier(caster, undefined, "modifier_imba_brain_sap_baby_bane", {
                    duration: baby_duration
                });
                target.AddNewModifier(caster, this, "modifier_imba_fiends_grip_handler", {
                    duration: baby_fiends_grip_duration,
                    propogated: 1,
                    original_target: 1,
                    baby: true
                });
                let direction = GFuncVector.AsVector(target.GetAbsOrigin() - baby_bane.GetAbsOrigin()).Normalized();
                baby_bane.SetForwardVector(direction);
            }
            if (enfeeble_debuff) {
                enfeeble_charges = target.findBuffStack("modifier_imba_enfeeble_debuff", caster);
                enfeeble_debuff.stacks_table = [];
                enfeeble_debuff.SetStackCount(0);
            }
            let enfeeble_bonus_damage = enfeeble_stack_to_damage * enfeeble_charges;
            let damage_table = {
                victim: target,
                attacker: caster,
                damage: sapdamage + enfeeble_bonus_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                ability: this
            }
            ApplyDamage(damage_table);
            caster.ApplyHeal(sapdamage, this);
            target.AddNewModifier(caster, this, "modifier_imba_brain_sap_mana", {
                duration: sapduration * (1 - target.GetStatusResistance())
            });
            let sapFX = ResHelper.CreateParticleEx("particles/units/heroes/hero_bane/bane_sap.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControlEnt(sapFX, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(sapFX, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(sapFX);
            EmitSoundOn("Hero_Bane.BrainSap", caster);
            EmitSoundOn("Hero_Bane.BrainSap.Target", target);
            if (RollPercentage(75)) {
                EmitSoundOn("bane_bane_ability_brainsap_" + string.format("%02d", RandomInt(1, 6)), this.GetCasterPlus());
            }
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cooldown_scepter");
        } else {
            return super.GetCooldown(level);
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().GetTeamNumber() != target.GetTeamNumber() && target.IsMagicImmune()) {
            return UnitFilterResult.UF_SUCCESS;
        }
        return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
    }
    GetAbilityTextureName(): string {
        return "bane_brain_sap";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_brain_sap_mana extends BaseModifier_Plus {
    public int_loss: any;
    public previous_mana: any;
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.IsRealUnit()) {
                this.int_loss = -(parent.GetIntellect());
            }
            this.previous_mana = parent.GetMana();
            parent.SetMana(0);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.int_loss;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().SetMana(this.previous_mana);
        }
    }
}
@registerModifier()
export class modifier_imba_brain_sap_baby_bane extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let baby_bane = this.GetParentPlus();
            let fiends_grip_duration = this.GetCasterPlus().GetTalentValue("special_bonus_imba_bane_5", "duration");
            let head = SpawnEntityFromTableSynchronous("prop_dynamic", {
                model: "models/heroes/bane/bane_head.vmdl"
            });
            let shoulders = SpawnEntityFromTableSynchronous("prop_dynamic", {
                model: "models/heroes/bane/bane_shoulders.vmdl"
            });
            head.FollowEntity(baby_bane, true);
            shoulders.FollowEntity(baby_bane, true);
            baby_bane.StartGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4);
            this.AddTimer(fiends_grip_duration, () => {
                baby_bane.FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4);
            });
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        };
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            parent.ForceKill(false);
        }
    }
}
@registerAbility()
export class imba_bane_nightmare extends BaseAbility_Plus {
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let invulnduration = this.GetSpecialValueFor("nightmare_invuln_duration");
            let nightmareduration = this.GetSpecialValueFor("nightmare_duration");
            let talentinvulnbonus = caster.GetTalentValue("special_bonus_imba_bane_7");
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
            if (caster.GetTeamNumber() == target.GetTeamNumber()) {
                invulnduration = invulnduration + talentinvulnbonus;
            }
            let talent_enfeeble_stacks = caster.GetTalentValue("special_bonus_imba_bane_1");
            let enfeeble = caster.findAbliityPlus<imba_bane_enfeeble>("imba_bane_enfeeble");
            let enfeeble_duration = 0;
            if (enfeeble) {
                enfeeble_duration = enfeeble.GetSpecialValueFor("enfeeble_duration");
            }
            if (caster.GetTeamNumber() != target.GetTeamNumber() && caster.HasTalent("special_bonus_imba_bane_1")) {
                for (let i = 0; i < talent_enfeeble_stacks; i++) {
                    target.AddNewModifier(caster, enfeeble, "modifier_imba_enfeeble_debuff", {
                        duration: enfeeble_duration * (1 - target.GetStatusResistance())
                    });
                }
            }
            if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                nightmareduration = nightmareduration * (1 - target.GetStatusResistance());
                invulnduration = invulnduration * (1 - target.GetStatusResistance());
            }
            target.AddNewModifier(caster, this, "modifier_imba_nightmare_dot", {
                duration: nightmareduration
            });
            target.AddNewModifier(caster, this, "modifier_imba_nightmare_invul", {
                duration: invulnduration
            });
            EmitSoundOn("hero_bane.nightmare", target);
            if (caster != target) {
                EmitSoundOn("bane_bane_ability_nightmare_" + string.format("%02d", RandomInt(1, 3)), this.GetCasterPlus());
            }
        }
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        if (caster.HasAbility("imba_bane_nightmare_end") && caster.findAbliityPlus<imba_bane_nightmare_end>("imba_bane_nightmare_end").GetLevel() != 1) {
            caster.findAbliityPlus<imba_bane_nightmare_end>("imba_bane_nightmare_end").SetLevel(1);
        }
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_bane_nightmare_end";
    }
    GetAbilityTextureName(): string {
        return "bane_nightmare";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerAbility()
export class imba_bane_nightmare_end extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            EmitSoundOn("Hero_Bane.Nightmare.End", caster);
            let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.HasModifier("modifier_imba_nightmare_invul")) {
                    unit.RemoveModifierByName("modifier_imba_nightmare_invul");
                }
                if (unit.HasModifier("modifier_imba_nightmare_dot")) {
                    unit.RemoveModifierByName("modifier_imba_nightmare_dot");
                }
            }
        }
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_bane_nightmare";
    }
    GetAbilityTextureName(): string {
        return "bane_nightmare_end";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_nightmare_dot extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsNightmared() {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return -100;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bane/bane_nightmare.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    CC_GetOverrideAnimationRate(): number {
        return 0.2;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            5: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING
        });
    } */
    BeCreated(p_0: any,): void {
        this.GetBonusVisionPercentage();
        if (IsServer()) {
            this.OnIntervalThink();
            this.StartIntervalThink(1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NIGHTMARED]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true,
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true
        };
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(t: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (t.unit == this.GetParentPlus() && t.attacker != this.GetCasterPlus() && !t.attacker.IsBuilding() && t.attacker.GetOwnerEntity()) {
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(t: ModifierAttackEvent): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let caster = this.GetCasterPlus();
            let nightmare_duration = ability.GetSpecialValueFor("nightmare_duration");
            let nightmare_invuln_duration = ability.GetSpecialValueFor("nightmare_invuln_duration");
            if (t.target == this.GetParentPlus() && t.attacker != this.GetCasterPlus() && !t.attacker.IsBuilding() && t.attacker.GetOwnerEntity()) {
                if (t.attacker.GetTeamNumber() != caster.GetTeamNumber()) {
                    nightmare_duration = nightmare_duration * (1 - t.attacker.GetStatusResistance());
                    nightmare_invuln_duration = nightmare_invuln_duration * (1 - t.attacker.GetStatusResistance());
                }
                t.attacker.AddNewModifier(caster, ability, "modifier_imba_nightmare_dot", {
                    duration: nightmare_duration
                });
                t.attacker.AddNewModifier(caster, ability, "modifier_imba_nightmare_invul", {
                    duration: nightmare_invuln_duration
                });
                this.Destroy();
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let CurHP = parent.GetHealth();
            let nightmare_damage = ability.GetSpecialValueFor("nightmare_damage");
            if ((CurHP <= nightmare_damage)) {
                let damage = {
                    victim: parent,
                    attacker: caster,
                    damage: nightmare_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    ability: ability
                }
                ApplyDamage(damage);
            } else {
                this.GetParentPlus().SetHealth(CurHP - nightmare_damage);
            }
            EmitSoundOn("Hero_Bane.Nightmare.Loop", caster);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let nightmare_baleful_visions_duration = ability.GetSpecialValueFor("nightmare_baleful_visions_duration");
            if (caster.GetTeamNumber() != parent.GetTeamNumber()) {
                if (!parent.IsMagicImmune()) {
                    parent.AddNewModifier(caster, ability, "modifier_imba_nightmare_vision", {
                        duration: nightmare_baleful_visions_duration
                    });
                    if (caster.HasTalent("special_bonus_imba_bane_6")) {
                        parent.AddNewModifier(caster, ability, "modifier_imba_nightmare_talent", {
                            duration: caster.GetTalentValue("special_bonus_imba_bane_6")
                        });
                    }
                }
            }
            if (parent.HasModifier("modifier_imba_nightmare_invul")) {
                parent.RemoveModifierByName("modifier_imba_nightmare_invul");
            }
            EmitSoundOn("Hero_Bane.Nightmare.End", this.GetParentPlus());
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return 1;
        }
    }
}
@registerModifier()
export class modifier_imba_nightmare_invul extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: modifierstate.MODIFIER_STATE_INVULNERABLE,
            2: modifierstate.MODIFIER_STATE_NO_HEALTH_BAR
        });
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        };
    }
}
@registerModifier()
export class modifier_imba_nightmare_vision extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return -100;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE
        });
    } */
}
@registerModifier()
export class modifier_imba_nightmare_talent extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MUTED]: true
        };
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
export class imba_bane_fiends_grip extends BaseAbility_Plus {
    public fiendgriptable: IBaseNpc_Plus[];
    fiendtarget: IBaseNpc_Plus;
    fiendcaster: IBaseNpc_Plus;
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            const [fiendtarget, fiendcaster] = findtarget(this);
            this.fiendtarget = fiendtarget;
            this.fiendcaster = fiendcaster;
            let fiends_grip_duration = this.GetSpecialValueFor("fiends_grip_duration");
            if (this.fiendtarget.TriggerSpellAbsorb(this)) {
                this.fiendcaster.Interrupt();
                return;
            }
            this.fiendgriptable = [];
            this.fiendgriptable.push(this.fiendtarget);
            this.fiendtarget.Interrupt();
            this.fiendtarget.AddNewModifier(this.fiendcaster, this, "modifier_imba_fiends_grip_handler", {
                duration: fiends_grip_duration,
                propogated: 0,
                original_target: 1
            });
            if (this.fiendcaster.HasTalent("special_bonus_imba_bane_3")) {
                this.fiendcaster.AddNewModifier(this.fiendcaster, this, "modifier_imba_fiends_grip_talent", {});
            }
            EmitSoundOn("Hero_Bane.FiendsGrip.Cast", this.fiendcaster);
            EmitSoundOn("hero_bane.fiends_grip", this.fiendtarget);
            EmitSoundOn("hero_bane.fiends_grip", this.fiendcaster);
            EmitSoundOn("bane_bane_ability_fiendsgrip_" + string.format("%02d", RandomInt(1, 7)), this.GetCasterPlus());
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (IsServer()) {
            if (!this.fiendgriptable) {
                return;
            }
            for (const [k, v] of GameFunc.iPair(this.fiendgriptable)) {
                if (((v.HasModifier("modifier_imba_fiends_grip_handler")) && v.findBuff<modifier_imba_fiends_grip_handler>("modifier_imba_fiends_grip_handler").propogated == 0)) {
                    v.findBuff<modifier_imba_fiends_grip_handler>("modifier_imba_fiends_grip_handler").Destroy();
                }
            }
            StopSoundOn("Hero_Bane.FiendsGrip.Cast", this.fiendcaster);
        }
    }
    OnChannelThink(p_0: number,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasTalent("special_bonus_imba_bane_8")) {
                let vision_radius = this.GetTalentSpecialValueFor("talent_vision_radius");
                let vision_cone = this.GetTalentSpecialValueFor("talent_vision_cone");
                let fiends_grip_duration = this.GetTalentSpecialValueFor("fiends_grip_duration");
                let caster_location = caster.GetAbsOrigin();
                let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_location, undefined, vision_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                    if (!enemy.HasModifier("modifier_imba_fiends_grip_handler")) {
                        let enemy_location = enemy.GetAbsOrigin();
                        let enemy_to_caster_direction = GFuncVector.AsVector(caster_location - enemy_location).Normalized();
                        let enemy_forward_vector = enemy.GetForwardVector();
                        let view_angle = math.abs(RotationDelta(VectorToAngles(enemy_to_caster_direction), VectorToAngles(enemy_forward_vector)).y);
                        if (view_angle <= (vision_cone / 2) && enemy.CanEntityBeSeenByMyTeam(caster)) {
                            enemy.AddNewModifier(caster, this, "modifier_imba_fiends_grip_handler", {
                                duration: fiends_grip_duration - (GameRules.GetGameTime() - this.GetChannelStartTime()),
                                propogated: 0
                            });
                            this.fiendgriptable.push(enemy);
                        }
                    }
                }
            }
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_bane_3")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
    }
    GetChannelTime(): number {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_bane_3")) {
            return (this.GetSpecialValueFor("fiends_grip_duration"));
        } else {
            return 0;
        }
    }
    GetCooldown(nLevel: number): number {
        let talentcooldownbonus = this.GetCasterPlus().GetTalentValue("special_bonus_imba_bane_8");
        return super.GetCooldown(nLevel) - talentcooldownbonus;
    }
    GetChannelAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4 || GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_5;
    }
    GetAbilityTextureName(): string {
        return "bane_fiends_grip";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_fiends_grip_handler extends BaseModifier_Plus {
    public baby: boolean = false;
    public propogated: any;
    public original_target: any;
    public total_demon_damage: number;
    public total_demon_mana_drain: any;
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsPurgableException() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bane/bane_fiends_grip.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    IgnoreTenacity() {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    BeCreated(p_0: any): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            parent.Interrupt();
            parent.StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
            if (p_0.propogated == 0) {
                parent.TempData().grip_link_particle_table = [];
            }
            this.baby = GToBoolean(p_0.baby);
            this.OnIntervalThink();
            this.StartIntervalThink(1);
            this.propogated = p_0.propogated;
            this.original_target = p_0.original_target;
        }
    }
    BeRefresh(p_0: any): void {
        if (IsServer()) {
            this.baby = GToBoolean(p_0.baby);
            this.GetParentPlus().Interrupt();
            this.OnIntervalThink();
            this.StartIntervalThink(1);
            this.propogated = p_0.propogated;
            this.original_target = p_0.original_target;
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let enfeeble_debuff = parent.findBuff<modifier_imba_enfeeble_debuff>("modifier_imba_enfeeble_debuff");
            let drain_particle = "particles/hero/bane/bane_fiends_grip_tether.vpcf";
            let fiends_grip_mana_damage = ability.GetSpecialValueFor("fiends_grip_mana_damage");
            let fiends_grip_damage = ability.GetSpecialValueFor("fiends_grip_damage");
            let demon_damage = ability.GetSpecialValueFor("demon_damage");
            let demon_mana_drain = ability.GetSpecialValueFor("demon_mana_drain");
            let baby_multiplier = 1;
            if (this.baby) {
                baby_multiplier = caster.GetTalentValue("special_bonus_imba_bane_5", "dmg_mana_pct") * 0.01;
            }
            if (enfeeble_debuff && !this.baby) {
                let stacks_table = enfeeble_debuff.stacks_table;
                let particle_table = parent.TempData<any[]>().grip_link_particle_table;
                if (stacks_table.length > 0) {
                    stacks_table.pop();
                    enfeeble_debuff.DecrementStackCount();
                    let demon = caster.CreateSummon("npc_imba_fiends_grip_demon", caster.GetAbsOrigin() + RandomVector(100) as Vector, -1);
                    demon.AddNewModifier(caster, undefined, "modifier_imba_fiends_grip_demon", {});
                    demon.SetRenderColor(75, 0, 130);
                    let particle = ResHelper.CreateParticleEx(drain_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, demon);
                    particle_table.push(particle);
                    ParticleManager.SetParticleControlEnt(particle, 0, demon, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", demon.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(particle, 1, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                }
                this.total_demon_damage = demon_damage * GameFunc.GetCount(particle_table);
                this.total_demon_mana_drain = demon_mana_drain * GameFunc.GetCount(particle_table);
            } else {
                [this.total_demon_damage, this.total_demon_mana_drain] = [0, 0];
            }
            let mana_drained = math.min(parent.GetMaxMana() * (fiends_grip_mana_damage + this.total_demon_mana_drain) * 0.01, parent.GetMana());
            parent.ReduceMana((parent.GetMaxMana() * (fiends_grip_mana_damage + this.total_demon_mana_drain) * 0.01) * baby_multiplier);
            caster.GiveMana(mana_drained);
            let damage = {
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                damage: (fiends_grip_damage + this.total_demon_damage) * baby_multiplier,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.GetAbilityPlus()
            }
            if (!this.GetParentPlus().IsMagicImmune()) {
                ApplyDamage(damage);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    BeDestroy(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus<imba_bane_fiends_grip>();
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let fiends_grip_linger_duration = ability.GetSpecialValueFor("fiends_grip_linger_duration");
            let talent_3 = caster.findBuff<modifier_imba_fiends_grip_talent>("modifier_imba_fiends_grip_talent");
            if (talent_3) {
                talent_3.Destroy();
            }
            StopSoundOn("Hero_Bane.FiendsGrip.Cast", ability.fiendcaster);
            parent.FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
            if (!parent.IsMagicImmune() && this.propogated == 0) {
                if (this.original_target == 1) {
                    parent.InterruptChannel();
                }
                parent.AddNewModifier(caster, ability, "modifier_imba_fiends_grip_handler", {
                    duration: fiends_grip_linger_duration * (1 - parent.GetStatusResistance()),
                    propogated: 1
                });
            }
            if (!this.baby) {
                if (parent.IsMagicImmune() || this.propogated == 1 || !parent.IsAlive()) {
                    let particle_table = parent.TempData<any[]>().grip_link_particle_table;
                    for (let i = 0; i < particle_table.length; i++) {
                        ParticleManager.DestroyParticle(particle_table[i], false);
                        ParticleManager.ReleaseParticleIndex(particle_table[i]);
                    }
                    parent.TempData<any[]>().grip_link_particle_table = [];
                    let creatures = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, creature] of GameFunc.iPair(creatures)) {
                        if (creature.GetUnitName() == "npc_imba_fiends_grip_demon" && creature.GetPlayerID() == caster.GetPlayerID()) {
                            creature.ForceKill(false);
                        }
                    }
                }
            }
            if (ability.IsChanneling() && parent == ability.GetCursorTarget()) {
                caster.Interrupt();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_fiends_grip_talent extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bane_8")) {
            return false;
        } else {
            return true;
        }
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.StartGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4);
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_bane_fiends_grip>();
            if (caster.HasTalent("special_bonus_imba_bane_8")) {
                let vision_radius = ability.GetTalentSpecialValueFor("talent_vision_radius");
                let vision_cone = ability.GetTalentSpecialValueFor("talent_vision_cone");
                let fiends_grip_duration = ability.GetTalentSpecialValueFor("fiends_grip_duration");
                let caster_location = caster.GetAbsOrigin();
                let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_location, undefined, vision_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                    if (!enemy.HasModifier("modifier_imba_fiends_grip_handler")) {
                        let enemy_location = enemy.GetAbsOrigin();
                        let enemy_to_caster_direction = GFuncVector.AsVector(caster_location - enemy_location).Normalized();
                        let enemy_forward_vector = enemy.GetForwardVector();
                        let view_angle = math.abs(RotationDelta(VectorToAngles(enemy_to_caster_direction), VectorToAngles(enemy_forward_vector)).y);
                        if (view_angle <= (vision_cone / 2) && enemy.CanEntityBeSeenByMyTeam(caster)) {
                            enemy.AddNewModifier(caster, ability, "modifier_imba_fiends_grip_handler", {
                                duration: fiends_grip_duration - (GameRules.GetGameTime() - this.GetCreationTime()),
                                propogated: 0
                            });
                            ability.fiendgriptable.push(enemy);
                        }
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            2: Enum_MODIFIER_EVENT.ON_STATE_CHANGED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_STATE_CHANGED)
    CC_OnStateChanged(keys: ModifierUnitEvent): void {
        let unit = keys.unit;
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus<imba_bane_fiends_grip>();
        if (unit == caster && (caster.IsStunned() || caster.IsSilenced())) {
            for (let num = 0; num < GameFunc.GetCount(ability.fiendgriptable); num++) {
                if (ability.fiendgriptable[num] && ability.fiendgriptable[num].HasModifier && ability.fiendgriptable[num].HasModifier("modifier_imba_fiends_grip_handler") && ability.fiendgriptable[num].findBuff<modifier_imba_fiends_grip_handler>("modifier_imba_fiends_grip_handler").propogated == 0) {
                    ability.fiendgriptable[num].findBuff<modifier_imba_fiends_grip_handler>("modifier_imba_fiends_grip_handler").Destroy();
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4);
        }
    }
}
@registerModifier()
export class modifier_imba_fiends_grip_demon extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        };
    }
}
@registerModifier()
export class modifier_special_bonus_imba_bane_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bane_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bane_brain_sap_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bane_fiends_grip_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bane_2 extends BaseModifier_Plus {
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
