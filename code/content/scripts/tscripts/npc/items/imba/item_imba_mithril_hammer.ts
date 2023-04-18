import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 秘银锤
@registerAbility()
export class item_imba_mithril_hammer extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_mithril_hammer";
    }
}
@registerModifier()
export class modifier_item_imba_mithril_hammer extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    bonus_damage: number;
    public Init(params?: IModifierTable): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
    }
}