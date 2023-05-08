import { ItemEntityRoot } from "../../rules/Components/Item/ItemEntityRoot";
import { ERoundBoard } from "../../rules/Components/Round/ERoundBoard";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";

export class ActiveRootItem extends BaseItem_Plus {
    ETRoot: IItemEntityRoot = null;
    static CreateOneToUnit<T extends typeof BaseItem_Plus>(this: T, hUnit: IBaseNpc_Plus, itemname: string = null): InstanceType<T> {
        let item = hUnit.AddItemOrInGround(itemname);
        if (item && item.IsValidItem()) {
            ItemEntityRoot.Active(item);
        }
        return item as InstanceType<T>;
    }
    OnRound_Battle?(): void;
    OnRound_Prize?(round: ERoundBoard): void;
}
declare global {
    /**
     * @ServerOnly
     */
    var GActiveRootItem: typeof ActiveRootItem;
    type IActiveRootItem = ActiveRootItem;
}
if (_G.GActiveRootItem == undefined) {
    _G.GActiveRootItem = ActiveRootItem;
}