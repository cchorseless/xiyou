import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 铁意头盔
@registerAbility()
export class item_imba_helm_of_iron_will extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_helm_of_iron_will";
    }
}
@registerModifier()
export class modifier_item_imba_helm_of_iron_will extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    bonus_armor: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    bonus_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_armor = this.GetSpecialValueFor("bonus_armor");
        this.bonus_regen = this.GetSpecialValueFor("bonus_regen");
    }
}