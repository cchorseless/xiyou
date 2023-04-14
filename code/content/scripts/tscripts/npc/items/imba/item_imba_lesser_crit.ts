
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 水晶剑
@registerAbility()
export class item_imba_lesser_crit extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_lesser_crit";
    }
}
@registerModifier()
export class modifier_item_imba_lesser_crit extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE_UNIQUE)
    CC_GetModifierPreAttack_CriticalStrike(keys: ModifierAttackEvent): number {
        if (this.GetItemPlus() && (keys.target && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) && GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("crit_chance"), this)) {
            return this.GetItemPlus().GetSpecialValueFor("crit_multiplier");
        }
    }
}
