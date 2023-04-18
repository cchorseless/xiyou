import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 魔力法杖
@registerAbility()
export class item_imba_staff_of_wizardry extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_staff_of_wizardry";
    }
}
@registerModifier()
export class modifier_item_imba_staff_of_wizardry extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    bonus_intellect: number;
    public Init(params?: IModifierTable): void {
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect");
    }
}