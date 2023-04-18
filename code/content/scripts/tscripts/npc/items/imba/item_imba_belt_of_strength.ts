import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 力量腰带
@registerAbility()
export class item_imba_belt_of_strength extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_belt_of_strength";
    }
}
@registerModifier()
export class modifier_item_imba_belt_of_strength extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE)
    bonus_strength: number;
    public Init(params?: IModifierTable): void {
        this.bonus_strength = this.GetSpecialValueFor("bonus_strength");
    }
}