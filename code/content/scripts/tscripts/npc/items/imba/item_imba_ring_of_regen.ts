import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 回复戒指
@registerAbility()
export class item_imba_ring_of_regen extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ring_of_regen";
    }
}
@registerModifier()
export class modifier_item_imba_ring_of_regen extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    bonus_health_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_health_regen = this.GetSpecialValueFor("bonus_health_regen");
    }
}