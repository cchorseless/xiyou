
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 自定义
@registerAbility()
export class item_imba_origin_treads extends BaseItem_Plus {
    public type: any;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_origin_treads";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_SUCCESS;
        } else if (this.GetCasterPlus().findBuffStack("modifier_item_imba_origin_treads", this.GetCasterPlus()) == 3 && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
        return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
    }
    GetAbilityTextureName(): string {
        let origin_modifier_stack_count = this.GetCasterPlus().findBuffStack("modifier_item_imba_origin_treads", this.GetCasterPlus());
        if (origin_modifier_stack_count) {
            if (origin_modifier_stack_count <= 1) {
                return "imba/origin_treads_str";
            } else if (origin_modifier_stack_count == 2) {
                return "imba/origin_treads_agi";
            } else if (origin_modifier_stack_count == 3) {
                return "imba/origin_treads_int";
            } else {
                return "imba/origin_treads_str";
            }
        }
        return "imba/origin_treads_str";
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let debuff_duration = this.GetSpecialValueFor("debuff_duration");
        if (target == this.GetCasterPlus()) {
            this.RefundManaCost();
            this.EndCooldown();
            let origin_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_item_imba_origin_treads", this.GetCasterPlus());
            if (origin_modifier) {
                if (origin_modifier.GetStackCount() == 3) {
                    origin_modifier.SetStackCount(1);
                } else {
                    origin_modifier.IncrementStackCount();
                }
            }
            // target.CalculateStatBonus(true);
        } else {
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
            let origin_modifier_stack_count = this.GetCasterPlus().findBuffStack("modifier_item_imba_origin_treads", this.GetCasterPlus());
            let actual_debuff_duration;
            if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                actual_debuff_duration = debuff_duration * (1 - target.GetStatusResistance());
            } else {
                actual_debuff_duration = debuff_duration;
            }
            target.EmitSound("Origin.Cast");
            let particle = ResHelper.CreateParticleEx("particles/item/origin/origin_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControl(particle, 1, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle, 2, target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle);
            let active_modifier;
            if (origin_modifier_stack_count) {
                if (origin_modifier_stack_count <= 1) {
                    active_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_origin_treads_health", {
                        duration: actual_debuff_duration
                    });
                } else if (origin_modifier_stack_count == 2) {
                    active_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_origin_treads_power", {
                        duration: actual_debuff_duration
                    });
                } else if (origin_modifier_stack_count == 3) {
                    active_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_origin_treads_chaos", {
                        duration: actual_debuff_duration
                    });
                } else {
                    active_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_origin_treads_health", {
                        duration: actual_debuff_duration
                    });
                }
            }
        }
        this.type = this.GetCasterPlus().findBuffStack("modifier_item_imba_origin_treads", this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_item_imba_origin_treads extends BaseModifier_Plus {
    public ability: item_imba_origin_treads;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public all_stats: any;
    public stat_bonus_state: number;
    public bonus_movement_speed: number;
    public bonus_attack_speed: number;
    public bonus_health: number;
    public bonus_mana: number;
    public str_hp_regen: any;
    public str_hp_regen_amp_pct: number;
    public agi_damage_bonus: number;
    public agi_armor_ignore_chance_pct: number;
    public int_cast_range: number;
    public int_magical_damage_return_pct: number;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.all_stats = this.ability.GetSpecialValueFor("all_stats");
        this.stat_bonus_state = this.ability.GetSpecialValueFor("stat_bonus_state");
        this.bonus_movement_speed = this.ability.GetSpecialValueFor("bonus_movement_speed");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
        this.bonus_health = this.ability.GetSpecialValueFor("bonus_health");
        this.bonus_mana = this.ability.GetSpecialValueFor("bonus_mana");
        this.str_hp_regen = this.ability.GetSpecialValueFor("str_hp_regen");
        this.str_hp_regen_amp_pct = this.ability.GetSpecialValueFor("str_hp_regen_amp_pct");
        this.agi_damage_bonus = this.ability.GetSpecialValueFor("agi_damage_bonus");
        this.agi_armor_ignore_chance_pct = this.ability.GetSpecialValueFor("agi_armor_ignore_chance_pct");
        this.int_cast_range = this.ability.GetSpecialValueFor("int_cast_range");
        this.int_magical_damage_return_pct = this.ability.GetSpecialValueFor("int_magical_damage_return_pct");
        if (!IsServer()) {
            return;
        }
        if (this.ability.type) {
            this.SetStackCount(this.ability.type);
        } else {
            this.SetStackCount(1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            7: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            8: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            9: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            10: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            11: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL,
            12: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS,
            13: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetStackCount() == 1) {
            return this.all_stats + this.stat_bonus_state;
        } else {
            return this.all_stats;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetStackCount() == 2) {
            return this.all_stats + this.stat_bonus_state;
        } else {
            return this.all_stats;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetStackCount() == 3) {
            return this.all_stats + this.stat_bonus_state;
        } else {
            return this.all_stats;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.bonus_health;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        return this.bonus_movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetStackCount() == 1) {
            return this.str_hp_regen;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        if (this.GetStackCount() == 1) {
            return this.str_hp_regen_amp_pct;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetStackCount() == 2) {
            return this.agi_damage_bonus;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (keys.attacker == this.parent && keys.target.GetTeamNumber() != this.parent.GetTeamNumber() && this.GetStackCount() == 2 && GFuncRandom.PRD(this.agi_armor_ignore_chance_pct, this)) {
            // let damage = CalculateDamageIgnoringArmor(keys.target.GetPhysicalArmorBaseValue(), keys.damage);
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, keys.target, keys.damage, undefined);
            return keys.damage;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        if (this.GetStackCount() == 3) {
            return this.int_cast_range;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (this.GetStackCount() == 3 && keys.unit == this.parent && keys.unit != keys.attacker && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
                let damageTable = {
                    victim: keys.attacker,
                    damage: keys.original_damage * (this.int_magical_damage_return_pct * 0.01),
                    damage_type: keys.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                    attacker: this.caster,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_origin_treads_health extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public debuff_duration: number;
    public str_cast_static_damage: number;
    public str_cast_current_hp_pct_dmg: number;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items4_fx/spirit_vessel_damage.vpcf";
    }
    GetTexture(): string {
        return "origin_treads_str";
    }
    Init(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.debuff_duration = this.ability.GetSpecialValueFor("debuff_duration");
        this.str_cast_static_damage = this.ability.GetSpecialValueFor("str_cast_static_damage");
        this.str_cast_current_hp_pct_dmg = this.ability.GetSpecialValueFor("str_cast_current_hp_pct_dmg");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(1 * (1 - this.GetParentPlus().GetStatusResistance()));
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        ApplyDamage({
            victim: this.parent,
            damage: this.str_cast_static_damage + (this.parent.GetHealth() * (this.str_cast_current_hp_pct_dmg / 100)),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.caster,
            ability: this.ability
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(keys?: any /** keys */): number {
        if (keys.fail_type == 0) {
            return this.str_cast_static_damage;
        } else if (keys.fail_type == 1) {
            return this.str_cast_current_hp_pct_dmg;
        }
    }
}
@registerModifier()
export class modifier_item_imba_origin_treads_power extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public agi_cast_stat_reduction_pct: number;
    public agi_cast_damage_reduction_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items4_fx/nullifier_slow.vpcf";
    }
    GetTexture(): string {
        return "origin_treads_agi";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.agi_cast_stat_reduction_pct = this.ability.GetSpecialValueFor("agi_cast_stat_reduction_pct");
        this.agi_cast_damage_reduction_pct = this.ability.GetSpecialValueFor("agi_cast_damage_reduction_pct");
        if (!IsServer()) {
            return;
        }
        if (this.parent.GetPrimaryStatValue) {
            this.SetStackCount(math.max(this.parent.GetPrimaryStatValue() * this.agi_cast_stat_reduction_pct * 0.01, 0));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.agi_cast_damage_reduction_pct * (-1);
    }
}
@registerModifier()
export class modifier_item_imba_origin_treads_chaos extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public int_cast_dmg_spread_radius: number;
    public int_cast_dmg_spread_pct: number;
    public int_cast_ally_dmg_rdction_pct: number;
    public int_cast_magic_damage_inc_pct: number;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/econ/items/silencer/silencer_ti6/silencer_last_word_status_ti6.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_blademail.vpcf";
    }
    GetTexture(): string {
        return "origin_treads_int";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.int_cast_dmg_spread_radius = this.ability.GetSpecialValueFor("int_cast_dmg_spread_radius");
        this.int_cast_dmg_spread_pct = this.ability.GetSpecialValueFor("int_cast_dmg_spread_pct");
        this.int_cast_ally_dmg_rdction_pct = this.ability.GetSpecialValueFor("int_cast_ally_dmg_rdction_pct");
        this.int_cast_magic_damage_inc_pct = this.ability.GetSpecialValueFor("int_cast_magic_damage_inc_pct");
        if (this.parent.GetTeamNumber() == this.caster.GetTeamNumber()) {
            this.int_cast_dmg_spread_pct = this.int_cast_dmg_spread_pct * this.int_cast_ally_dmg_rdction_pct * 0.01;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.parent && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            let particle = ResHelper.CreateParticleEx("particles/item/origin/origin_chaos_splash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
            ParticleManager.ReleaseParticleIndex(particle);
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.int_cast_dmg_spread_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != this.parent) {
                    let damageTable = {
                        victim: enemy,
                        damage: keys.original_damage * (this.int_cast_dmg_spread_pct * 0.01),
                        damage_type: keys.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                        attacker: this.caster,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(keys?: any /** keys */): number {
        if (keys.fail_type == 0) {
            return this.int_cast_dmg_spread_pct;
        } else if (keys.fail_type == 1) {
            return this.int_cast_dmg_spread_radius;
        } else if (keys.fail_type == 2) {
            return this.int_cast_magic_damage_inc_pct;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
            return this.int_cast_magic_damage_inc_pct;
        }
        return 0;
    }
}
