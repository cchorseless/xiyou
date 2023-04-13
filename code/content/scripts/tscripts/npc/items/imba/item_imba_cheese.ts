
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
function ConsumeCheese(parent: IBaseNpc_Plus, item: IBaseItem_Plus) {
    parent.EmitSound("DOTA_Item.Cheese.Activate");
    parent.ApplyHeal(parent.GetMaxHealth(), item);
    parent.GiveMana(parent.GetMaxMana());
    item.SetCurrentCharges(item.GetCurrentCharges() - 1);
    if (item.GetCurrentCharges() <= 0) {
        if (!parent.IsClone()) {
            parent.RemoveItem(item);
        } else {
            if (parent.GetCloneSource && parent.GetCloneSource() && parent.GetCloneSource().HasItemInInventory(item.GetAbilityName())) {
                parent.GetCloneSource().RemoveItem(item);
            }
        }
    } else {
        item.UseResources(false, false, true);
    }
}
// 奶酪
@registerAbility()
export class item_imba_cheese extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_cheese_death_prevention";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            ConsumeCheese(this.GetParentPlus(), this);
        }
    }
}
@registerModifier()
export class modifier_item_imba_cheese_death_prevention extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let state = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(state);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit.IsIllusion() || (keys.unit != this.GetParentPlus() && !keys.unit.IsClone())) {
            return;
        }
        if (keys.unit.HasModifier("modifier_imba_dazzle_shallow_grave")) {
            return;
        }
        if (keys.unit.HasModifier("modifier_imba_dazzle_nothl_protection") && !keys.unit.PassivesDisabled()) {
            if (keys.unit.findBuff("modifier_imba_dazzle_nothl_protection").GetStackCount() == 0) {
                return;
            }
        }
        if (keys.damage >= keys.unit.GetHealth() && this.GetItemPlus().IsCooldownReady()) {
            ConsumeCheese(keys.unit, this.GetItemPlus());
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        if (this.GetItemPlus().IsCooldownReady() && this.GetParentPlus().IsRealUnit()) {
            return 1;
        }
        return undefined;
    }
}
