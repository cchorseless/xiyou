
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 圆盾
@registerAbility()
export class item_imba_stout_shield extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_stout_shield";
    }
}
@registerModifier()
export class modifier_item_imba_stout_shield extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus() && GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("block_chance"), this)) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.GetItemPlus().GetSpecialValueFor("damage_block_melee");
            } else {
                return this.GetItemPlus().GetSpecialValueFor("damage_block_ranged");
            }
        }
    }
}

