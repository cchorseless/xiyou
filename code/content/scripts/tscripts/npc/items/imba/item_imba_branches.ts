
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 铁树枝干
@registerAbility()
export class item_imba_branches extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_branches";
    }


    OnSpellStart(): void {
        let loc = this.GetCursorPosition();
        CreateTempTree(loc, this.GetSpecialValueFor("tree_duration"));
        SafeDestroyItem(this)
    }

}

@registerModifier()
export class modifier_item_imba_branches extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BASE)
    bonus_all_stats: number;
    public Init(params?: IModifierTable): void {
        this.bonus_all_stats = this.GetSpecialValueFor("bonus_all_stats");
    }

}