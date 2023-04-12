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
    OnRoundStartBattle?(): void;
    OnRoundStartPrize?(round: ERoundBoard): void;
}