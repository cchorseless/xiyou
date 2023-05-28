import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 振魂石
@registerAbility()
export class item_imba_soul_booster extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_soul_booster";
    }
}

@registerModifier()
export class modifier_item_imba_soul_booster extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    bonus_health: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    bonus_mana: number;
    public Init(params?: IModifierTable): void {
        this.bonus_mana = this.GetSpecialValueFor("bonus_mana");
        this.bonus_health = this.GetSpecialValueFor("bonus_health");

    }


}