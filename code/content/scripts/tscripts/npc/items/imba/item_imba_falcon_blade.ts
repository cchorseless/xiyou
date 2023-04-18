import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 猎鹰战刃
@registerAbility()
export class item_imba_falcon_blade extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_falcon_blade";
    }
}
@registerModifier()
export class modifier_item_imba_falcon_blade extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    bonus_health: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    bonus_mana_regen: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    bonus_damage: number;
    public Init(params?: IModifierTable): void {
        this.bonus_health = this.GetSpecialValueFor("bonus_health");
        this.bonus_mana_regen = this.GetSpecialValueFor("bonus_mana_regen");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
    }
}