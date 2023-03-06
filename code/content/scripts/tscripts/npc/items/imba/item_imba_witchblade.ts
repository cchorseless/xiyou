
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_witchblade extends BaseItem_Plus {
    public bonus_agility: number;
    public bonus_intellect: number;
    public feedback_mana_burn: any;
    public feedback_mana_burn_illusion_melee: any;
    public feedback_mana_burn_illusion_ranged: number;
    public purge_rate: any;
    public purge_root_duration: number;
    public purge_slow_duration: number;
    public damage_per_burn: number;
    public cast_range_tooltip: number;
    public combust_mana_loss: any;
    public severance_chance: number;
    public bypass: any;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_witchblade";
    }
    GetCooldown(level: number): number {
        if (this.bypass) {
            return super.GetCooldown(level) * this.GetSpecialValueFor("bypass_cd_mult");
        } else {
            return super.GetCooldown(level);
        }
    }
    OnSpellStart(): void {
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect");
        this.feedback_mana_burn = this.GetSpecialValueFor("feedback_mana_burn");
        this.feedback_mana_burn_illusion_melee = this.GetSpecialValueFor("feedback_mana_burn_illusion_melee");
        this.feedback_mana_burn_illusion_ranged = this.GetSpecialValueFor("feedback_mana_burn_illusion_ranged");
        this.purge_rate = this.GetSpecialValueFor("purge_rate");
        this.purge_root_duration = this.GetSpecialValueFor("purge_root_duration");
        this.purge_slow_duration = this.GetSpecialValueFor("purge_slow_duration");
        this.damage_per_burn = this.GetSpecialValueFor("damage_per_burn");
        this.cast_range_tooltip = this.GetSpecialValueFor("cast_range_tooltip");
        this.combust_mana_loss = this.GetSpecialValueFor("combust_mana_loss");
        this.severance_chance = this.GetSpecialValueFor("severance_chance");
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        this.GetCasterPlus().EmitSound("DOTA_Item.DiffusalBlade.Activate");
        target.EmitSound("DOTA_Item.DiffusalBlade.Target");
        let particle = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_manaburn_3.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(particle, 0, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle);
        let initial_modifiers = target.GetModifierCount();
        target.Purge(true, false, false, false, false);
        this.AddTimer(FrameTime(), () => {
            let modifiers_lost = initial_modifiers - target.GetModifierCount();
            if (modifiers_lost > 0) {
                let mana_burn = modifiers_lost * this.combust_mana_loss;
                let target_mana = target.GetMana();
                target.ReduceMana(mana_burn);
                let damage;
                if (target_mana >= mana_burn) {
                    damage = mana_burn;
                } else {
                    damage = target_mana;
                }
                let damageTable = {
                    victim: target,
                    attacker: this.GetCasterPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this,
                    damage_flags: (DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL)
                }
                ApplyDamage(damageTable);
                let particle = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_3_dispel_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControl(particle, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle);
            }
        });
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_witchblade_slow", {
            duration: this.purge_slow_duration * (1 - target.GetStatusResistance())
        });
        if (!target.IsRealUnit() && !target.IsRoshan() && !target.IsConsideredHero()) {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_rooted", {
                duration: this.GetSpecialValueFor("purge_root_duration") * (1 - target.GetStatusResistance())
            });
        }
        if (target.IsMagicImmune() || target.IsBuilding()) {
            this.EndCooldown();
            this.bypass = true;
            this.UseResources(false, false, true);
            this.bypass = false;
        }
    }
}
@registerModifier()
export class modifier_item_imba_witchblade_slow extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public bonus_agility: number;
    public bonus_intellect: number;
    public feedback_mana_burn: any;
    public feedback_mana_burn_illusion_melee: any;
    public feedback_mana_burn_illusion_ranged: number;
    public purge_rate: any;
    public purge_root_duration: number;
    public purge_slow_duration: number;
    public damage_per_burn: number;
    public cast_range_tooltip: number;
    public combust_mana_loss: any;
    public severance_chance: number;
    public initial_slow: any;
    public slow_intervals: number;
    GetEffectName(): string {
        return "particles/items_fx/diffusal_slow.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        if (!this.ability) {
            return;
        }
        this.bonus_agility = this.ability.GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.ability.GetSpecialValueFor("bonus_intellect");
        this.feedback_mana_burn = this.ability.GetSpecialValueFor("feedback_mana_burn");
        this.feedback_mana_burn_illusion_melee = this.ability.GetSpecialValueFor("feedback_mana_burn_illusion_melee");
        this.feedback_mana_burn_illusion_ranged = this.ability.GetSpecialValueFor("feedback_mana_burn_illusion_ranged");
        this.purge_rate = this.ability.GetSpecialValueFor("purge_rate");
        this.purge_root_duration = this.ability.GetSpecialValueFor("purge_root_duration");
        this.purge_slow_duration = this.ability.GetSpecialValueFor("purge_slow_duration");
        this.damage_per_burn = this.ability.GetSpecialValueFor("damage_per_burn");
        this.cast_range_tooltip = this.ability.GetSpecialValueFor("cast_range_tooltip");
        this.combust_mana_loss = this.ability.GetSpecialValueFor("combust_mana_loss");
        this.severance_chance = this.ability.GetSpecialValueFor("severance_chance");
        this.initial_slow = -100;
        this.slow_intervals = this.initial_slow / this.purge_rate;
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.initial_slow);
        this.StartIntervalThink((this.purge_slow_duration / this.purge_rate) * (1 - this.GetParentPlus().GetStatusResistance()));
    }
    BeRefresh(p_0: any,): void {
        this.StartIntervalThink(-1);
        this.BeCreated(null);
    }
    OnIntervalThink(): void {
        this.SetStackCount(this.GetStackCount() - this.slow_intervals);
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
@registerModifier()
export class modifier_item_imba_witchblade_root extends BaseModifier_Plus {
    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
@registerModifier()
export class modifier_item_imba_witchblade extends BaseModifier_Plus {
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
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
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
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus() && keys.attacker == this.GetCasterPlus() && keys.attacker.GetTeam() != keys.target.GetTeam() && keys.target.GetMaxMana() > 0 && !keys.target.IsMagicImmune() && this.GetCasterPlus().FindAllModifiersByName(this.GetName())[0] == this) {
            let particle = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_manaburn_3.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.target);
            ParticleManager.ReleaseParticleIndex(particle);
            let mana_burn = 0;
            if (keys.attacker.IsIllusion()) {
                if (keys.attacker.IsRangedAttacker()) {
                    mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn_illusion_ranged");
                } else if (!keys.attacker.IsRangedAttacker()) {
                    mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn_illusion_melee");
                }
            } else {
                mana_burn = this.GetItemPlus().GetSpecialValueFor("feedback_mana_burn");
            }
            if (this.GetCasterPlus().HasAbility("imba_antimage_mana_break")) {
                mana_burn = math.max(mana_burn - this.GetCasterPlus().findAbliityPlus("imba_antimage_mana_break").GetSpecialValueFor("base_mana_burn"), 0);
            }
            let target_mana = keys.target.GetMana();
            keys.target.ReduceMana(mana_burn);
            let damage;
            if (target_mana >= mana_burn) {
                damage = mana_burn * this.GetItemPlus().GetSpecialValueFor("damage_per_burn");
            } else {
                damage = target_mana * this.GetItemPlus().GetSpecialValueFor("damage_per_burn");
            }
            return damage;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let target = keys.unit;
        if (this.GetItemPlus() && keys.attacker == this.GetCasterPlus() && keys.attacker.GetTeam() != target.GetTeam() && target.GetMaxMana() > 0 && !target.IsMagicImmune() && this.GetCasterPlus().FindAllModifiersByName(this.GetName())[0] == this && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK && keys.damage > 0) {
            if (GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("severance_chance"), this)) {
                target.EmitSound("DOTA_Item.DiffusalBlade.Target");
                let particle = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_manaburn_3.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControl(particle, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle);
                let initial_modifiers = target.GetModifierCount();
                target.Purge(true, false, false, false, false);
                this.AddTimer(FrameTime(), () => {
                    let modifiers_lost = initial_modifiers - target.GetModifierCount();
                    if (modifiers_lost > 0) {
                        let mana_burn = modifiers_lost * this.GetItemPlus().GetSpecialValueFor("combust_mana_loss");
                        let target_mana = target.GetMana();
                        target.ReduceMana(mana_burn);
                        let damage;
                        if (target_mana >= mana_burn) {
                            damage = mana_burn;
                        } else {
                            damage = target_mana;
                        }
                        let damageTable: ApplyDamageOptions = {
                            victim: target,
                            attacker: this.GetCasterPlus(),
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetItemPlus(),
                            damage_flags: (DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL)
                        }
                        ApplyDamage(damageTable);
                        let particle = ResHelper.CreateParticleEx("particles/item/diffusal/diffusal_3_dispel_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                });
            }
        }
    }
}
