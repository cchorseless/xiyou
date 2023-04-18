import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 掠夺者之斧
@registerAbility()
export class item_imba_reaver extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_reaver";
    }
}
@registerModifier()
export class modifier_item_imba_reaver extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    bonus_strength: number;
    public Init(params?: IModifierTable): void {
        this.bonus_strength = this.GetSpecialValueFor("bonus_strength");

    }
}