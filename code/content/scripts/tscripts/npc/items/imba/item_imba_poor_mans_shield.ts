
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 穷鬼盾
@registerAbility()
export class item_imba_poor_mans_shield extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_poor_mans_shield";
    }
}
@registerModifier()
export class modifier_item_imba_poor_mans_shield_active extends BaseModifier_Plus {
    GetTexture(): string {
        return "modifiers/imba_poor_mans_shield";
    }
}
@registerModifier()
export class modifier_item_imba_poor_mans_shield extends BaseModifier_Plus {
    public bonus_agility: number;
    public damage_block_melee: number;
    public damage_block_ranged: number;
    public block_chance: number;
    public bonus_block_melee: number;
    public bonus_block_range: number;
    public bonus_block_duration: number;
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
                return;
            }
        }
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.damage_block_melee = this.GetSpecialValueFor("damage_block_melee");
        this.damage_block_ranged = this.GetSpecialValueFor("damage_block_ranged");
        this.block_chance = this.GetSpecialValueFor("block_chance");
        this.bonus_block_melee = this.GetSpecialValueFor("bonus_block_melee");
        this.bonus_block_range = this.GetSpecialValueFor("bonus_block_range");
        this.bonus_block_duration = this.GetSpecialValueFor("bonus_block_duration");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(keys: ModifierAttackEvent): number {
        // if (keys.attacker.IsRealUnit() && this.GetItemPlus() && this.GetItemPlus().IsCooldownReady()) {
        //     this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_poor_mans_shield_active", {
        //         duration: this.bonus_block_duration
        //     });
        //     this.GetItemPlus().UseResources(false, false, false, true);
        // }
        if (GFuncRandom.PRD(this.block_chance, this)) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                // return this.damage_block_melee + ((this.GetParentPlus().HasModifier("modifier_item_imba_poor_mans_shield_active") && this.bonus_block_melee) || 0);
                return this.damage_block_melee
            } else {
                // return this.damage_block_ranged + ((this.GetParentPlus().HasModifier("modifier_item_imba_poor_mans_shield_active") && this.bonus_block_range) || 0);
                return this.damage_block_ranged
            }
        }
    }
}
