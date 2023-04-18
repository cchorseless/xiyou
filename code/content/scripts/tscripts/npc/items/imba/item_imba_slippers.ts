import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 敏捷便鞋
@registerAbility()
export class item_imba_slippers extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_slippers";
    }
}
@registerModifier()
export class modifier_item_imba_slippers extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    bonus_agility: number;
    public Init(params?: IModifierTable): void {
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
    }
}