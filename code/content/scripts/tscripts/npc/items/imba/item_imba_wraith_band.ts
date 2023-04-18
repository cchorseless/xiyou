import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 怨灵系带
@registerAbility()
export class item_imba_wraith_band extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_wraith_band";
    }
}
@registerModifier()
export class modifier_item_imba_wraith_band extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    bonus_intellect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    bonus_strength: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    bonus_agility: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    bonus_attack_speed: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    bonus_armor: number;
    public Init(params?: IModifierTable): void {
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect");
        this.bonus_strength = this.GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");
        this.bonus_armor = this.GetSpecialValueFor("bonus_armor");
    }
}