
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_undying_decay extends BaseAbility_Plus {
    public scepter_updated: any;
    public responses: { [k: string]: string };
    public responses_big: { [k: string]: string };;
    public debuff_modifier_table: modifier_imba_undying_decay_debuff[];
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_undying_decay_cooldown");
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter() && !this.scepter_updated) {
            let buffs = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_undying_decay_buff") as modifier_imba_undying_decay_buff[];
            for (const mod of (buffs)) {
                if (mod.str_steal_scepter) {
                    mod.SetStackCount(mod.str_steal_scepter);
                }
            }
            if (this.debuff_modifier_table && GameFunc.GetCount(this.debuff_modifier_table) > 0) {
                for (const [_, debuff] of GameFunc.iPair(this.debuff_modifier_table)) {
                    if (!debuff.IsNull() && debuff.str_steal_scepter) {
                        debuff.SetStackCount(debuff.str_steal_scepter);
                    }
                }
            }
            this.scepter_updated = true;
        } else if (!this.GetCasterPlus().HasScepter() && this.scepter_updated) {
            let buffs = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_undying_decay_buff") as modifier_imba_undying_decay_buff[];
            for (const mod of (buffs)) {
                if (mod.str_steal) {
                    mod.SetStackCount(mod.str_steal);
                }
            }
            if (this.debuff_modifier_table) {
                for (const [_, debuff] of GameFunc.iPair(this.debuff_modifier_table)) {
                    if (!debuff.IsNull() && debuff.str_steal) {
                        debuff.SetStackCount(debuff.str_steal);
                    }
                }
            }
            this.scepter_updated = false;
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        this.scepter_updated = this.GetCasterPlus().HasScepter();
        this.GetCasterPlus().EmitSound("Hero_Undying.Decay.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("undying") && RollPercentage(50)) {
            if (!this.responses) {
                this.responses = {
                    "1": "undying_undying_decay_03",
                    "2": "undying_undying_decay_04",
                    "3": "undying_undying_decay_05",
                    "4": "undying_undying_decay_07",
                    "5": "undying_undying_decay_08",
                    "6": "undying_undying_decay_09",
                    "7": "undying_undying_decay_10"
                }
            }
            if (!this.responses_big) {
                this.responses_big = {
                    "1": "undying_undying_big_decay_03",
                    "2": "undying_undying_big_decay_04",
                    "3": "undying_undying_big_decay_05",
                    "4": "undying_undying_big_decay_07",
                    "5": "undying_undying_big_decay_08",
                    "6": "undying_undying_big_decay_09",
                    "7": "undying_undying_big_decay_10"
                }
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_undying_flesh_golem")) {
                EmitSoundOnClient(GFuncRandom.RandomValue(this.responses_big), this.GetCasterPlus().GetPlayerOwner());
            } else {
                EmitSoundOnClient(GFuncRandom.RandomValue(this.responses), this.GetCasterPlus().GetPlayerOwner());
            }
        }
        let decay_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_decay.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(decay_particle, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(decay_particle, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0));
        ParticleManager.SetParticleControl(decay_particle, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(decay_particle);
        let clone_owner_units: { [k: string]: EntityIndex[] } = {}
        let strength_transfer_particle = undefined;
        let flies_transfer_particle = undefined;
        let buff_modifier = undefined;
        let debuff_modifier = undefined;
        if (!this.debuff_modifier_table) {
            this.debuff_modifier_table = []
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (enemy.IsClone() || enemy.IsTempestDouble()) {
                if (enemy.GetPlayerOwner && enemy.GetPlayerOwner().GetAssignedHero && enemy.GetPlayerOwner().GetAssignedHero().entindex()) {
                    if (!clone_owner_units[enemy.GetPlayerOwner().entindex() + ""]) {
                        clone_owner_units[enemy.GetPlayerOwner().entindex() + ""] = []
                    }
                    clone_owner_units[enemy.GetPlayerOwner().entindex() + ""].push(enemy.entindex());
                }
            } else {
                if (enemy.IsRealUnit() && !enemy.IsIllusion()) {
                    enemy.EmitSound("Hero_Undying.Decay.Target");
                    this.GetCasterPlus().EmitSound("Hero_Undying.Decay.Transfer");
                    strength_transfer_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_decay_strength_xfer.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                    ParticleManager.SetParticleControlEnt(strength_transfer_particle, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(strength_transfer_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(strength_transfer_particle);
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_decay_debuff_counter", {
                        duration: this.GetTalentSpecialValueFor("decay_duration") * (1 - enemy.GetStatusResistance())
                    });
                    debuff_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_decay_debuff", {
                        duration: this.GetTalentSpecialValueFor("decay_duration") * (1 - enemy.GetStatusResistance())
                    }) as modifier_imba_undying_decay_debuff;
                    this.debuff_modifier_table.push(debuff_modifier);
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_decay_buff_counter", {
                        duration: this.GetTalentSpecialValueFor("decay_duration")
                    });
                    buff_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_decay_buff", {
                        duration: this.GetTalentSpecialValueFor("decay_duration")
                    });
                }
                ApplyDamage({
                    victim: enemy,
                    damage: this.GetSpecialValueFor("decay_damage"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
            }
        }
        let selected_unit: IBaseNpc_Plus = undefined;
        if (Object.keys(clone_owner_units).length > 0) {
            for (const sindex in clone_owner_units) {
                const tables = clone_owner_units[sindex];
                const enemy = EntIndexToHScript(GToNumber(sindex) as EntityIndex) as IBaseNpc_Plus;
                enemy.EmitSound("Hero_Undying.Decay.Target");
                this.GetCasterPlus().EmitSound("Hero_Undying.Decay.Transfer");
                selected_unit = EntIndexToHScript(tables[RandomInt(1, GameFunc.GetCount(tables))]) as IBaseNpc_Plus;;
                enemy.AddNewModifier(selected_unit, this, "modifier_imba_undying_decay_debuff_counter", {
                    duration: this.GetTalentSpecialValueFor("decay_duration") * (1 - enemy.GetStatusResistance())
                });
                debuff_modifier = enemy.AddNewModifier(selected_unit, this, "modifier_imba_undying_decay_debuff", {
                    duration: this.GetTalentSpecialValueFor("decay_duration") * (1 - enemy.GetStatusResistance())
                }) as modifier_imba_undying_decay_debuff;
                this.debuff_modifier_table.push(debuff_modifier);
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_decay_buff_counter", {
                    duration: this.GetTalentSpecialValueFor("decay_duration")
                });
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_decay_buff", {
                    duration: this.GetTalentSpecialValueFor("decay_duration")
                });
                for (const enemy_entindex of tables) {
                    ApplyDamage({
                        victim: EntIndexToHScript(enemy_entindex) as IBaseNpc_Plus,
                        damage: this.GetSpecialValueFor("decay_damage"),
                        damage_type: this.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this
                    });
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_decay_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_undying_decay_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_undying_decay_cooldown"), "modifier_special_bonus_imba_undying_decay_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_undying_decay_buff extends BaseModifier_Plus {
    public str_steal: any;
    public str_steal_scepter: any;
    public hp_gain_per_str: any;
    public strength_gain: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.str_steal = this.GetSpecialValueFor("str_steal");
        this.str_steal_scepter = this.GetSpecialValueFor("str_steal_scepter");
        this.hp_gain_per_str = 20;
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasScepter()) {
            this.SetStackCount(this.GetStackCount() + this.str_steal);
            this.strength_gain = this.str_steal;
        } else {
            this.SetStackCount(this.GetStackCount() + this.str_steal_scepter);
            this.strength_gain = this.str_steal_scepter;
        }
        this.GetCasterPlus().ApplyHeal(this.strength_gain * 20, this.GetAbilityPlus());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_undying_decay_buff_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_undying_decay_buff_counter>("modifier_imba_undying_decay_buff_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_undying_decay_buff_counter").GetStackCount() - this.GetStackCount());
        }
    }
    OnStackCountChanged(stackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_undying_decay_buff_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_undying_decay_buff_counter>("modifier_imba_undying_decay_buff_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_undying_decay_buff_counter").GetStackCount() + (this.GetStackCount() - stackCount));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return 2;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_undying_decay_buff_counter extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_undying/undying_decay_strength_buff.vpcf";
    }
}
@registerModifier()
export class modifier_imba_undying_decay_debuff extends BaseModifier_Plus {
    public str_steal: any;
    public str_steal_scepter: any;
    public brains_int_pct: number;
    public hp_removal_per_str: any;
    public strength_reduction: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.str_steal = this.GetSpecialValueFor("str_steal");
        this.str_steal_scepter = this.GetSpecialValueFor("str_steal_scepter");
        this.brains_int_pct = this.GetSpecialValueFor("brains_int_pct");
        this.hp_removal_per_str = 20;
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasScepter()) {
            this.SetStackCount(this.GetStackCount() + this.str_steal);
            this.strength_reduction = this.str_steal;
        } else {
            this.SetStackCount(this.GetStackCount() + this.str_steal_scepter);
            this.strength_reduction = this.str_steal_scepter;
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
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_undying_decay_debuff_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_undying_decay_debuff_counter>("modifier_imba_undying_decay_debuff_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_undying_decay_debuff_counter").GetStackCount() - this.GetStackCount());
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus<imba_undying_decay>().debuff_modifier_table) {
            GFuncArray.FitterRemove(this.GetAbilityPlus<imba_undying_decay>().debuff_modifier_table, (i, j) => {
                return i != this;
            });
        }
    }
    OnStackCountChanged(stackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_undying_decay_debuff_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_undying_decay_debuff_counter>("modifier_imba_undying_decay_debuff_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_undying_decay_debuff_counter").GetStackCount() + (this.GetStackCount() - stackCount));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return math.ceil(this.GetStackCount() * this.brains_int_pct * 0.01) * (-1);
    }
}
@registerModifier()
export class modifier_imba_undying_decay_debuff_counter extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_undying_soul_rip extends BaseAbility_Plus {
    public responses: any;
    public responses_big: any;
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target.GetUnitName().includes("undying_tombstone") && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Undying.SoulRip.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("undying") && RollPercentage(50)) {
            if (!this.responses) {
                this.responses = {
                    "1": "undying_undying_soulrip_02",
                    "2": "undying_undying_soulrip_03",
                    "3": "undying_undying_soulrip_04",
                    "4": "undying_undying_soulrip_07"
                }
            }
            if (!this.responses_big) {
                this.responses_big = {
                    "1": "undying_undying_big_soulrip_02",
                    "2": "undying_undying_big_soulrip_03",
                    "3": "undying_undying_big_soulrip_04",
                    "4": "undying_undying_big_soulrip_07"
                }
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_undying_flesh_golem")) {
                EmitSoundOnClient(GFuncRandom.RandomValue(this.responses_big), this.GetCasterPlus().GetPlayerOwner());
            } else {
                EmitSoundOnClient(GFuncRandom.RandomValue(this.responses), this.GetCasterPlus().GetPlayerOwner());
            }
        }
        let target = this.GetCursorTarget();
        let units_ripped = 0;
        let damage_particle = undefined;
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false))) {
            if (unit != this.GetCasterPlus() && unit != target) {
                if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_soul_rip_damage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                } else {
                    damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_soul_rip_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                }
                ParticleManager.SetParticleControlEnt(damage_particle, 1, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(damage_particle);
                if (!unit.GetUnitName().includes("undying_zombie")) {
                    unit.SetHealth(math.max(unit.GetHealth() - this.GetSpecialValueFor("damage_per_unit"), 1));
                } else if (unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && unit.GetTeamNumber() != target.GetTeamNumber()) {
                    unit.AttackOnce(target, true, true, true, true, false, false, true);
                }
                units_ripped = units_ripped + 1;
                if (units_ripped >= this.GetSpecialValueFor("max_units")) {
                    return;
                }
            }
        }
        if (units_ripped >= 1) {
            if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && !target.TriggerSpellAbsorb(this)) {
                target.EmitSound("Hero_Undying.SoulRip.Enemy");
                ApplyDamage({
                    victim: target,
                    damage: this.GetSpecialValueFor("damage_per_unit") * units_ripped,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                let injection_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_soul_rip_soul_injection_debuff", {
                    duration: this.GetSpecialValueFor("soul_injection_duration") * (1 - target.GetStatusResistance())
                });
                if (injection_modifier) {
                    injection_modifier.SetStackCount(units_ripped);
                    // if (target.CalculateStatBonus) {
                    //     target.CalculateStatBonus(true);
                    // }
                }
            } else if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !target.GetUnitName().includes("undying_tombstone")) {
                target.EmitSound("Hero_Undying.SoulRip.Ally");
                target.ApplyHeal(this.GetSpecialValueFor("damage_per_unit") * units_ripped, this);
                let injection_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_soul_rip_soul_injection", {
                    duration: this.GetSpecialValueFor("soul_injection_duration")
                });
                if (injection_modifier) {
                    injection_modifier.SetStackCount(units_ripped);
                    // if (target.CalculateStatBonus) {
                    //     target.CalculateStatBonus(true);
                    // }
                }
            } else if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && target.GetUnitName().includes("undying_tombstone")) {
                target.EmitSound("Hero_Undying.SoulRip.Ally");
                target.ApplyHeal(this.GetSpecialValueFor("tombstone_heal"), this);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_soul_rip_soul_injection extends BaseModifier_Plus {
    public soul_injection_stats_per_unit: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.soul_injection_stats_per_unit = this.GetSpecialValueFor("soul_injection_stats_per_unit");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // if (this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
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
    public soul_injection_stats_per_unit: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.soul_injection_stats_per_unit = this.GetSpecialValueFor("soul_injection_stats_per_unit") * (-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // if (this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
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
@registerAbility()
export class imba_undying_tombstone extends BaseAbility_Plus {
    public responses: any;
    public responses_big: any;
    OnSpellStart(deathPosition?: Vector /** deathPosition */): void {
        let position = this.GetCursorPosition();
        if (deathPosition) {
            position = deathPosition;
        }
        EmitSoundOnLocationWithCaster(position, "Hero_Undying.Tombstone", this.GetCasterPlus());
        if (this.GetCasterPlus().GetUnitName().includes("undying")) {
            if (!this.responses) {
                this.responses = {
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
            }
            if (!this.responses_big) {
                this.responses_big = {
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
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_undying_flesh_golem")) {
                EmitSoundOnClient(GFuncRandom.RandomValue(this.responses_big), this.GetCasterPlus().GetPlayerOwner());
            } else {
                EmitSoundOnClient(GFuncRandom.RandomValue(this.responses), this.GetCasterPlus().GetPlayerOwner());
            }
        }
        let tombstone = this.GetCasterPlus().CreateSummon("npc_imba_unit_tombstone" + this.GetLevel(), position, this.GetSpecialValueFor("duration"), true);
        tombstone.SetBaseMaxHealth(this.GetTalentSpecialValueFor("hits_to_destroy_tooltip") * 4);
        tombstone.SetMaxHealth(this.GetTalentSpecialValueFor("hits_to_destroy_tooltip") * 4);
        tombstone.SetHealth(this.GetTalentSpecialValueFor("hits_to_destroy_tooltip") * 4);
        tombstone.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_undying_tombstone_zombie_aura", {
            duration: this.GetSpecialValueFor("duration")
        });
        tombstone.AddNewModifier(this.GetCasterPlus(), this, "modifier_magic_immune", {
            duration: this.GetSpecialValueFor("duration")
        });
        GridNav.DestroyTreesAroundPoint(position, 300, true);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_undying_tombstone_on_death") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_undying_tombstone_on_death")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_undying_tombstone_on_death"), "modifier_special_bonus_imba_undying_tombstone_on_death", {});
        }
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_aura extends BaseModifier_Plus {
    public duration: number;
    public radius: number;
    public health_threshold_pct_tooltip: number;
    public zombie_interval: number;
    public level: any;
    public caster: IBaseNpc_Plus;
    public zombie_types: { [k: string]: string };
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.duration = this.GetSpecialValueFor("duration");
        this.radius = this.GetSpecialValueFor("radius");
        this.health_threshold_pct_tooltip = this.GetSpecialValueFor("health_threshold_pct_tooltip");
        this.zombie_interval = this.GetSpecialValueFor("zombie_interval");
        this.level = this.GetAbilityPlus().GetLevel();
        this.caster = this.GetCasterPlus();
        if (!IsServer()) {
            return;
        }
        this.zombie_types = {
            "1": "npc_imba_unit_undying_zombie",
            "2": "npc_imba_unit_undying_zombie_torso"
        }
        this.OnIntervalThink();
        this.StartIntervalThink(this.zombie_interval);
    }
    OnIntervalThink(): void {
        let zombie: IBaseNpc_Plus = undefined;
        let deathstrike_ability = undefined;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.caster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false))) {
            if (!enemy.IsCourier() && !enemy.GetUnitName().includes("undying_zombie")) {
                zombie = this.caster.CreateSummon(GFuncRandom.RandomValue(this.zombie_types), enemy.GetAbsOrigin(), -1, true);
                zombie.EmitSound("Undying_Zombie.Spawn");
                zombie.SetBaseDamageMin(zombie.GetBaseDamageMin() + this.caster.GetTalentValue("special_bonus_imba_undying_tombstone_zombie_damage"));
                zombie.SetBaseDamageMax(zombie.GetBaseDamageMax() + this.caster.GetTalentValue("special_bonus_imba_undying_tombstone_zombie_damage"));
                FindClearSpaceForUnit(zombie, enemy.GetAbsOrigin() + RandomVector(enemy.GetHullRadius() + zombie.GetHullRadius()) as Vector, true);
                ResolveNPCPositions(zombie.GetAbsOrigin(), zombie.GetHullRadius());
                zombie.SetAggroTarget(enemy);
                zombie.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_imba_undying_tombstone_zombie_modifier", {
                    enemy_entindex: enemy.entindex()
                });
                deathstrike_ability = zombie.AddAbility("imba_undying_tombstone_zombie_deathstrike");
                if (deathstrike_ability) {
                    deathstrike_ability.SetLevel(this.level);
                }
                zombie.SwapAbilities("imba_undying_tombstone_zombie_deathstrike", "undying_tombstone_zombie_deathstrike", true, false);
                zombie.RemoveAbility("undying_tombstone_zombie_deathstrike");
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const ent of (this.caster.FindChildByName("npc_imba_unit_undying_zombie"))) {
            if (ent.GetOwnerPlus() == this.GetParentPlus()) {
                if (this.GetRemainingTime() > 0) {
                    ent.ForceKill(false);
                }
                else {
                    if (ent.HasModifier("modifier_imba_undying_tombstone_zombie_modifier")) {
                        ent.findBuff<modifier_imba_undying_tombstone_zombie_modifier>("modifier_imba_undying_tombstone_zombie_modifier").bTombstoneDead = true;
                        ent.findBuff<modifier_imba_undying_tombstone_zombie_modifier>("modifier_imba_undying_tombstone_zombie_modifier").aggro_target = undefined;
                    }
                    ent.SetOwner(this.GetCasterPlus());
                    // ent.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
                    ent.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_undying_tombstone_zombie_modifier_no_home", {
                        duration: this.duration
                    });
                    ent.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
                        duration: this.duration
                    });
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
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
        if (keys.target == this.GetParentPlus()) {
            if ((keys.attacker.IsRealUnit() || keys.attacker.IsClone() || keys.attacker.IsTempestDouble())) {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - 4);
            } else {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - 1);
            }
            if (this.GetParentPlus().GetHealth() <= 0) {
                this.GetParentPlus().Kill(undefined, keys.attacker);
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_modifier extends BaseModifier_Plus {
    public aggro_target: any;
    public invis_timer: number;
    public game_time: number;
    bTombstoneDead: boolean = false;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.aggro_target = EntIndexToHScript(keys.enemy_entindex);
        this.invis_timer = 0;
        this.game_time = GameRules.GetGameTime();
    }
    // CheckState(): Partial<Record<modifierstate, boolean>> {
    //     if (IsServer()) {
    //         if (!this.bTombstoneDead) {
    //             if (!this.aggro_target || this.aggro_target.IsNull() || (this.aggro_target.IsInvisible() && !this.GetParentPlus().CanEntityBeSeenByMyTeam(this.aggro_target))) {
    //                 this.invis_timer = GameRules.GetGameTime() - this.game_time;
    //                 if (this.invis_timer >= 0.1) {
    //                     this.GetParentPlus().ForceKill(false);
    //                 }
    //             } else {
    //                 this.invis_timer = 0;
    //                 if (!this.GetParentPlus().CanEntityBeSeenByMyTeam(this.aggro_target)) {
    //                     ExecuteOrderFromTable({
    //                         UnitIndex: this.GetParentPlus().entindex(),
    //                         OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
    //                         Position: this.aggro_target.GetAbsOrigin()
    //                     });
    //                 } else if (this.GetParentPlus().GetAggroTarget() != this.aggro_target) {
    //                     ExecuteOrderFromTable({
    //                         UnitIndex: this.GetParentPlus().entindex(),
    //                         OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
    //                         TargetIndex: this.aggro_target
    //                     });
    //                 }
    //                 this.game_time = GameRules.GetGameTime();
    //             }
    //         }
    //     }
    // }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_DEATH
        });
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
        if (keys.target == this.GetParentPlus()) {
            if ((keys.attacker.IsRealUnit() || keys.attacker.IsClone() || keys.attacker.IsTempestDouble() || keys.attacker.IsBuilding())) {
                this.GetParentPlus().Kill(undefined, keys.attacker);
                this.Destroy();
            } else {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - 1);
                if (this.GetParentPlus().GetHealth() <= 0) {
                    this.GetParentPlus().Kill(undefined, keys.attacker);
                    this.Destroy();
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (this.aggro_target && keys.unit == this.aggro_target /**&& !keys.reincarnate*/) {
            this.GetParentPlus().ForceKill(false);
        }
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_modifier_no_home extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/econ/items/spirit_breaker/spirit_breaker_iron_surge/status_effect_iron_surge.vpcf";
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_deathlust extends BaseModifier_Plus {
    public bonus_move_speed: number;
    public bonus_attack_speed: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_move_speed = this.GetSpecialValueFor("bonus_move_speed");
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_move_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_deathstrike extends BaseModifier_Plus {
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
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus() && keys.attacker == this.GetParentPlus() && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != keys.attacker.GetTeamNumber() && !keys.target.GetUnitName().includes("visage_familiar")) {
            keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter", {});
            let deathstrike_modifier = keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_undying_tombstone_zombie_deathstrike_slow", {
                duration: this.GetSpecialValueFor("duration")
            });
            if (deathstrike_modifier) {
                deathstrike_modifier.SetDuration(this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance()), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter extends BaseModifier_Plus {
    public slow: any;
    Init(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.slow = this.GetSpecialValueFor("slow");
    }

    OnStackCountChanged(stackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() <= 0) {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_undying_tombstone_zombie_deathstrike_slow extends BaseModifier_Plus {
    public health_threshold_pct: number;
    public duration: number;
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.health_threshold_pct = this.GetSpecialValueFor("health_threshold_pct");
        this.duration = this.GetSpecialValueFor("duration");
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter>("modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter").IncrementStackCount();
        }
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().GetHealthPercent() <= this.health_threshold_pct) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_undying_tombstone_zombie_deathlust", {
                duration: this.duration
            });
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter>("modifier_imba_undying_tombstone_zombie_deathstrike_slow_counter").DecrementStackCount();
        }
    }
}
@registerAbility()
export class imba_undying_tombstone_zombie_deathstrike extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_undying_tombstone_zombie_deathstrike";
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
            if (target.GetUnitName().includes("undying_tombstone")) {
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
        if (this.GetAbilityPlus() && this.GetParentPlus().IsIllusion() && this.GetParentPlus().GetPlayerOwner().GetAssignedHero().HasModifier("modifier_imba_undying_flesh_golem")) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetPlayerOwner().GetAssignedHero(), this.GetAbilityPlus(), "modifier_imba_undying_flesh_golem", {
                duration: this.GetSpecialValueFor("duration")
            });
            if (this.GetParentPlus().HasAbility("imba_undying_flesh_golem_grab")) {
                this.GetParentPlus().findAbliityPlus<imba_undying_flesh_golem_grab>("imba_undying_flesh_golem_grab").SetActivated(true);
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
        this.StartIntervalThink(FrameTime());
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
            5: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
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
        if (keys.unit == this.GetParentPlus()/** && !keys.reincarnate */) {
            this.GetCasterPlus().EmitSound("Hero_Undying.SoulRip.Ally");
            let heal_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_undying/undying_fg_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(heal_particle, 1, keys.unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", keys.unit.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(heal_particle);
            if (keys.unit.IsRealUnit()) {
                this.GetCasterPlus().ApplyHeal(this.GetCasterPlus().GetMaxHealth() * this.remnants_max_health_heal_pct_hero * 0.01, this.GetAbilityPlus());
            } else {
                this.GetCasterPlus().ApplyHeal(this.GetCasterPlus().GetMaxHealth() * this.remnants_max_health_heal_pct_non_hero * 0.01, this.GetAbilityPlus());
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
    IgnoreTenacity() {
        return true;
    }
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
        if (keys.attacker.GetUnitName().includes("undying_zombie")) {
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
            this.GetParentPlus().findAbliityPlus<imba_undying_tombstone>("imba_undying_tombstone").OnSpellStart(this.GetParentPlus().GetAbsOrigin());
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
