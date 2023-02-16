import { ItemEntityRoot } from "../../rules/Components/Item/ItemEntityRoot";
import { ERoundBoard } from "../../rules/Components/Round/ERoundBoard";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";

export class ActiveRootItem extends BaseItem_Plus {

    ETRoot: IItemEntityRoot = null;
    static CreateOneToUnit<T extends typeof BaseItem_Plus>(this: T, hUnit: IBaseNpc_Plus, itemname: string = null): InstanceType<T> {
        let item = BaseItem_Plus.CreateOneOnUnit(hUnit, itemname);
        ItemEntityRoot.Active(item);
        return item as InstanceType<T>;
    }
    static CreateItem<T extends typeof BaseItem_Plus>(this: T, itemname: string): InstanceType<T> {
        let item = BaseItem_Plus.CreateItem(itemname, null, null);
        ItemEntityRoot.Active(item);
        return item as InstanceType<T>;
    }
    OnRoundStartBattle?(): void;
    OnRoundStartPrize?(round: ERoundBoard): void;
}