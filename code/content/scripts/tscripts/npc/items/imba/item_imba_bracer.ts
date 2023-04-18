import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 护腕
@registerAbility()
export class item_imba_bracer extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_bracer";
    }
}
@registerModifier()
export class modifier_item_imba_bracer extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    bonus_intellect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    bonus_strength: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    bonus_agility: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    bonus_damage: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    bonus_health_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect");
        this.bonus_strength = this.GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.bonus_health_regen = this.GetSpecialValueFor("bonus_health_regen");
    }
}