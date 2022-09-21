import { ItemEntityRoot } from "../../rules/Components/Item/ItemEntityRoot";
import { ET } from "../../rules/Entity/Entity";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";

export class ActiveRootItem extends BaseItem_Plus {
    ETRoot: ItemEntityRoot = null;
    constructor() {
        super();
        if (IsServer()) {
            ItemEntityRoot.Active(this);
        }
    }
}