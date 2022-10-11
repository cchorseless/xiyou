import { ItemEntityRoot } from "../../rules/Components/Item/ItemEntityRoot";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../entityPlus/BaseNpc_Plus";

export class ActiveRootItem extends BaseItem_Plus {
    ETRoot: ItemEntityRoot = null;
    static CreateOneToUnit<T extends typeof BaseItem_Plus>(this: T, hUnit: BaseNpc_Plus, itemname: string = null): InstanceType<T> {
        let item = BaseItem_Plus.CreateOneToUnit(hUnit, itemname);
        ItemEntityRoot.Active(item);
        return item as InstanceType<T>; 
    }
}