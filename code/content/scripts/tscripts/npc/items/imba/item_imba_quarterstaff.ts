import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 短棍
@registerAbility()
export class item_imba_quarterstaff extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_quarterstaff";
    }
}
@registerModifier()
export class modifier_item_imba_quarterstaff extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    bonus_speed: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    bonus_damage: number;
    public Init(params?: IModifierTable): void {
        this.bonus_speed = this.GetSpecialValueFor("bonus_speed");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
    }
}