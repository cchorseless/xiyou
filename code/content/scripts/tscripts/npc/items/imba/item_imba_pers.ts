import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 坚韧球
@registerAbility()
export class item_imba_pers extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_pers";
    }
}
@registerModifier()
export class modifier_item_imba_pers extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    bonus_health_regen: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    bonus_mana_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_health_regen = this.GetSpecialValueFor("bonus_health_regen");
        this.bonus_mana_regen = this.GetSpecialValueFor("bonus_mana_regen");

    }
}