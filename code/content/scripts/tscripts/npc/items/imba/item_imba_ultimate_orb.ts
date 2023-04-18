import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 极限法球
@registerAbility()
export class item_imba_ultimate_orb extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ultimate_orb";
    }
}
@registerModifier()
export class modifier_item_imba_ultimate_orb extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    bonus_all_stats: number;
    public Init(params?: IModifierTable): void {
        this.bonus_all_stats = this.GetSpecialValueFor("bonus_all_stats");

    }
}