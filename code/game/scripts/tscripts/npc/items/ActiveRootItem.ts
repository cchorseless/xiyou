import { ItemEntityRoot } from "../../rules/Components/Item/ItemEntityRoot";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";

export class ActiveRootItem extends BaseItem_Plus  {
    constructor() {
        super();
        if (IsServer()) {
            ItemEntityRoot.Active(this);
        }
    }
}