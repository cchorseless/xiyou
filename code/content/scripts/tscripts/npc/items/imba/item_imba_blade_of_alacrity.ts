import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 欢欣之刃
@registerAbility()
export class item_imba_blade_of_alacrity extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_blade_of_alacrity";
    }
}
@registerModifier()
export class modifier_item_imba_blade_of_alacrity extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    bonus_agility: number;
    public Init(params?: IModifierTable): void {
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
    }
}