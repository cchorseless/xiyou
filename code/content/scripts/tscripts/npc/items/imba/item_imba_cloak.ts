import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 抗魔斗篷
@registerAbility()
export class item_imba_cloak extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_cloak";
    }
}
@registerModifier()
export class modifier_item_imba_cloak extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    bonus_magical_armor: number;
    public Init(params?: IModifierTable): void {
        this.bonus_magical_armor = this.GetSpecialValueFor("bonus_magical_armor");
    }
}