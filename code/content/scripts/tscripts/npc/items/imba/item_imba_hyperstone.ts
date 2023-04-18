import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 振奋宝石
@registerAbility()
export class item_imba_hyperstone extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_hyperstone";
    }
}
@registerModifier()
export class modifier_item_imba_hyperstone extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    bonus_attack_speed: number;
    public Init(params?: IModifierTable): void {
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");

    }
}