
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function IsUndyingZombie(unit: IBaseNpc_Plus) {
    if (unit.GetClassname) {
        if (unit.GetClassname() == "npc_dota_unit_undying_zombie") {
            return true;
        }
    }
    return false;
}
function IsUndyingTombstone(unit: IBaseNpc_Plus) {
    if (unit.GetClassname) {
        if (unit.GetClassname() == "npc_dota_unit_undying_tombstone") {
            return true;
        }
    }
    return false;
}
function GenerateZombieType() {
    let zombie_types = {
        "1": "npc_dota_undying_imba_zombie_torso",
        "2": "npc_dota_undying_imba_zombie"
    }
    let chosen_zombie = GFuncRandom.RandomValue(zombie_types);
    return chosen_zombie;
}

@registerAbility()
export class imba_undying_decay extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_undying_decay_cooldown");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = ability.GetCursorPosition();
        let responses = {
            "1": "undying_undying_decay_03",
            "2": "undying_undying_decay_04",
            "3": "undying_undying_decay_05",
            "4": "undying_undying_decay_07",
            "5": "undying_undying_decay_08",
            "6": "undying_undying_decay_09",
            "7": "undying_undying_decay_10"
        }
        let responses_big = {
            "1": "undying_undying_big_decay_03",
            "2": "undying_undying_big_decay_04",
            "3": "undying_undying_big_decay_05",
            "4": "undying_undying_big_decay_07",
            "5": "undying_undying_big_decay_08",
            "6": "undying_undying_big_decay_09",
            "7": "undying_undying_big_decay_10"
        }
        let cast_sound = "Hero_Undying.Decay.Cast";
        let flesh_golem_modifier = "modifier_imba_undying_flesh_golem";
        let radius = ability.GetSpecialValueFor("radius");
        caster.EmitSound(cast_sound);
        if (caster.GetUnitName().includes("undying") && RollPercentage(50)) {
            if (caster.HasModifier(flesh_golem_modifier)) {
                EmitSoundOnClient(GFuncRandom.RandomValue(responses_big), caster.GetPlayerOwner());
            } else {
                EmitSoundOnClient(GFuncRandom.RandomValue(responses), caster.GetPlayerOwner());
            }
        }
        let decay_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_decay.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(decay_particle, 0, target_point);
        ParticleManager.SetParticleControl(decay_particle, 1, Vector(radius, 0, 0));
        ParticleManager.SetParticleControl(decay_particle, 2, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(decay_particle);
        let clone_owner_units: IBaseNpc_Plus[] = []
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.IsClone() || enemy.IsTempestDouble() || enemy.GetUnitName().includes("meepo") || enemy.GetUnitName().includes("arc_warden")) {
                clone_owner_units.push(enemy);
            } else {
                if (enemy.IsRealUnit() && !enemy.IsIllusion()) {
                    enemy.EmitSound("Hero_Undying.Decay.Target");
                    caster.EmitSound("Hero_Undying.Decay.Transfer");
                    let strength_transfer_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_decay_strength_xfer.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                    ParticleManager.SetParticleControlEnt(strength_transfer_particle, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(strength_transfer_particle, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(strength_transfer_particle);
                    this.DecayDebuffEnemy(enemy);
                    this.DecayBuffCaster();
                }
                this.DealDamageEnemy(enemy);
            }
        }
        let selected_unit = undefined;
        let repeat_needed = true;
        if (GameFunc.GetCount(clone_owner_units) > 0) {
            while (repeat_needed) {
                let selected_unit = GFuncRandom.RandomRemove(clone_owner_units);
                this.DecayBuffCaster();
                this.DecayDebuffEnemy(selected_unit);
                for (let [i, v] of GameFunc.iPair(clone_owner_units)) {
                    if (v && selected_unit && v.GetUnitName() == selected_unit.GetUnitName()) {
                        this.DealDamageEnemy(v);
                        clone_owner_units.splice(i, 1);
                    }
                }
                if (GameFunc.GetCount(clone_owner_units) == 0) {
                    repeat_needed = false;
                }
            }
        }
    }
    DecayBuffCaster() {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_buff = "modifier_imba_undying_decay_buff";
        let decay_duration = ability.GetSpecialValueFor("decay_duration") + caster.GetTalentValue("special_bonus_imba_undying_decay_duration");
        if (!caster.HasModifier(modifier_buff)) {
            caster.AddNewModifier(caster, this, modifier_buff, {
                duration: decay_duration
            });
        }
        let buff_modifier_handle = caster.FindModifierByName(modifier_buff);
        if (buff_modifier_handle) {
            buff_modifier_handle.IncrementStackCount();
            buff_modifier_handle.ForceRefresh();
        }
    }
    DecayDebuffEnemy(enemy: IBaseNpc_Plus = null) {
        if (!enemy) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_debuff = "modifier_imba_undying_decay_debuff";
        let decay_duration = ability.GetSpecialValueFor("decay_duration") + caster.GetTalentValue("special_bonus_imba_undying_decay_duration");
        if (!enemy.HasModifier(modifier_debuff)) {
            enemy.AddNewModifier(caster, ability, modifier_debuff, {
                duration: decay_duration * (1 - enemy.GetStatusResistance())
            });
        }
        let debuff_modifier_handle = enemy.FindModifierByName(modifier_debuff);
        if (debuff_modifier_handle) {
            debuff_modifier_handle.IncrementStackCount();
            debuff_modifier_handle.ForceRefresh();
        }
    }
    DealDamageEnemy(enemy: IBaseNpc_Plus = null) {
        if (!enemy) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let decay_damage = ability.GetSpecialValueFor("decay_damage");
        ApplyDamage({
            victim: enemy,
            damage: decay_damage,
            damage_type: this.GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: caster,
            ability: ability
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_decay_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_undying_decay_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_undying_decay_cooldown"), "modifier_special_bonus_imba_undying_decay_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_undying_decay_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public str_steal: any;
    public str_steal_scepter: any;
    public decay_duration: number;
    public hp_gain_per_str: any;
    public stack_table: number[];
    public strength_gain: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.str_steal = this.ability.GetSpecialValueFor("str_steal");
        this.str_steal_scepter = this.ability.GetSpecialValueFor("str_steal_scepter");
        this.decay_duration = this.ability.GetSpecialValueFor("decay_duration") + this.caster.GetTalentValue("special_bonus_imba_undying_decay_duration");
        this.hp_gain_per_str = 20;
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.decay_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                    // if (this.parent.CalculateStatBonus) {
                    //     this.parent.CalculateStatBonus(true);
                    // }
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            if (this.caster.HasScepter()) {
                this.strength_gain = this.str_steal_scepter;
            } else {
                this.strength_gain = this.str_steal;
            }
            this.GetCasterPlus().Heal(this.strength_gain * this.hp_gain_per_str, this.GetAbilityPlus());
            this.ForceRefresh();
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.caster.HasScepter()) {
            return this.str_steal_scepter * this.GetStackCount();
        }
        return this.str_steal * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return 2 * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_undying_decay_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public str_steal: any;
    public str_steal_scepter: any;
    public brains_int_pct: number;
    public decay_duration: number;
    public hp_removal_per_str: any;
    public stack_table: number[];
    public strength_reduction: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.str_steal = this.ability.GetSpecialValueFor("str_steal");
        this.str_steal_scepter = this.ability.GetSpecialValueFor("str_steal_scepter");
        this.brains_int_pct = this.ability.GetSpecialValueFor("brains_int_pct");
        this.decay_duration = this.ability.GetSpecialValueFor("decay_duration") + this.caster.GetTalentValue("special_bonus_imba_undying_decay_duration");
        this.hp_removal_per_str = 20;
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.decay_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                    // if (this.parent.CalculateStatBonus) {
                    //     this.parent.CalculateStatBonus(true);
                    // }
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            if (this.caster.HasScepter()) {
                this.strength_reduction = this.str_steal_scepter;
            } else {
                this.strength_reduction = this.str_steal;
            }
            let damageTable = {
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                damage: this.hp_removal_per_str * this.strength_reduction,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
            this.ForceRefresh();
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.caster.HasScepter()) {
            return this.str_steal_scepter * this.GetStackCount() * (-1);
        }
        return this.str_steal * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.caster.HasScepter()) {
            return math.ceil(this.str_steal_scepter * this.GetStackCount() * this.brains_int_pct * 0.01) * (-1);
        }
        return math.ceil(this.str_steal * this.GetStackCount() * this.brains_int_pct * 0.01) * (-1);
    }
}
@registerAbility()
export class imba_undying_soul_rip extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsUndyingTombstone(target) && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return UnitFilterResult.UF_SUCCESS;
        } else if (IsUndyingZombie(target)) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (IsUndyingZombie(target)) {
            return "#undying_soul_rip_cannot_be_cast_on_zombies";
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let responses = {
            "1": "undying_undying_soulrip_02",
            "2": "undying_undying_soulrip_03",
            "3": "undying_undying_soulrip_04",
            "4": "undying_undying_soulrip_07"
        }
        let responses_big = {
            "1": "undying_undying_big_soulrip_02",
            "2": "undying_undying_big_soulrip_03",
            "3": "undying_undying_big_soulrip_04",
            "4": "undying_undying_big_soulrip_07"
        }
        let cast_sound = "Hero_Undying.SoulRip.Cast";
        let flesh_golem_modifier = "modifier_imba_undying_flesh_golem";
        let modifier_injection_debuff = "modifier_imba_undying_soul_rip_soul_injection_debuff";
        let modifier_injection_buff = "modifier_imba_undying_soul_rip_soul_injection_buff";
        let radius = ability.GetSpecialValueFor("radius");
        let damage_per_unit = ability.GetSpecialValueFor("damage_per_unit");
        let max_units = ability.GetSpecialValueFor("max_units");
        let soul_injection_duration = ability.GetSpecialValueFor("soul_injection_duration");
        let tombstone_heal = ability.GetSpecialValueFor("tombstone_heal");
        caster.EmitSound(cast_sound);
        if (caster.GetUnitName().includes("undying") && RollPercentage(50)) {
            if (this.GetCasterPlus().HasModifier(flesh_golem_modifier)) {
                EmitSoundOnClient(GFuncRandom.RandomValue(responses_big), caster.GetPlayerOwner());
            } else {
                EmitSoundOnClient(GFuncRandom.RandomValue(responses), caster.GetPlayerOwner());
            }
        }
        let units_ripped = 0;
        let damage_particle = undefined;
        let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit != caster && unit != target) {
                if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                    damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_soul_rip_damage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                } else {
                    damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_soul_rip_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                }
                ParticleManager.SetParticleControlEnt(damage_particle, 1, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(damage_particle);
                if (!IsUndyingZombie(unit)) {
                    ApplyDamage({
                        victim: unit,
                        damage: damage_per_unit,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                        attacker: caster,
                        ability: ability
                    });
                } else if (unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && unit.GetTeamNumber() != target.GetTeamNumber()) {
                    unit.PerformAttack(target, true, true, true, true, false, false, true);
                }
                units_ripped = units_ripped + 1;
                if (units_ripped >= max_units) {
                    return;
                }
            }
        }
        if (units_ripped >= 1) {
            if (target.GetTeamNumber() != caster.GetTeamNumber() && !target.TriggerSpellAbsorb(this)) {
                target.EmitSound("Hero_Undying.SoulRip.Enemy");
                ApplyDamage({
                    victim: target,
                    damage: damage_per_unit * units_ripped,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: caster,
                    ability: ability
                });
                if (!target.HasModifier(modifier_injection_debuff)) {
                    target.AddNewModifier(caster, ability, modifier_injection_debuff, {
                        duration: soul_injection_duration * (1 - target.GetStatusResistance())
                    });
                }
                let injection_modifier = target.FindModifierByName(modifier_injection_debuff);
                if (injection_modifier) {
                    for (let i = 0; i < units_ripped; i++) {
                        injection_modifier.IncrementStackCount();
                    }
                }
                // if (target.CalculateStatBonus) {
                //     target.CalculateStatBonus(true);
                // }
            } else if (target.GetTeamNumber() == caster.GetTeamNumber() && !IsUndyingTombstone(target)) {
                target.EmitSound("Hero_Undying.SoulRip.Ally");
                target.Heal(damage_per_unit * units_ripped, this);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, target, damage_per_unit * units_ripped, undefined);
                if (!target.HasModifier(modifier_injection_buff)) {
                    let injection_modifier = target.AddNewModifier(caster, ability, modifier_injection_buff, {
                        duration: soul_injection_duration
                    });
                }
                let injection_modifier = target.FindModifierByName(modifier_injection_buff);
                if (injection_modifier) {
                    for (let i = 0; i < units_ripped; i++) {
                        injection_modifier.IncrementStackCount();
                    }
                }
                // if (target.CalculateStatBonus) {
                //     target.CalculateStatBonus(true);
                // }
            } else if (target.GetTeamNumber() == caster.GetTeamNumber() && IsUndyingTombstone(target)) {
                target.EmitSound("Hero_Undying.SoulRip.Ally");
                target.Heal(tombstone_heal, this);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, target, tombstone_heal, undefined);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_soul_rip_soul_injection_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public soul_injection_stats_per_unit: any;
    public soul_injection_duration: number;
    public stack_table: number[];
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.soul_injection_stats_per_unit = this.ability.GetSpecialValueFor("soul_injection_stats_per_unit");
        this.soul_injection_duration = this.ability.GetSpecialValueFor("soul_injection_duration");
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.soul_injection_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                    // if (this.parent.CalculateStatBonus) {
                    //     this.parent.CalculateStatBonus(true);
                    // }
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.soul_injection_stats_per_unit * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.soul_injection_stats_per_unit * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.soul_injection_stats_per_unit * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_undying_soul_rip_soul_injection_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public soul_injection_stats_per_unit: any;
    public soul_injection_duration: number;
    public stack_table: number[];
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.soul_injection_stats_per_unit = this.ability.GetSpecialValueFor("soul_injection_stats_per_unit");
        this.soul_injection_duration = this.ability.GetSpecialValueFor("soul_injection_duration");
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.soul_injection_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                    // if (this.parent.CalculateStatBonus) {
                    //     this.parent.CalculateStatBonus(true);
                    // }
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.soul_injection_stats_per_unit * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.soul_injection_stats_per_unit * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.soul_injection_stats_per_unit * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_undying_tombstone extends BaseAbility_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = ability.GetCursorPosition();
        let responses = {
            "1": "undying_undying_tombstone_01",
            "2": "undying_undying_tombstone_02",
            "3": "undying_undying_tombstone_03",
            "4": "undying_undying_tombstone_04",
            "5": "undying_undying_tombstone_05",
            "6": "undying_undying_tombstone_06",
            "7": "undying_undying_tombstone_07",
            "8": "undying_undying_tombstone_08",
            "9": "undying_undying_tombstone_09",
            "10": "undying_undying_tombstone_10",
            "11": "undying_undying_tombstone_11",
            "12": "undying_undying_tombstone_12",
            "13": "undying_undying_tombstone_13"
        }
        let responses_big = {
            "1": "undying_undying_big_tombstone_01",
            "2": "undying_undying_big_tombstone_02",
            "3": "undying_undying_big_tombstone_03",
            "4": "undying_undying_big_tombstone_04",
            "5": "undying_undying_big_tombstone_05",
            "6": "undying_undying_big_tombstone_06",
            "7": "undying_undying_big_tombstone_07",
            "8": "undying_undying_big_tombstone_08",
            "9": "undying_undying_big_tombstone_09",
            "10": "undying_undying_big_tombstone_10",
            "11": "undying_undying_big_tombstone_11",
            "12": "undying_undying_big_tombstone_12",
            "13": "undying_undying_big_tombstone_13"
        }
        let flesh_golem_modifier = "modifier_imba_undying_flesh_golem";
        if (caster.HasModifier(flesh_golem_modifier)) {
            EmitSoundOnClient(GFuncRandom.RandomValue(responses_big), caster.GetPlayerOwner());
        } else {
            EmitSoundOnClient(GFuncRandom.RandomValue(responses), caster.GetPlayerOwner());
        }
        this.SpawnTombstone(target_point);
    }
    SpawnTombstone(target_point: Vector) {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_sound = "Hero_Undying.Tombstone";
        let tombstone_aura_ability = "imba_undying_tombstone_aura";
        let tombstone_spell_immunity_ability = "neutral_spell_immunity";
        let tombstone_health = ability.GetSpecialValueFor("tombstone_health");
        let duration = ability.GetSpecialValueFor("duration");
        let trees_destroy_radius = ability.GetSpecialValueFor("trees_destroy_radius");
        EmitSoundOnLocationWithCaster(target_point, cast_sound, caster);
        let tombstone = BaseNpc_Plus.CreateUnitByName("npc_dota_undying_imba_tombstone", target_point, caster, true);
        tombstone.SetOwner(caster);
        tombstone.SetBaseMaxHealth(tombstone_health);
        tombstone.SetMaxHealth(tombstone_health);
        tombstone.SetHealth(tombstone_health);
        tombstone.AddNewModifier(this.GetCasterPlus(), this, "modifier_kill", {
            duration: duration
        });
        let tombstone_aura_ability_handle = tombstone.FindAbilityByName(tombstone_aura_ability);
        let tombstone_spell_immunity_ability_handle = tombstone.FindAbilityByName(tombstone_spell_immunity_ability);
        if (tombstone_aura_ability_handle && tombstone_spell_immunity_ability_handle) {
            tombstone_aura_ability_handle.SetLevel(ability.GetLevel());
            tombstone_spell_immunity_ability_handle.SetLevel(1);
        }
        GridNav.DestroyTreesAroundPoint(target_point, trees_destroy_radius, true);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_tombstone_on_death") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_undying_tombstone_on_death")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_undying_tombstone_on_death"), "modifier_special_bonus_imba_undying_tombstone_on_death", {});
        }
    }
}
@registerAbility()
export class imba_undying_tombstone_aura extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_undying_tombstone_aura";
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public deathlust_ability: any;
    public zombie_neutral_spell_immunity_ability: any;
    public modifier_no_home: any;
    public no_home_duration: number;
    public radius: number;
    public zombie_interval: number;
    public tombstone_damage_hero: number;
    public tombstone_damage_creep: number;
    public owner: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.deathlust_ability = "imba_undying_tombstone_zombie_deathlust";
        this.zombie_neutral_spell_immunity_ability = "neutral_spell_immunity";
        this.modifier_no_home = "modifier_imba_undying_tombstone_zombie_modifier_no_home";
        this.no_home_duration = this.ability.GetSpecialValueFor("no_home_duration");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.zombie_interval = this.ability.GetSpecialValueFor("zombie_interval");
        this.tombstone_damage_hero = this.ability.GetSpecialValueFor("tombstone_damage_hero");
        this.tombstone_damage_creep = this.ability.GetSpecialValueFor("tombstone_damage_creep");
        if (IsServer()) {
            this.owner = this.caster.GetOwnerPlus();
            this.OnIntervalThink();
            this.StartIntervalThink(this.zombie_interval);
        }
    }
    OnIntervalThink(): void {
        if (!this.caster.IsAlive()) {
            this.StartIntervalThink(-1);
            return;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsCourier() && !IsUndyingZombie(enemy)) {
                let zombie = BaseNpc_Plus.CreateUnitByName(GenerateZombieType(), enemy.GetAbsOrigin(), this.caster, true);
                zombie.EmitSound("Undying_Zombie.Spawn");
                zombie.SetBaseDamageMin(zombie.GetBaseDamageMin() + this.owner.GetTalentValue("special_bonus_imba_undying_tombstone_zombie_damage"));
                zombie.SetBaseDamageMax(zombie.GetBaseDamageMax() + this.owner.GetTalentValue("special_bonus_imba_undying_tombstone_zombie_damage"));
                FindClearSpaceForUnit(zombie, enemy.GetAbsOrigin() + RandomVector(enemy.GetHullRadius() + zombie.GetHullRadius() as Vector) as Vector, true);
                ResolveNPCPositions(zombie.GetAbsOrigin(), enemy.GetHullRadius());
                zombie.SetAggroTarget(enemy);
                let deathlust_ability = zombie.FindAbilityByName(this.deathlust_ability) as imba_undying_tombstone_zombie_deathlust;
                let immunity_ability = zombie.FindAbilityByName(this.zombie_neutral_spell_immunity_ability);
                if (deathlust_ability && immunity_ability) {
                    deathlust_ability.SetLevel(this.ability.GetLevel());
                    deathlust_ability.tombstone_aggro_target = enemy;
                    immunity_ability.SetLevel(1);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let unit = keys.unit;
        let attacker = keys.attacker;
        if (IsUndyingTombstone(unit)) {
            let expired = false;
            if (unit == attacker) {
                expired = true;
            }
            let zombies = Entities.FindAllByClassname("npc_dota_unit_undying_zombie") as IBaseNpc_Plus[];
            for (const zombie of (zombies)) {
                if (zombie.GetOwnerPlus() == this.owner) {
                    if (expired) {
                        zombie.SetControllableByPlayer(this.owner.GetPlayerOwnerID(), true);
                        zombie.AddNewModifier(this.owner, this.GetAbilityPlus(), this.modifier_no_home, {
                            duration: this.no_home_duration
                        });
                        zombie.AddNewModifier(this.owner, this.GetAbilityPlus(), "modifier_kill", {
                            duration: this.no_home_duration
                        });
                    } else {
                        zombie.ForceKill(false);
                    }
                }
            }
        }
    }
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.target == this.caster) {
            let damage_to_tombstone;
            if (keys.attacker.IsRealUnit() || keys.attacker.IsClone() || keys.attacker.IsTempestDouble()) {
                damage_to_tombstone = this.tombstone_damage_hero;
            } else {
                damage_to_tombstone = this.tombstone_damage_creep;
            }
            if ((this.caster.GetHealth() - damage_to_tombstone) <= 0) {
                this.caster.Kill(undefined, keys.attacker);
                this.Destroy();
            } else {
                this.caster.SetHealth(this.caster.GetHealth() - damage_to_tombstone);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_modifier_no_home extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "undying_tombstone";
    }
    GetStatusEffectName(): string {
        return "particles/econ/items/spirit_breaker/spirit_breaker_iron_surge/status_effect_iron_surge.vpcf";
    }
}
@registerAbility()
export class imba_undying_tombstone_zombie_deathlust extends BaseAbility_Plus {
    public tombstone_aggro_target: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_undying_zombie_deathlust";
    }
}
@registerModifier()
export class modifier_imba_undying_zombie_deathlust extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_undying_tombstone_zombie_deathlust;
    public modifier_deathlust_buff: any;
    public modifier_deathlust_debuff: any;
    public modifier_no_home: any;
    public duration: number;
    public health_threshold_pct: number;
    public hero_tower_damage: number;
    public other_damage: number;
    public tombstone_aggro_target: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_deathlust_buff = "modifier_imba_undying_zombie_deathlust_buff";
        this.modifier_deathlust_debuff = "modifier_imba_undying_zombie_deathlust_debuff";
        this.modifier_no_home = "modifier_imba_undying_tombstone_zombie_modifier_no_home";
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.health_threshold_pct = this.ability.GetSpecialValueFor("health_threshold_pct");
        this.hero_tower_damage = this.ability.GetSpecialValueFor("hero_tower_damage");
        this.other_damage = this.ability.GetSpecialValueFor("other_damage");
        if (IsServer()) {
            this.tombstone_aggro_target = this.ability.tombstone_aggro_target;
            if (!this.tombstone_aggro_target) {
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, 256, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemy.IsCourier() && !IsUndyingZombie(enemy)) {
                        this.tombstone_aggro_target = enemy;
                        return;
                    }
                }
            }
            if (!this.tombstone_aggro_target) {
                this.caster.ForceKill(false);
            }
            this.StartIntervalThink(0.5);
        }
    }
    OnIntervalThink(): void {
        if (!this.caster.IsAlive()) {
            this.Destroy();
            return;
        }
        if (this.caster.HasModifier(this.modifier_no_home)) {
            this.StartIntervalThink(-1);
            return;
        }
        if (!this.tombstone_aggro_target) {
            this.caster.ForceKill(false);
            return;
        }
        if (!this.tombstone_aggro_target.IsAlive()) {
            this.caster.ForceKill(false);
            return;
        }
        if (this.tombstone_aggro_target.IsInvisible() && !this.caster.CanEntityBeSeenByMyTeam(this.tombstone_aggro_target)) {
            this.caster.ForceKill(false);
            return;
        }
        if (!this.caster.GetAggroTarget() || this.caster.GetAggroTarget() != this.tombstone_aggro_target) {
            if (this.caster.CanEntityBeSeenByMyTeam(this.tombstone_aggro_target)) {
                ExecuteOrderFromTable({
                    UnitIndex: this.caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: this.tombstone_aggro_target.entindex()
                });
            } else {
                ExecuteOrderFromTable({
                    UnitIndex: this.caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                    Position: this.tombstone_aggro_target.GetAbsOrigin()
                });
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_DEATH
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        let target = keys.target;
        let attacker = keys.attacker;
        if (target == this.caster) {
            let damage_to_zombie;
            if (attacker.IsRealUnit() || attacker.IsClone() || attacker.IsTempestDouble() || attacker.IsTower()) {
                damage_to_zombie = this.hero_tower_damage;
            } else {
                damage_to_zombie = this.other_damage;
            }
            if (this.caster.GetHealth() - damage_to_zombie <= 0) {
                this.caster.Kill(undefined, keys.attacker);
                this.Destroy();
            } else {
                this.caster.SetHealth(this.caster.GetHealth() - damage_to_zombie);
            }
        }
        if (attacker == this.caster && target == this.tombstone_aggro_target) {
            if (target.GetHealthPercent() <= this.health_threshold_pct) {
                if (!this.caster.HasModifier(this.modifier_deathlust_buff)) {
                    this.caster.AddNewModifier(this.caster, this.ability, this.modifier_deathlust_buff, {
                        duration: this.duration
                    });
                } else {
                    let modifier_deathlust_buff_handle = this.caster.FindModifierByName(this.modifier_deathlust_buff);
                    if (modifier_deathlust_buff_handle) {
                        modifier_deathlust_buff_handle.ForceRefresh();
                    }
                }
            }
            if (!target.HasModifier(this.modifier_deathlust_debuff)) {
                target.AddNewModifier(this.caster, this.ability, this.modifier_deathlust_debuff, {
                    duration: this.duration * (1 - attacker.GetStatusResistance())
                });
            }
            let modifier_deathlust_debuff_handle = target.FindModifierByName(this.modifier_deathlust_debuff);
            if (modifier_deathlust_debuff_handle) {
                modifier_deathlust_debuff_handle.IncrementStackCount();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_zombie_deathlust_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public bonus_move_speed_pct: number;
    public bonus_attack_speed: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.bonus_move_speed_pct = this.ability.GetSpecialValueFor("bonus_move_speed_pct");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_move_speed_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
}
@registerModifier()
export class modifier_imba_undying_zombie_deathlust_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public slow: any;
    public duration: number;
    public stack_table: number[];
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {

        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.slow = this.ability.GetSpecialValueFor("slow");
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                    // if (this.parent.CalculateStatBonus) {
                    //     this.parent.CalculateStatBonus(true);
                    // }
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_undying_flesh_golem_grab extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_undying_flesh_golem_throw";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_flesh_golem_grab_allies")) {
            if (IsUndyingTombstone(target)) {
                return UnitFilterResult.UF_SUCCESS;
            } else if (target == this.GetCasterPlus()) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            } else {
                return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP, this.GetCasterPlus().GetTeamNumber());
            }
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_flesh_golem_grab_allies") && target == this.GetCasterPlus()) {
            return "#dota_hud_error_cant_cast_on_self";
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let grab_modifier_debuff = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_flesh_golem_grab_debuff", {
            duration: this.GetSpecialValueFor("duration")
        });
        if (grab_modifier_debuff) {
            let grab_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_flesh_golem_grab", {
                duration: this.GetSpecialValueFor("duration"),
                target_entindex: target.entindex()
            });
            if (grab_modifier && this.GetCasterPlus().GetTeamNumber() != target.GetTeamNumber()) {
                grab_modifier_debuff.SetDuration(this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()), true);
                grab_modifier.SetDuration(this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()), true);
            }
        }
        if (this.GetCasterPlus().HasAbility("imba_undying_flesh_golem_throw")) {
            this.GetCasterPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").SetActivated(true);
            this.GetCasterPlus().SwapAbilities("imba_undying_flesh_golem_grab", "imba_undying_flesh_golem_throw", false, true);
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_flesh_golem_grab_allies") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_undying_flesh_golem_grab_allies")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_undying_flesh_golem_grab_allies"), "modifier_special_bonus_imba_undying_flesh_golem_grab_allies", {});
        }
    }
}
@registerModifier()
export class modifier_imba_undying_flesh_golem_grab extends BaseModifier_Plus {
    public target: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.target = EntIndexToHScript(keys.target_entindex) as IBaseNpc_Plus;
    }
}
@registerModifier()
export class modifier_imba_undying_flesh_golem_grab_debuff extends BaseModifier_Plus {
    public blink_break_range: number;
    public position: any;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.blink_break_range = this.GetSpecialValueFor("blink_break_range");
        this.position = this.GetCasterPlus().GetAbsOrigin();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!this.GetCasterPlus() || this.GetCasterPlus().IsStunned() || this.GetCasterPlus().IsHexed() || this.GetCasterPlus().IsNightmared() || this.GetCasterPlus().IsOutOfGame() || !this.GetCasterPlus().HasModifier("modifier_imba_undying_flesh_golem") || (this.GetCasterPlus().GetAbsOrigin() - this.position as Vector).Length2D() > this.blink_break_range) {
            this.Destroy();
        }
        if (this.GetCasterPlus().GetAggroTarget() != this.GetParentPlus()) {
            this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack1")) - Vector(0, 0, 50) as Vector);
        } else {
            this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 50) as Vector);
        }
        this.position = this.GetCasterPlus().GetAbsOrigin();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetCasterPlus(), this.GetCasterPlus().GetAbsOrigin(), true);
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), true);
        ResolveNPCPositions(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetHullRadius() * 2);
        if (this.GetCasterPlus().HasAbility("imba_undying_flesh_golem_throw") && this.GetCasterPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").IsActivated()) {
            this.GetCasterPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").SetActivated(false);
            this.GetCasterPlus().SwapAbilities("imba_undying_flesh_golem_grab", "imba_undying_flesh_golem_throw", true, false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_TETHERED]: true
        };
    }
}
@registerAbility()
export class imba_undying_flesh_golem_throw extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_undying_flesh_golem_grab";
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().HasModifier("modifier_imba_undying_flesh_golem_grab") && this.GetCasterPlus().findBuff<modifier_imba_undying_flesh_golem_grab>("modifier_imba_undying_flesh_golem_grab").target) {
            let target = this.GetCasterPlus().findBuff<modifier_imba_undying_flesh_golem_grab>("modifier_imba_undying_flesh_golem_grab").target;
            target.RemoveModifierByName("modifier_imba_undying_flesh_golem_grab_debuff");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_undying_flesh_golem_grab");
            let knockback_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
                distance: (this.GetCursorPosition() - target.GetAbsOrigin() as Vector).Length2D(),
                direction_x: (this.GetCursorPosition() - target.GetAbsOrigin() as Vector).Normalized().x,
                direction_y: (this.GetCursorPosition() - target.GetAbsOrigin() as Vector).Normalized().y,
                direction_z: (this.GetCursorPosition() - target.GetAbsOrigin() as Vector).Normalized().z,
                duration: (this.GetCursorPosition() - target.GetAbsOrigin() as Vector).Length2D() / this.GetSpecialValueFor("throw_speed"),
                height: this.GetSpecialValueFor("throw_max_height") * ((this.GetCursorPosition() - target.GetAbsOrigin() as Vector).Length2D() / super.GetCastRange(this.GetCursorPosition(), target)),
                bGroundStop: false,
                bDecelerate: false,
                bInterruptible: false,
                bIgnoreTenacity: true,
                bTreeRadius: target.GetHullRadius(),
                bStun: false,
                bDestroyTreesAlongPath: true
            });
        }
    }
}
@registerAbility()
export class imba_undying_flesh_golem extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_undying_flesh_golem_illusion_check";
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            let caster = this.GetCasterPlus();
            let ability_grab = "imba_undying_flesh_golem_grab";
            let ability_throw = "imba_undying_flesh_golem_throw";
            if (caster.HasAbility(ability_grab)) {
                caster.FindAbilityByName(ability_grab).SetLevel(1);
            }
            if (caster.HasAbility(ability_throw)) {
                caster.FindAbilityByName(ability_throw).SetLevel(1);
            }
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Undying.FleshGolem.Cast");
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_SPAWN);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_flesh_golem", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_imba_undying_flesh_golem_illusion_check extends BaseModifier_Plus {
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
        if (this.GetParentPlus().HasAbility("imba_undying_flesh_golem_grab")) {
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_grab>("imba_undying_flesh_golem_grab").SetLevel(1);
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_grab>("imba_undying_flesh_golem_grab").SetActivated(false);
        }
        if (this.GetParentPlus().HasAbility("imba_undying_flesh_golem_throw")) {
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").SetLevel(1);
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").SetActivated(false);
        }
        if (this.GetAbilityPlus() && this.GetParentPlus().IsIllusion()) {
            let undyings = Entities.FindAllByName(this.GetParentPlus().GetUnitName()) as IBaseNpc_Plus[];
            for (const [_, undying] of GameFunc.iPair(undyings)) {
                if (undying.IsRealUnit() && undying.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetPlayerOwner().GetAssignedHero(), this.GetAbilityPlus(), "modifier_imba_undying_flesh_golem", {
                        duration: this.GetSpecialValueFor("duration")
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_flesh_golem extends BaseModifier_Plus {
    public slow: any;
    public damage: number;
    public slow_duration: number;
    public str_percentage: any;
    public duration: number;
    public spawn_rate: any;
    public zombie_radius: number;
    public movement_bonus: number;
    public zombie_multiplier: any;
    public remnants_aura_radius: number;
    public strength: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_undying/undying_fg_aura.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.slow = this.GetSpecialValueFor("slow");
        this.damage = this.GetSpecialValueFor("damage");
        this.slow_duration = this.GetSpecialValueFor("slow_duration");
        this.str_percentage = this.GetSpecialValueFor("str_percentage");
        this.duration = this.GetSpecialValueFor("duration");
        this.spawn_rate = this.GetSpecialValueFor("spawn_rate");
        this.zombie_radius = this.GetSpecialValueFor("zombie_radius");
        this.movement_bonus = this.GetSpecialValueFor("movement_bonus");
        this.zombie_multiplier = this.GetSpecialValueFor("zombie_multiplier");
        this.remnants_aura_radius = this.GetSpecialValueFor("remnants_aura_radius");
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasAbility("imba_undying_flesh_golem_grab")) {
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_grab>("imba_undying_flesh_golem_grab").SetActivated(true);
        }
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        this.strength = 0;
        this.strength = this.GetParentPlus().GetStrength() * this.str_percentage * 0.01;
        // this.GetParentPlus().CalculateStatBonus(true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Undying.FleshGolem.End");
        if (this.GetParentPlus().HasAbility("imba_undying_flesh_golem_grab")) {
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_grab>("imba_undying_flesh_golem_grab").SetActivated(false);
        }
        if (this.GetParentPlus().HasAbility("imba_undying_flesh_golem_throw") && this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").IsActivated()) {
            this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_throw>("imba_undying_flesh_golem_throw").SetActivated(false);
            this.GetParentPlus().SwapAbilities("imba_undying_flesh_golem_grab", "imba_undying_flesh_golem_throw", true, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            6: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.str_percentage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.movement_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/heroes/undying/undying_flesh_golem.vmdl";
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.target.IsBuilding() && !keys.target.IsOther()) {
            keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_undying_flesh_golem_slow", {
                duration: this.slow_duration * (1 - keys.target.GetStatusResistance()),
                slow: this.slow,
                damage: this.damage,
                zombie_multiplier: this.zombie_multiplier
            });
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && (!this.GetAbilityPlus() || !this.GetAbilityPlus().IsStolen())) {
            this.Destroy();
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.remnants_aura_radius;
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
        return "modifier_imba_undying_flesh_golem_plague_aura";
    }
}
@registerModifier()
export class modifier_imba_undying_flesh_golem_plague_aura extends BaseModifier_Plus {
    public remnants_health_damage_pct: number;
    public remnants_max_health_heal_pct_hero: number;
    public remnants_max_health_heal_pct_non_hero: number;
    public interval: number;
    IsHidden(): boolean {
        return this.GetCasterPlus() && this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber();
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.remnants_health_damage_pct = this.GetSpecialValueFor("remnants_health_damage_pct");
            this.remnants_max_health_heal_pct_hero = this.GetSpecialValueFor("remnants_max_health_heal_pct_hero");
            this.remnants_max_health_heal_pct_non_hero = this.GetSpecialValueFor("remnants_max_health_heal_pct_non_hero");
        } else {
            this.remnants_health_damage_pct = 9;
            this.remnants_max_health_heal_pct_hero = 15;
            this.remnants_max_health_heal_pct_non_hero = 2;
        }
        this.interval = 0.5;
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.GetParentPlus().GetHealth() * this.remnants_health_damage_pct * this.interval * 0.01,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()/**&& !keys.reincarnate */) {
            this.GetCasterPlus().EmitSound("Hero_Undying.SoulRip.Ally");
            let heal_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_fg_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(heal_particle, 1, keys.unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", keys.unit.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(heal_particle);
            if (keys.unit.IsRealUnit()) {
                this.GetCasterPlus().Heal(this.GetCasterPlus().GetMaxHealth() * this.remnants_max_health_heal_pct_hero * 0.01, this.GetAbilityPlus());
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetCasterPlus(), this.GetCasterPlus().GetMaxHealth() * this.remnants_max_health_heal_pct_hero * 0.01, undefined);
            } else {
                this.GetCasterPlus().Heal(this.GetCasterPlus().GetMaxHealth() * this.remnants_max_health_heal_pct_non_hero * 0.01, this.GetAbilityPlus());
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetCasterPlus(), this.GetCasterPlus().GetMaxHealth() * this.remnants_max_health_heal_pct_non_hero * 0.01, undefined);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.remnants_health_damage_pct;
    }
}
@registerModifier()
export class modifier_imba_undying_flesh_golem_slow extends BaseModifier_Plus {
    public slow: any;
    public damage: number;
    public zombie_multiplier: any;
    public damage_type: number;
    BeCreated(keys: any): void {
        if (this.GetAbilityPlus()) {
            this.slow = this.GetSpecialValueFor("slow");
            this.damage = this.GetSpecialValueFor("damage");
            this.zombie_multiplier = this.GetSpecialValueFor("zombie_multiplier");
        } else if (keys) {
            this.slow = keys.slow;
            this.damage = keys.damage;
            this.zombie_multiplier = keys.zombie_multiplier;
        } else {
            this.slow = 40;
            this.damage = 25;
            this.zombie_multiplier = 2;
        }
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        } else {
            this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
        }
        this.SetStackCount(this.slow * (-1));
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, this.GetParentPlus(), this.damage, undefined);
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (IsUndyingZombie(keys.attacker)) {
            return 100 * this.zombie_multiplier;
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_undying_decay_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_undying_tombstone_zombie_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_undying_tombstone_on_death extends BaseModifier_Plus {
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
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && this.GetParentPlus().HasAbility("imba_undying_tombstone") && this.GetParentPlus().findAbliityPlus<imba_undying_tombstone>("imba_undying_tombstone").IsTrained()) {
            this.GetParentPlus().findAbliityPlus<imba_undying_tombstone>("imba_undying_tombstone").SpawnTombstone(this.GetParentPlus().GetAbsOrigin());
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_undying_flesh_golem_grab_allies extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_undying_decay_cooldown extends BaseModifier_Plus {
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
