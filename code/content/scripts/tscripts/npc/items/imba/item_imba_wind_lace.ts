import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 风灵之纹
@registerAbility()
export class item_imba_wind_lace extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_wind_lace";
    }
}
@registerModifier()
export class modifier_item_imba_wind_lace extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    movement_speed: number;
    public Init(params?: IModifierTable): void {
        this.movement_speed = this.GetSpecialValueFor("movement_speed");
    }
}