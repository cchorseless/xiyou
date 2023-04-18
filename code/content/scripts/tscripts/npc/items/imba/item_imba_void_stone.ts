import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 虚无宝石
@registerAbility()
export class item_imba_void_stone extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_void_stone";
    }
}
@registerModifier()
export class modifier_item_imba_void_stone extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    bonus_mana_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_mana_regen = this.GetSpecialValueFor("bonus_mana_regen");

    }
}