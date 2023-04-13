
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 天鹰之戒
@registerAbility()
export class item_imba_ring_of_aquila extends BaseItem_Plus {
    public stack: number;
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().findBuffStack("modifier_item_imba_ring_of_aquila", this.GetCasterPlus()) == 1) {
            return "item_ring_of_aquila";
        } else {
            return "imba/ring_of_aquila_inactive";
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ring_of_aquila";
    }
    OnToggle(): void {
        let item_modifier = this.GetCasterPlus().findBuff<modifier_item_imba_ring_of_aquila>("modifier_item_imba_ring_of_aquila");
        if (item_modifier) {
            if (this.GetToggleState()) {
                item_modifier.SetStackCount(0);
                this.stack = 0;
            } else {
                item_modifier.SetStackCount(1);
                this.stack = 1;
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_ring_of_aquila extends BaseModifier_Plus {
    public bonus_damage: number;
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public bonus_aspd: number;
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
        if (this.GetItemPlus()) {
            this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
            this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
            this.bonus_agility = this.GetItemPlus().GetSpecialValueFor("bonus_agility");
            this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
            this.bonus_aspd = this.GetItemPlus().GetSpecialValueFor("bonus_aspd");
        } else {
            this.Destroy();
        }
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus<item_imba_ring_of_aquila>().stack) {
            this.SetStackCount(this.GetItemPlus<item_imba_ring_of_aquila>().stack);
        }
        if (this.GetParentPlus().IsIllusion() && this.GetParentPlus().GetPlayerOwner().GetAssignedHero().findBuffStack("modifier_item_imba_ring_of_aquila", this.GetParentPlus().GetPlayerOwner().GetAssignedHero()) == 1) {
            this.SetStackCount(1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_aspd;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_ring_of_aquila_aura_bonus";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        if (this.GetStackCount() == 0 && (hTarget.IsCreep() && !hTarget.IsConsideredHero())) {
            return true;
        }
        return false;
    }
}
@registerModifier()
export class modifier_item_imba_ring_of_aquila_aura_bonus extends BaseModifier_Plus {
    public aura_mana_regen: any;
    public aura_bonus_armor: number;
    public aura_bonus_vision: number;
    GetTexture(): string {
        return "item_ring_of_aquila";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (this.GetItemPlus()) {
            this.aura_mana_regen = this.GetItemPlus().GetSpecialValueFor("aura_mana_regen");
            this.aura_bonus_armor = this.GetItemPlus().GetSpecialValueFor("aura_bonus_armor");
            this.aura_bonus_vision = this.GetItemPlus().GetSpecialValueFor("aura_bonus_vision");
        } else {
            this.aura_mana_regen = 0;
            this.aura_bonus_armor = 0;
            this.aura_bonus_vision = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE)
    CC_GetModifierConstantManaRegenUnique(): number {
        return this.aura_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE)
    CC_GetModifierPhysicalArmorBonusUnique(p_0: ModifierAttackEvent,): number {
        if (!this.GetParentPlus().IsIllusion()) {
            return this.aura_bonus_armor;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        if (!this.GetParentPlus().IsIllusion() && !this.GetParentPlus().HasModifier("modifier_item_imba_aether_specs_aura_bonus")) {
            return this.aura_bonus_vision;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        if (!this.GetParentPlus().IsIllusion() && !this.GetParentPlus().HasModifier("modifier_item_imba_aether_specs_aura_bonus")) {
            return this.aura_bonus_vision;
        }
    }
}
