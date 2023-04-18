import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 板甲
@registerAbility()
export class item_imba_platemail extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_platemail";
    }
}
@registerModifier()
export class modifier_item_imba_platemail extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    bonus_armor: number;
    public Init(params?: IModifierTable): void {
        this.bonus_armor = this.GetSpecialValueFor("bonus_armor");

    }
}