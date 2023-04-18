import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 空灵挂件
@registerAbility()
export class item_imba_null_talisman extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_null_talisman";
    }
}
@registerModifier()
export class modifier_item_imba_null_talisman extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    bonus_intellect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    bonus_strength: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    bonus_agility: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    bonus_spell_amp: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    bonus_mana_regen: number;
    public Init(params?: IModifierTable): void {
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect");
        this.bonus_strength = this.GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.bonus_spell_amp = this.GetSpecialValueFor("bonus_spell_amp");
        this.bonus_mana_regen = this.GetSpecialValueFor("bonus_mana_regen");
    }
}