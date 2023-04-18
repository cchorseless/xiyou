import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 空明杖
@registerAbility()
export class item_imba_oblivion_staff extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_oblivion_staff";
    }
}
@registerModifier()
export class modifier_item_imba_oblivion_staff extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    bonus_intellect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    bonus_mana_regen: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    bonus_damage: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    bonus_attack_speed: number;
    public Init(params?: IModifierTable): void {
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect");
        this.bonus_mana_regen = this.GetSpecialValueFor("bonus_mana_regen");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");

    }
}