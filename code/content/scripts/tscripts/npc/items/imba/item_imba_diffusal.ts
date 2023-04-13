
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 净魂之刃
@registerAbility()
export class item_imba_diffusal_blade extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_diffusal";
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        this.GetCasterPlus().EmitSound("DOTA_Item.DiffusalBlade.Activate");
        target.EmitSound("DOTA_Item.DiffusalBlade.Target");
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let particle_target_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(particle_target_fx);
        target.Purge(true, false, false, false, false);
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_diffusal_blade_slow", {
            duration: this.GetSpecialValueFor("purge_slow_duration") * (1 - target.GetStatusResistance())
        });
        if (!target.IsRealUnit() && !target.IsRoshan() && !target.IsConsideredHero()) {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_rooted", {
                duration: this.GetSpecialValueFor("purge_root_duration") * (1 - target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_diffusal extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (this.GetItemPlus() && keys.attacker == this.GetParentPlus() && keys.attacker.FindAllModifiersByName(this.GetName())[0] == this && !keys.attacker.HasModifier("modifier_item_imba_diffusal_2") && !keys.attacker.HasModifier("modifier_item_imba_witchblade") && keys.attacker.GetTeamNumber() != keys.target.GetTeamNumber() && (keys.target.GetMaxMana && keys.target.GetMaxMana() > 0) && !keys.target.IsMagicImmune()) {
            let particle_manaburn_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.target);
            ParticleManager.ReleaseParticleIndex(particle_manaburn_fx);
            let mana_burn = undefined;
            if (keys.attacker.IsIllusion()) {
                if (keys.attacker.IsRangedAttacker()) {
                    mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn_illusion_ranged");
                } else {
                    mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn_illusion_melee");
                }
            } else {
                mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn");
            }
            if (keys.attacker.HasAbility("imba_antimage_mana_break")) {
                mana_burn = math.max(mana_burn - keys.attacker.findAbliityPlus("imba_antimage_mana_break").GetSpecialValueFor("base_mana_burn"), 0);
            }
            let target_mana = keys.target.GetMana();
            keys.target.ReduceMana(mana_burn);
            return math.min(target_mana, mana_burn) * this.GetItemPlus().GetSpecialValueFor("damage_per_burn");
        }
    }
}
@registerModifier()
export class modifier_item_imba_diffusal_blade_slow extends BaseModifier_Plus {
    public purge_slow_duration: number;
    public purge_rate: any;
    public movement_speed_slow: number;
    public slow_intervals: number;
    GetEffectName(): string {
        return "particles/items_fx/diffusal_slow.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.purge_slow_duration = this.GetItemPlus().GetSpecialValueFor("purge_slow_duration");
        this.purge_rate = this.GetItemPlus().GetSpecialValueFor("purge_rate");
        this.movement_speed_slow = -100;
        this.slow_intervals = (this.movement_speed_slow / this.purge_rate) * (-1);
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.movement_speed_slow);
        this.StartIntervalThink((this.purge_slow_duration * (1 - this.GetParentPlus().GetStatusResistance())) / this.purge_rate);
    }
    BeRefresh(p_0: any,): void {
        this.StartIntervalThink(-1);
        this.BeCreated(null);
    }
    OnIntervalThink(): void {
        this.movement_speed_slow = this.movement_speed_slow + this.slow_intervals;
        this.SetStackCount(this.movement_speed_slow);
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
// 净魂之刃（2级）
@registerAbility()
export class item_imba_diffusal_blade_2 extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_diffusal_2";
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        this.GetCasterPlus().EmitSound("DOTA_Item.DiffusalBlade.Activate");
        target.EmitSound("DOTA_Item.DiffusalBlade.Target");
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let particle_target_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(particle_target_fx);
        let initial_modifiers = target.GetModifierCount();
        target.Purge(true, false, false, false, false);
        this.AddTimer(FrameTime(), () => {
            if (initial_modifiers - target.GetModifierCount() > 0) {
                let mana_burn = (initial_modifiers - target.GetModifierCount()) * this.GetSpecialValueFor("dispel_burn");
                let target_mana = target.GetMana();
                let particle_dispel_fx = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_2_dispel_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.ReleaseParticleIndex(particle_dispel_fx);
                target.ReduceMana(mana_burn);
                ApplyDamage({
                    victim: target,
                    attacker: this.GetCasterPlus(),
                    damage: math.min(mana_burn, target_mana),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
                });
            }
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_diffusal_blade_2_slow", {
                duration: this.GetSpecialValueFor("purge_slow_duration") * (1 - target.GetStatusResistance())
            });
            if (!target.IsRealUnit() && !target.IsRoshan() && !target.IsConsideredHero()) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_rooted", {
                    duration: this.GetSpecialValueFor("purge_root_duration") * (1 - target.GetStatusResistance())
                });
            }
            return;
        });
    }
}
@registerModifier()
export class modifier_item_imba_diffusal_2 extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (this.GetItemPlus() && keys.attacker == this.GetParentPlus() && keys.attacker.FindAllModifiersByName(this.GetName())[0] == this && !keys.attacker.HasModifier("modifier_item_imba_witchblade") && keys.attacker.GetTeamNumber() != keys.target.GetTeamNumber() && (keys.target.GetMaxMana && keys.target.GetMaxMana() > 0) && !keys.target.IsMagicImmune()) {
            let particle_manaburn_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.target);
            ParticleManager.ReleaseParticleIndex(particle_manaburn_fx);
            let mana_burn = undefined;
            if (keys.attacker.IsIllusion()) {
                if (keys.attacker.IsRangedAttacker()) {
                    mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn_illusion_ranged");
                } else {
                    mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn_illusion_melee");
                }
            } else {
                mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn");
            }
            if (keys.attacker.HasAbility("imba_antimage_mana_break")) {
                mana_burn = math.max(mana_burn - keys.attacker.findAbliityPlus("imba_antimage_mana_break").GetSpecialValueFor("base_mana_burn"), 0);
            }
            let target_mana = keys.target.GetMana();
            keys.target.ReduceMana(mana_burn);
            if (GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("dispel_chance_pct"), this)) {
                let purgable_buffs = [] as IBaseModifier_Plus[]
                for (const [_, modifier] of GameFunc.iPair(keys.target.FindAllModifiers() as IBaseModifier_Plus[])) {
                    if (modifier.IsDebuff && modifier.IsPurgable) {
                        if (!modifier.IsDebuff() && modifier.IsPurgable()) {
                            purgable_buffs.push(modifier);
                        }
                    }
                }
                if (GameFunc.GetCount(purgable_buffs) >= 1) {
                    purgable_buffs[RandomInt(1, GameFunc.GetCount(purgable_buffs))].Destroy();
                }
                let particle_dispel_fx = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_2_dispel_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.target);
                ParticleManager.ReleaseParticleIndex(particle_dispel_fx);
                let target_mana = keys.target.GetMana();
                keys.target.ReduceMana(this.GetItemPlus().GetSpecialValueFor("dispel_burn"));
                let damageTable = {
                    victim: keys.target,
                    attacker: keys.attacker,
                    damage: math.min(this.GetItemPlus().GetSpecialValueFor("dispel_burn"), target_mana),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.GetItemPlus(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
                }
                ApplyDamage(damageTable);
            }
            return math.min(target_mana, mana_burn) * this.GetItemPlus().GetSpecialValueFor("damage_per_burn");
        }
    }
}
@registerModifier()
export class modifier_item_imba_diffusal_blade_2_slow extends BaseModifier_Plus {
    public purge_slow_duration: number;
    public purge_rate: any;
    public movement_speed_slow: number;
    public slow_intervals: number;
    GetEffectName(): string {
        return "particles/items_fx/diffusal_slow.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.purge_slow_duration = this.GetItemPlus().GetSpecialValueFor("purge_slow_duration");
        this.purge_rate = this.GetItemPlus().GetSpecialValueFor("purge_rate");
        this.movement_speed_slow = -100;
        this.slow_intervals = (this.movement_speed_slow / this.purge_rate) * (-1);
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.movement_speed_slow);
        this.StartIntervalThink((this.purge_slow_duration * (1 - this.GetParentPlus().GetStatusResistance())) / this.purge_rate);
    }
    BeRefresh(p_0: any,): void {
        this.StartIntervalThink(-1);
        this.BeCreated(null);
    }
    OnIntervalThink(): void {
        this.movement_speed_slow = this.movement_speed_slow + this.slow_intervals;
        this.SetStackCount(this.movement_speed_slow);
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
