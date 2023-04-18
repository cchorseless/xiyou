import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 巫毒面具
@registerAbility()
export class item_imba_voodoo_mask extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_voodoo_mask";
    }
}
@registerModifier()
export class modifier_item_imba_voodoo_mask extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
    hero_lifesteal: number;
    public Init(params?: IModifierTable): void {
        this.hero_lifesteal = this.GetSpecialValueFor("hero_lifesteal");
    }
}