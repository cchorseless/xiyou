import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 速度之靴
@registerAbility()
export class item_imba_boots extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_boots";
    }
}
@registerModifier()
export class modifier_item_imba_boots extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    bonus_movement_speed: number;
    public Init(params?: IModifierTable): void {
        this.bonus_movement_speed = this.GetSpecialValueFor("bonus_movement_speed");
    }
}