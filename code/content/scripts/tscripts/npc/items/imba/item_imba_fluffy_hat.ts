import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 毛毛帽
@registerAbility()
export class item_imba_fluffy_hat extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_fluffy_hat";
    }
}
@registerModifier()
export class modifier_item_imba_fluffy_hat extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    bonus_health: number;
    public Init(params?: IModifierTable): void {
        this.bonus_health = this.GetSpecialValueFor("bonus_health");
    }
}