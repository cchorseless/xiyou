import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";

export class imba_axe_berserkers_call extends BaseAbility_Plus {
    public called_targets: any;
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            EmitSoundOn("Hero_Axe.BerserkersCall.Start", this.GetCasterPlus());
        }
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let radius = ability.GetSpecialValueFor("radius");
        this.GetCasterPlus().EmitSound("Hero_Axe.Berserkers_Call");
        let responses_1_or_more_enemies = "axe_axe_ability_berserk_0" + math.random(1, 9);
        let responses_zero_enemy = "axe_axe_anger_0" + math.random(1, 3);
        let particle = ResHelper.CreateParticleEx("particles/econ/items/axe/axe_helm_shoutmask/axe_beserkers_call_owner_shoutmask.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster, caster);
        ParticleManager.SetParticleControl(particle, 2, Vector(radius, radius, radius));
        ParticleManager.ReleaseParticleIndex(particle);
        let enemies_in_radius = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, target] of ipairs(enemies_in_radius)) {
            if (target.IsCreep()) {
                target.SetForceAttackTarget(caster);
                target.MoveToTargetToAttack(caster);
            } else {
                target.Stop();
                target.Interrupt();
                let newOrder = {
                    UnitIndex: target.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: caster.entindex()
                }
                ExecuteOrderFromTable(newOrder);
            }
            this.AddCalledTarget(target);
            target.AddNewModifier(caster, null, "modifier_imba_berserkers_call_debuff_cmd", {
                duration: ability.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
            });
        }
        if (next(enemies_in_radius) == undefined) {
            this.GetCasterPlus().EmitSound(responses_zero_enemy);
        } else {
            this.GetCasterPlus().EmitSound(responses_1_or_more_enemies);
        }
        caster.AddNewModifier(caster, null, "modifier_imba_berserkers_call_buff_armor", {
            duration: ability.GetSpecialValueFor("duration")
        });
        if (caster.HasTalent("special_bonus_imba_axe_2")) {
            let talent_duration = caster.GetTalentValue("special_bonus_imba_axe_2");
            caster.AddNewModifier(caster, null, "modifier_imba_berserkers_call_talent", {
                duration: ability.GetSpecialValueFor("duration") + talent_duration
            });
        }
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1;
    }
    IsHidden(): boolean {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    AddCalledTarget(target: IBaseNpc_Plus) {
        if (!this.called_targets) {
            this.called_targets = {}
        }
        this.called_targets[target.entindex()] = target;
    }
    RemoveCalledTarget(target: IBaseNpc_Plus) {
        if (!this.called_targets) {
            return undefined;
        }
        this.called_targets[target.entindex()] = undefined;
    }
    GetCalledUnits() {
        if (!this.called_targets) {
            return undefined;
        }
        return this.called_targets;
    }
}
export class modifier_imba_berserkers_call_buff_armor extends BaseModifier_Plus {
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS
        });
    }
    GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetAbilityPlus().GetSpecialValueFor("bonus_armor");
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let caster_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_beserkers_call_owner.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(caster_particle, 2, Vector(0, 0, 0));
        ParticleManager.ReleaseParticleIndex(caster_particle);
        return true;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_gods_strength.vpcf";
    }
    IsPurgable(): boolean {
        return false;
    }
    IsBuff() {
        return true;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
}
export class modifier_imba_berserkers_call_talent extends BaseModifier_Plus {
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
            2: modifierfunction.MODIFIER_EVENT_ON_ATTACKED
        });
    }
    GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let stack_count = this.GetCasterPlus().findBuffStack("modifier_imba_berserkers_call_talent",);
        return stack_count;
    }
    OnAttacked(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.target == this.GetParentPlus()) {
                if (this.GetCasterPlus().HasModifier("modifier_imba_berserkers_call_buff_armor")) {
                    let stack_count = this.GetCasterPlus().findBuffStack("modifier_imba_berserkers_call_talent",);
                    this.GetParentPlus().SetModifierStackCount("modifier_imba_berserkers_call_talent", null, stack_count + 1);
                }
            }
        }
    }
    IsBuff() {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
export class modifier_imba_berserkers_call_debuff_cmd extends BaseModifier_Plus {
    public bonus_as: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_as = this.GetAbilityPlus().GetSpecialValueFor("bonus_as");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        };
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
            2: modifierfunction.MODIFIER_EVENT_ON_DEATH
        });
    }
    GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as + this.GetCasterPlus().GetTalentValue("special_bonus_imba_axe_5");
    }
    OnDeath(event: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (event.unit == this.GetCasterPlus()) {
                this.Destroy();
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (parent.IsCreep()) {
                parent.SetForceAttackTarget(undefined);
            }
            if (ability && ability.RemoveCalledTarget) {
                ability.RemoveCalledTarget(parent);
            }
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
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
export class imba_axe_battle_hunger extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster == target && caster.HasTalent("special_bonus_imba_axe_3") && caster.HasModifier("modifier_imba_berserkers_call_buff_armor")) {
                return UnitFilterResult.UF_SUCCESS;
            }
            return UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCastAnimation(): GameActivity_t {
        return (GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_range");
        }
        return 0;
    }
    OnAbilityPhaseStart(): boolean {
        let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_battle_hunger_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(cast_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(cast_particle);
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let ability = this;
        let random_response = "axe_axe_ability_battlehunger_0" + math.random(1, 3);
        caster.EmitSound(random_response);
        if (caster != target) {
            if (caster.HasScepter()) {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetAOERadius(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of ipairs(enemies)) {
                    enemy.EmitSound("Hero_Axe.Battle_Hunger");
                    this.ApplyBattleHunger(caster, enemy);
                }
            } else {
                if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                    if (target.TriggerSpellAbsorb(ability)) {
                        return undefined;
                    }
                }
                target.EmitSound("Hero_Axe.Battle_Hunger");
                this.ApplyBattleHunger(caster, target);
            }
        } else {
            caster.EmitSound("Hero_Axe.Battle_Hunger");
            let berserkers_call = caster.findAbliityPlus<imba_axe_berserkers_call>("imba_axe_berserkers_call");
            if (!berserkers_call) {
                return;
            }
            let berserkers_call_modifier = "modifier_imba_berserkers_call_debuff_cmd";
            let called_units = berserkers_call.GetCalledUnits();
            for (const [entindex, unit] of ipairs(called_units)) {
                if (unit.HasModifier(berserkers_call_modifier)) {
                    this.ApplyBattleHunger(caster, unit);
                }
            }
        }
    }
    ApplyBattleHunger(caster: IBaseNpc_Plus, target: IBaseNpc_Plus) {
        let caster_modifier = "modifier_imba_battle_hunger_buff_haste";
        let target_modifier = "modifier_imba_battle_hunger_debuff_dot";
        let duration = this.GetSpecialValueFor("duration");
        if (!caster.HasModifier(caster_modifier)) {
            caster.AddNewModifier(caster, null, caster_modifier, {});
            caster.SetModifierStackCount(caster_modifier, null, 1);
        } else {
            if (!target.HasModifier(target_modifier)) {
                let stack_count = caster.findBuffStack(caster_modifier,);
                caster.SetModifierStackCount(caster_modifier, null, stack_count + 1);
            }
        }
        if (target.IsRoshan()) {
            target.AddNewModifier(caster, null, target_modifier, {
                duration: duration * (1 - target.GetStatusResistance()),
                no_pause: true
            });
        } else {
            target.AddNewModifier(caster, null, target_modifier, {
                duration: duration * (1 - target.GetStatusResistance()),
                no_pause: false
            });
        }
    }
}
export class modifier_imba_battle_hunger_buff_haste extends BaseModifier_Plus {
    public speed_bonus: any;
    BeCreated(p_0: any,): void {
        this.speed_bonus = this.GetAbilityPlus().GetSpecialValueFor("speed_bonus");
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE
        });
    }
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.speed_bonus * this.GetStackCount();
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
export class modifier_imba_battle_hunger_debuff_dot extends BaseModifier_Plus {
    public caster: any;
    public ability: any;
    public parent: any;
    public tick_rate: any;
    public cmd_restrict_modifier: any;
    public deny_allow_modifier: any;
    public damage_over_time: any;
    public maddening_chance_pct: any;
    public max_maddening_duration: any;
    public maddening_buffer_distance: any;
    public scepter_damage_reduction: any;
    public pause_time: any;
    public units: any;
    public slow: any;
    public no_pause: any;
    public kill_count: any;
    public last_damage_time: any;
    public enemy_particle: any;
    public cmd_restricted: any;
    public restrict_modifier: any;
    public deny_modifier: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_battle_hunger.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 9;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.tick_rate = 1;
        this.cmd_restrict_modifier = "modifier_imba_battle_hunger_debuff_cmd";
        this.deny_allow_modifier = "modifier_imba_battle_hunger_debuff_deny";
        this.damage_over_time = this.GetAbilityPlus().GetSpecialValueFor("damage");
        this.maddening_chance_pct = this.GetAbilityPlus().GetSpecialValueFor("maddening_chance_pct");
        this.max_maddening_duration = this.GetAbilityPlus().GetSpecialValueFor("max_maddening_duration");
        this.maddening_buffer_distance = this.GetAbilityPlus().GetSpecialValueFor("maddening_buffer_distance");
        this.scepter_damage_reduction = this.GetAbilityPlus().GetSpecialValueFor("scepter_damage_reduction");
        this.pause_time = this.GetAbilityPlus().GetSpecialValueFor("pause_time");
        this.units = this.GetAbilityPlus().GetSpecialValueFor("units");
        this.slow = this.GetAbilityPlus().GetSpecialValueFor("slow") * (-1);
        if (!IsServer()) {
            return;
        }
        this.no_pause = params.no_pause;
        this.kill_count = 0;
        this.last_damage_time = GameRules.GetGameTime();
        this.enemy_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_battle_hunger.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.enemy_particle, 2, Vector(0, 0, 0));
        this.AddParticle(this.enemy_particle, false, false, -1, false, false);
        this.SetStackCount(this.units);
        this.StartIntervalThink(this.tick_rate);
    }
    BeRefresh(params: any): void {
        this.OnCreated(params);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (IsNearFriendlyClass(this.parent, 1360, "ent_dota_fountain")) {
                this.Destroy();
                return undefined;
            }
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: this.damage_over_time,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            if (this.no_pause == 0 && (GameRules.GetGameTime() > this.last_damage_time + this.pause_time)) {
                this.SetDuration(this.GetRemainingTime() + this.tick_rate, true);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer() && this.GetCasterPlus() && !this.GetCasterPlus().IsNull()) {
            let stack_count = this.GetCasterPlus().findBuffStack("modifier_imba_battle_hunger_buff_haste",);
            if ((stack_count == 1)) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_battle_hunger_buff_haste");
            } else {
                this.GetCasterPlus().SetModifierStackCount("modifier_imba_battle_hunger_buff_haste", null, stack_count - 1);
            }
            if (this.restrict_modifier && !this.restrict_modifier.IsNull()) {
                this.restrict_modifier.Destroy();
            }
            if (this.deny_modifier && !this.deny_modifier.IsNull()) {
                this.deny_modifier.Destroy();
            }
        }
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
            2: modifierfunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE,
            3: modifierfunction.MODIFIER_EVENT_ON_DEATH,
            4: modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE,
            5: modifierfunction.MODIFIER_EVENT_ON_ATTACK_START,
            6: modifierfunction.MODIFIER_EVENT_ON_ATTACK,
            7: modifierfunction.MODIFIER_PROPERTY_TOOLTIP
        });
    }
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow;
    }
    GetModifierTotalDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetCasterPlus().HasScepter()) {
            return this.scepter_damage_reduction;
        } else {
            return 0;
        }
    }
    OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.parent) {
            this.kill_count = this.kill_count + 1;
            this.DecrementStackCount();
            if (this.GetStackCount() <= 0) {
                this.Destroy();
            }
        }
    }
    OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.parent && keys.damage > 0) {
                this.last_damage_time = GameRules.GetGameTime();
            }
        }
    }
    OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.parent && this.parent.IsHero() && keys.target != this.caster) {
                if (!this.cmd_restricted && RollPseudoRandom(this.maddening_chance_pct,)) {
                    let targets = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.parent.Script_GetAttackRange() + this.maddening_buffer_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
                    if (lualength(targets) <= 2) {
                        return;
                    }
                    this.cmd_restricted = true;
                    for (const [_, unit] of ipairs(targets)) {
                        if (unit != this.parent && unit != keys.target) {
                            let newOrder = {
                                UnitIndex: this.parent.entindex(),
                                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                                TargetIndex: unit.entindex()
                            }
                            ExecuteOrderFromTable(newOrder);
                            this.restrict_modifier = this.parent.AddNewModifier(this.caster, this.GetAbilityPlus(), this.cmd_restrict_modifier, {
                                duration: this.max_maddening_duration
                            });
                            if (unit.GetTeamNumber() == this.parent.GetTeamNumber()) {
                                this.deny_modifier = unit.AddNewModifier(this.caster, this.GetAbilityPlus(), this.deny_allow_modifier, {
                                    1: this.max_maddening_duration
                                });
                            }
                            return;
                        }
                    }
                }
            }
        }
    }
    OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.GetParentPlus() && this.cmd_restricted) {
                this.cmd_restricted = false;
                if (this.restrict_modifier && !this.restrict_modifier.IsNull()) {
                    this.restrict_modifier.Destroy();
                }
                if (this.deny_modifier && !this.deny_modifier.IsNull()) {
                    this.deny_modifier.Destroy();
                }
                if (keys.target.GetTeamNumber() == keys.attacker.GetTeamNumber()) {
                    if (this.GetAbilityPlus() && this.GetAbilityPlus().ApplyBattleHunger) {
                        this.GetAbilityPlus().ApplyBattleHunger(this.caster, keys.target);
                    }
                }
            }
        }
    }
    OnTooltip( /** keys */): number {
        if (keys.fail_type == 2) {
            return this.damage_over_time;
        } else if (keys.fail_type == 3) {
            return this.GetStackCount();
        } else if (keys.fail_type == 4) {
            return this.pause_time;
        }
    }
}
export class modifier_imba_battle_hunger_debuff_cmd extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        };
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
export class modifier_imba_battle_hunger_debuff_deny extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
        };
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
export class imba_axe_counter_helix extends BaseAbility_Plus {
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("radius");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_counter_helix_passive";
    }
}
export class modifier_imba_counter_helix_passive extends BaseModifier_Plus {
    public caster: any;
    public ability: any;
    public modifier_enemy_taunt: any;
    public spin_to_win_modifier: any;
    public radius: any;
    public radius_increase_per_stack: any;
    public stack_limit: any;
    public stack_duration: any;
    public proc_chance: any;
    public base_damage: any;
    public allow_repeat: any;
    public repeat_chance_pct: any;
    public taunted_damage_bonus_pct: any;
    public str: any;
    public talent_4_value: any;
    public bonus_damage: any;
    public total_damage: any;
    public helix_pfx_1: any;
    public enemies: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_enemy_taunt = "modifier_imba_berserkers_call_debuff_cmd";
        this.spin_to_win_modifier = "modifier_imba_counter_helix_spin_stacks";
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.radius_increase_per_stack = this.ability.GetSpecialValueFor("radius_increase_per_stack");
        this.stack_limit = this.ability.GetSpecialValueFor("stack_limit");
        this.stack_duration = this.ability.GetSpecialValueFor("stack_duration");
        this.proc_chance = this.ability.GetSpecialValueFor("proc_chance");
        this.base_damage = this.ability.GetSpecialValueFor("base_damage");
        if (this.caster.HasTalent("special_bonus_imba_axe_5")) {
            this.proc_chance = this.proc_chance * this.caster.GetTalentValue("special_bonus_imba_axe_5", "proc_chance_multiplier");
            this.base_damage = this.base_damage * this.caster.FindTalentValue("special_bonus_imba_axe_5", "damage_multiplier") * 0.01;
        }
        if (this.caster.HasTalent("special_bonus_imba_axe_6")) {
            this.allow_repeat = true;
            this.repeat_chance_pct = this.caster.GetTalentValue("special_bonus_imba_axe_6");
        } else {
            this.allow_repeat = false;
        }
        this.taunted_damage_bonus_pct = this.ability.GetSpecialValueFor("taunted_damage_bonus_pct");
    }
    BeRefresh(p_0: any,): void {
        this.OnCreated();
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_EVENT_ON_ATTACK_LANDED
        });
    }
    OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus() && !this.GetCasterPlus().PassivesDisabled() && ((keys.target == this.GetParentPlus() && !keys.attacker.IsBuilding() && !keys.attacker.IsOther() && keys.attacker.GetTeamNumber() != keys.target.GetTeamNumber()) || (keys.attacker == this.GetCasterPlus() && this.GetCasterPlus().HasTalent("special_bonus_imba_axe_9")))) {
            this.proc_chance = this.GetAbilityPlus().GetSpecialValueFor("proc_chance");
            this.base_damage = this.GetAbilityPlus().GetSpecialValueFor("base_damage");
            if (this.caster.HasTalent("special_bonus_imba_axe_5")) {
                this.proc_chance = this.proc_chance * this.caster.GetTalentValue("special_bonus_imba_axe_5", "proc_chance_multiplier");
                this.base_damage = this.base_damage * this.caster.FindTalentValue("special_bonus_imba_axe_5", "damage_multiplier") * 0.01;
            }
            if (this.caster.HasTalent("special_bonus_imba_axe_4")) {
                this.str = this.caster.GetStrength() / 100;
                this.talent_4_value = this.caster.GetTalentValue("special_bonus_imba_axe_4");
                this.bonus_damage = this.str * this.talent_4_value;
                this.total_damage = this.base_damage + this.bonus_damage;
            } else {
                this.total_damage = this.base_damage;
            }
            if (this.caster.HasTalent("special_bonus_imba_axe_7")) {
                this.total_damage = this.total_damage + this.caster.GetPhysicalArmorValue(false) * this.caster.GetTalentValue("special_bonus_imba_axe_7");
            }
            if (RollPseudoRandom(this.proc_chance,)) {
                this.Spin(this.allow_repeat);
            }
        }
    }
    Spin(repeat_allowed) {
        this.helix_pfx_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_attack_blur_counterhelix.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster, this.caster);
        ParticleManager.SetParticleControl(this.helix_pfx_1, 0, this.caster.GetAbsOrigin());
        if (Battlepass && Battlepass.HasArcana(this.caster.GetPlayerID(), "axe")) {
            ParticleManager.SetParticleControlEnt(this.helix_pfx_1, 1, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.helix_pfx_1, 2, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.helix_pfx_1, 3, this.caster.GetAbsOrigin());
        }
        ParticleManager.ReleaseParticleIndex(this.helix_pfx_1);
        this.caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
        this.caster.EmitSound("Hero_Axe.CounterHelix");
        let spin_to_win = this.caster.FindModifierByName(this.spin_to_win_modifier);
        let radius = this.radius;
        if (spin_to_win) {
            radius = radius + spin_to_win.GetStackCount() * this.radius_increase_per_stack;
        }
        this.enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of ipairs(this.enemies)) {
            let damage = this.total_damage;
            if (enemy.HasModifier(this.modifier_enemy_taunt)) {
                damage = damage * (1 + this.taunted_damage_bonus_pct * 0.01);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, enemy, damage, undefined);
            }
            ApplyDamage({
                attacker: this.caster,
                victim: enemy,
                ability: this.ability,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
            });
        }
        if (spin_to_win) {
            spin_to_win.ForceRefresh();
            spin_to_win.IncrementStackCount();
        } else {
            spin_to_win = this.caster.AddNewModifier(this.caster, this.ability, this.spin_to_win_modifier, {
                duration: this.stack_duration
            });
            if (spin_to_win) {
                spin_to_win.IncrementStackCount();
            }
        }
        if (repeat_allowed && RollPercentage(this.repeat_chance_pct)) {
            this.Spin(false);
        }
    }
    IsPassive(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
export class modifier_imba_counter_helix_spin_stacks extends BaseModifier_Plus {
    public stack_limit: any;
    BeCreated(p_0: any,): void {
        this.stack_limit = this.GetAbilityPlus().GetSpecialValueFor("stack_limit");
    }
    OnStackCountChanged(oldstacks: number): void {
        if (this.GetStackCount() > this.stack_limit) {
            this.SetStackCount(this.stack_limit);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
export class imba_axe_culling_blade extends BaseAbility_Plus {
    public caster: any;
    public ability: any;
    public target: any;
    public target_location: any;
    public scepter: any;
    public kill_enemy_response: any;
    public culling_modifier: any;
    public kill_threshold: any;
    public kill_threshold_max_hp_pct: any;
    public damage: any;
    public speed_bonus: any;
    public as_bonus: any;
    public speed_duration: any;
    public speed_aoe_radius: any;
    public max_health_kill_heal_pct: any;
    public scepter_battle_hunger_radius: any;
    public culling_stack_duration: any;
    public threshold_increase: any;
    public threshold_max_hp_pct_increase: any;
    public damageTable: any;
    public item: any;
    public blink_cd_remaining: any;
    public blink_cd_total_minus_two: any;
    public allies_in_radius: any;
    public targets: any;
    public battle_hunger_ability: any;
    public heal_amount: any;
    public culling_kill_particle: any;
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.BaseClass.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_axe_8");
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.ability = this;
        this.target = this.GetCursorTarget();
        this.target_location = this.target.GetAbsOrigin();
        this.scepter = this.caster.HasScepter();
        this.kill_enemy_response = "axe_axe_ability_cullingblade_0" + math.random(1, 2);
        this.culling_modifier = "modifier_imba_culling_blade_cull_stacks";
        this.kill_threshold = this.ability.GetSpecialValueFor("kill_threshold");
        this.kill_threshold_max_hp_pct = this.ability.GetSpecialValueFor("kill_threshold_max_hp_pct") / 100;
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.speed_bonus = this.ability.GetSpecialValueFor("speed_bonus");
        this.as_bonus = this.ability.GetSpecialValueFor("as_bonus");
        this.speed_duration = this.ability.GetSpecialValueFor("speed_duration");
        this.speed_aoe_radius = this.ability.GetSpecialValueFor("speed_aoe");
        this.max_health_kill_heal_pct = this.ability.GetSpecialValueFor("max_health_kill_heal_pct");
        this.scepter_battle_hunger_radius = this.ability.GetSpecialValueFor("scepter_battle_hunger_radius");
        this.culling_stack_duration = this.ability.GetSpecialValueFor("stack_duration");
        this.threshold_increase = this.ability.GetSpecialValueFor("threshold_increase");
        this.threshold_max_hp_pct_increase = this.ability.GetSpecialValueFor("threshold_max_hp_pct_increase");
        if (this.target.GetTeamNumber() != this.caster.GetTeamNumber()) {
            if (this.target.TriggerSpellAbsorb(this.ability)) {
                this.caster.RemoveModifierByName(this.culling_modifier);
                return;
            }
        }
        let dunk_modifier = this.caster.FindModifierByName(this.culling_modifier);
        if (dunk_modifier) {
            this.kill_threshold = this.kill_threshold + dunk_modifier.GetStackCount() * this.threshold_increase;
            this.kill_threshold_max_hp_pct = this.kill_threshold_max_hp_pct + dunk_modifier.GetStackCount() * this.threshold_max_hp_pct_increase / 100;
        }
        this.damageTable = {
            victim: this.target,
            attacker: this.caster,
            damage: this.damage,
            damage_type: this.ability.GetAbilityDamageType(),
            ability: this.ability
        }
        let vLocation = this.GetCursorPosition();
        let kv = {
            vLocX: vLocation.x,
            vLocY: vLocation.y,
            vLocZ: vLocation.z
        }
        if ((this.target.GetHealth() <= this.kill_threshold || (this.target.GetHealth() / this.target.GetMaxHealth() <= this.kill_threshold_max_hp_pct)) && !this.target.HasModifier("modifier_imba_reincarnation_scepter_wraith")) {
            if (this.caster.HasTalent("special_bonus_imba_axe_8") && (this.GetCasterPlus().GetAbsOrigin() - this.target_location).Length2D() > this.BaseClass.GetCastRange(this.target_location, this.target)) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), null, "modifier_imba_culling_blade_motion", kv);
                this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_4, 1);
                Timers.CreateTimer(0.40, () => {
                    this.KillUnit(this.target);
                    this.GetCasterPlus().EmitSound("Hero_Axe.Culling_Blade_Success");
                });
            } else {
                this.KillUnit(this.target);
                this.GetCasterPlus().EmitSound("Hero_Axe.Culling_Blade_Success");
            }
            for (let i = 0; i <= 5; i += 1) {
                this.item = this.caster.GetItemInSlot(i);
                if (this.item && this.item.GetAbilityName().find("^item_imba_blink")) {
                    this.blink_cd_remaining = this.item.GetCooldownTimeRemaining();
                    this.blink_cd_total_minus_two = this.item.GetCooldown(0) - 2;
                    if ((this.blink_cd_remaining >= this.blink_cd_total_minus_two)) {
                        this.kill_enemy_response = "axe_axe_blinkcull_0" + math.random(1, 3);
                    } else {
                        this.kill_enemy_response = "axe_axe_ability_cullingblade_0" + math.random(1, 2);
                    }
                }
            }
            this.GetCasterPlus().EmitSoundParams(this.kill_enemy_response, 200, 1000, 1);
            this.allies_in_radius = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.speed_aoe_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, target] of ipairs(this.allies_in_radius)) {
                target.AddNewModifier(this.caster, null, "modifier_imba_culling_blade_buff_haste", {
                    duration: this.speed_duration
                });
            }
            if ((this.target.IsHero())) {
                this.ability.EndCooldown();
                if (dunk_modifier) {
                    dunk_modifier.ForceRefresh();
                } else {
                    dunk_modifier = this.caster.AddNewModifier(this.caster, null, this.culling_modifier, {
                        duration: this.culling_stack_duration
                    });
                }
                dunk_modifier.IncrementStackCount();
            }
            if (this.scepter) {
                this.targets = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target.GetAbsOrigin(), undefined, this.scepter_battle_hunger_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
                this.battle_hunger_ability = this.caster.findAbliityPlus<imba_axe_battle_hunger>("imba_axe_battle_hunger");
                if (this.battle_hunger_ability && this.battle_hunger_ability.GetLevel() > 0) {
                    for (const [_, enemies] of ipairs(this.targets)) {
                        this.battle_hunger_ability.ApplyBattleHunger(this.caster, enemies);
                    }
                }
            }
        } else {
            if (this.caster.HasTalent("special_bonus_imba_axe_8") && (this.GetCasterPlus().GetAbsOrigin() - this.target_location).Length2D() > this.GetCastRange(this.target_location, this.target)) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), null, "modifier_imba_culling_blade_motion", kv);
                this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_4, 1);
                Timers.CreateTimer(0.4, () => {
                    EmitSoundOn("Hero_Axe.Culling_Blade_Fail", this.GetCasterPlus());
                    ApplyDamage(this.damageTable);
                });
            } else {
                EmitSoundOn("Hero_Axe.Culling_Blade_Fail", this.GetCasterPlus());
                ApplyDamage(this.damageTable);
            }
            this.caster.RemoveModifierByName(this.culling_modifier);
        }
    }
    KillUnit(target: IBaseNpc_Plus) {
        TrueKill(this.caster, target,);
        this.heal_amount = (this.caster.GetMaxHealth() / 100) * this.max_health_kill_heal_pct;
        this.caster.Heal(this.heal_amount, this.caster);
        this.culling_kill_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_culling_blade_kill.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.caster, this.caster);
        ParticleManager.SetParticleControl(this.culling_kill_particle, 4, this.target_location);
        ParticleManager.ReleaseParticleIndex(this.culling_kill_particle);
    }
    GetCastAnimation(): GameActivity_t {
        if (this.target && this.target_location && this.GetCasterPlus().HasTalent("special_bonus_imba_axe_8") && (this.GetCasterPlus().GetAbsOrigin() - this.target_location).Length2D() > this.BaseClass.GetCastRange(this.target_location, this.target)) {
            return GameActivity_t.ACT_SHOTGUN_PUMP;
        } else {
            return GameActivity_t.ACT_DOTA_CAST_ABILITY_4;
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_axe_8") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_axe_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_axe_8"), "modifier_special_bonus_imba_axe_8", {});
        }
    }
}
export class modifier_imba_culling_blade_cull_stacks extends BaseModifier_Plus {
    public stack_limit: any;
    BeCreated(p_0: any,): void {
        this.stack_limit = this.GetAbilityPlus().GetSpecialValueFor("stack_limit");
    }
    OnStackCountChanged(oldstacks: number): void {
        if (this.GetStackCount() > this.stack_limit) {
            this.SetStackCount(this.stack_limit);
        }
    }
}
export class modifier_imba_culling_blade_buff_haste extends BaseModifier_Plus {
    public axe_culling_blade_boost: any;
    public pfx: any;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.axe_culling_blade_boost = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_culling_blade_boost.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(this.axe_culling_blade_boost);
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_cullingblade_sprint_axe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        this.AddParticle(this.pfx, false, false, -1, false, false);
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
            2: modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT
        });
    }
    GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetAbilityPlus().GetSpecialValueFor("speed_bonus");
    }
    GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetAbilityPlus().GetSpecialValueFor("as_bonus");
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    StatusEffectPriority(): modifierpriority {
        return 11;
    }
    GetStatusEffectName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_axe_arcana")) {
            return "particles/econ/items/axe/ti9_jungle_axe/ti9_jungle_axe_culling_blade_hero_effect.vpcf";
        } else {
            return "particles/units/heroes/hero_axe/axe_culling_blade_hero_effect.vpcf";
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
export class modifier_imba_culling_blade_motion extends BaseModifier_Plus {
    public axe_minimum_height_above_lowest: any;
    public axe_minimum_height_above_highest: any;
    public axe_acceleration_z: any;
    public axe_max_horizontal_acceleration: any;
    public vStartPosition: any;
    public flCurrentTimeHoriz: any;
    public flCurrentTimeVert: any;
    public vLoc: any;
    public vLastKnownTargetPos: any;
    public flInitialVelocityZ: any;
    public flPredictedTotalTime: any;
    public vHorizontalVelocity: any;
    public frametime: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_HIGH;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.axe_minimum_height_above_lowest = 500;
            this.axe_minimum_height_above_highest = 100;
            this.axe_acceleration_z = 4000;
            this.axe_max_horizontal_acceleration = 3000;
            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.flCurrentTimeHoriz = 0.0;
            this.flCurrentTimeVert = 0.0;
            this.vLoc = Vector(kv.vLocX, kv.vLocY, kv.vLocZ);
            this.vLastKnownTargetPos = this.vLoc;
            let duration = this.GetAbilityPlus().GetSpecialValueFor("duration");
            let flDesiredHeight = this.axe_minimum_height_above_lowest * duration * duration;
            let flLowZ = math.min(this.vLastKnownTargetPos.z, this.vStartPosition.z);
            let flHighZ = math.max(this.vLastKnownTargetPos.z, this.vStartPosition.z);
            let flArcTopZ = math.max(flLowZ + flDesiredHeight, flHighZ + this.axe_minimum_height_above_highest);
            let flArcDeltaZ = flArcTopZ - this.vStartPosition.z;
            this.flInitialVelocityZ = math.sqrt(2.0 * flArcDeltaZ * this.axe_acceleration_z);
            let flDeltaZ = this.vLastKnownTargetPos.z - this.vStartPosition.z;
            let flSqrtDet = math.sqrt(math.max(0, (this.flInitialVelocityZ * this.flInitialVelocityZ) - 2.0 * this.axe_acceleration_z * flDeltaZ));
            this.flPredictedTotalTime = math.max((this.flInitialVelocityZ + flSqrtDet) / this.axe_acceleration_z, (this.flInitialVelocityZ - flSqrtDet) / this.axe_acceleration_z);
            this.vHorizontalVelocity = (this.vLastKnownTargetPos - this.vStartPosition) / this.flPredictedTotalTime;
            this.vHorizontalVelocity.z = 0.0;
            this.frametime = FrameTime();
            this.StartIntervalThink(this.frametime);
        }
    }
    OnIntervalThink(): void {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return undefined;
        }
        this.HorizontalMotion(this.GetParentPlus(), this.frametime);
        this.VerticalMotion(this.GetParentPlus(), this.frametime);
    }
    HorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.flCurrentTimeHoriz = math.min(this.flCurrentTimeHoriz + dt, this.flPredictedTotalTime);
            let t = this.flCurrentTimeHoriz / this.flPredictedTotalTime;
            let vStartToTarget = this.vLastKnownTargetPos - this.vStartPosition;
            let vDesiredPos = this.vStartPosition + t * vStartToTarget;
            let vOldPos = me.GetOrigin();
            let vToDesired = vDesiredPos - vOldPos;
            vToDesired.z = 0.0;
            let vDesiredVel = vToDesired / dt;
            let vVelDif = vDesiredVel - this.vHorizontalVelocity;
            let flVelDif = vVelDif.Length2D();
            vVelDif = vVelDif.Normalized();
            let flVelDelta = math.min(flVelDif, this.axe_max_horizontal_acceleration);
            this.vHorizontalVelocity = this.vHorizontalVelocity + vVelDif * flVelDelta * dt;
            let vNewPos = vOldPos + this.vHorizontalVelocity * dt;
            me.SetOrigin(vNewPos);
        }
    }
    VerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (!this.GetParentPlus().IsAlive()) {
                this.GetParentPlus().InterruptMotionControllers(true);
                this.Destroy();
            }
            this.flCurrentTimeVert = this.flCurrentTimeVert + dt;
            let bGoingDown = (-this.axe_acceleration_z * this.flCurrentTimeVert + this.flInitialVelocityZ) < 0;
            let vNewPos = me.GetOrigin();
            vNewPos.z = this.vStartPosition.z + (-0.5 * this.axe_acceleration_z * (this.flCurrentTimeVert * this.flCurrentTimeVert) + this.flInitialVelocityZ * this.flCurrentTimeVert);
            let flGroundHeight = GetGroundHeight(vNewPos, this.GetParentPlus());
            let bLanded = false;
            if ((vNewPos.z < flGroundHeight && bGoingDown == true)) {
                vNewPos.z = flGroundHeight;
                bLanded = true;
            }
            me.SetOrigin(vNewPos);
            if (bLanded == true) {
                this.Destroy();
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().SetUnitOnClearGround();
        }
    }
}
export class modifier_axe_arcana extends BaseModifier_Plus {
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    DeclareFunctions(): modifierfunction[] {
        return Object.values({
            1: modifierfunction.MODIFIER_PROPERTY_TRANSLATE_ATTACK_SOUND
        });
    }
    GetAttackSound(): string {
        return "Hero_Axe.Attack.Jungle";
    }
}
export class modifier_special_bonus_imba_axe_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_axe_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_axe_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_axe_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_axe_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_axe_9 extends BaseModifier_Plus {
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
