import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 治疗指环
@registerAbility()
export class item_imba_ring_of_health extends BaseItem_Plus {

    IsCombinable(): boolean {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ring_of_health";
    }
}
@registerModifier()
export class modifier_item_imba_ring_of_health extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    bonus_health_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_health_regen = this.GetSpecialValueFor("bonus_health_regen");

    }
}