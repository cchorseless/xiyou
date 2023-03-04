
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_heart extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_heart";
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().IsRangedAttacker()) {
            return this.GetSpecialValueFor("regen_cooldown_ranged");
        } else {
            return this.GetSpecialValueFor("regen_cooldown_melee");
        }
    }
}
@registerModifier()
export class modifier_item_imba_heart extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of ipairs(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!this.GetItemPlus()) {
            this.StartIntervalThink(-1);
            this.Destroy();
            return undefined;
        }
        if (this.GetItemPlus().GetCooldownTimeRemaining() == 0) {
            this.SetStackCount(1);
        } else {
            this.SetStackCount(0);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of ipairs(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1) {
            if (!this.GetParentPlus().IsIllusion()) {
                return this.GetItemPlus().GetSpecialValueFor("health_regen_pct");
            } else {
                return this.GetItemPlus().GetSpecialValueFor("health_regen_pct") * this.GetItemPlus().GetSpecialValueFor("alive_illusion_pct") / 100;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1 && keys.unit == this.GetParentPlus() && keys.damage > 0 && keys.attacker != keys.unit && (keys.attacker.IsHero() || keys.attacker.IsConsideredHero() /**|| keys.attacker.IsRoshan()*/) && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            if (this.GetParentPlus().IsRangedAttacker()) {
                this.GetItemPlus().StartCooldown(this.GetItemPlus().GetSpecialValueFor("regen_cooldown_ranged") * this.GetParentPlus().GetCooldownReduction());
            } else {
                this.GetItemPlus().StartCooldown(this.GetItemPlus().GetSpecialValueFor("regen_cooldown_melee") * this.GetParentPlus().GetCooldownReduction());
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        if (this.GetItemPlus()) {
            if (this.GetStackCount() == 1) {
                if (this.GetParentPlus().IsIllusion()) {
                    return this.GetItemPlus().GetSpecialValueFor("hp_regen_amp") * this.GetItemPlus().GetSpecialValueFor("alive_illusion_pct") / 100;
                } else {
                    return this.GetItemPlus().GetSpecialValueFor("hp_regen_amp");
                }
            } else {
                return this.GetItemPlus().GetSpecialValueFor("hp_regen_amp_broken");
            }
        }
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("aura_radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_heart_aura_buff";
    }
}
@registerModifier()
export class modifier_item_imba_heart_aura_buff extends BaseModifier_Plus {
    public aura_str: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.aura_str = this.GetItemPlus().GetSpecialValueFor("aura_str");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.aura_str;
    }
}
