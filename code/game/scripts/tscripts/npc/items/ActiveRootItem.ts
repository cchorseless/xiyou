import { AbilityEntityRoot } from "../../rules/Components/Ability/AbilityEntityRoot";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";

export class ActiveRootItem extends BaseItem_Plus {
    constructor() {
        super();
        if (IsServer()) {
            AbilityEntityRoot.Active(this);
        }
    }
}