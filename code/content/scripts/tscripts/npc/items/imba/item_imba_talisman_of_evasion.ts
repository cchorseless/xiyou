import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 闪避护符
@registerAbility()
export class item_imba_talisman_of_evasion extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_talisman_of_evasion";
    }
}
@registerModifier()
export class modifier_item_imba_talisman_of_evasion extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    bonus_evasion: number;
    public Init(params?: IModifierTable): void {
        this.bonus_evasion = this.GetSpecialValueFor("bonus_evasion");

    }
}