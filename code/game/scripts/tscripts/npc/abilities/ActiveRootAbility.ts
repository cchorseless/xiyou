import { AbilityEntityRoot } from "../../rules/Components/Ability/AbilityEntityRoot";
import { BaseAbility_Plus } from "../entityPlus/BaseAbility_Plus";

export class ActiveRootAbility extends BaseAbility_Plus {
    ETRoot: AbilityEntityRoot = null;
    constructor() {
        super();
        if (IsServer()) {
            AbilityEntityRoot.Active(this);
        }
    }

    IsOwnersManaEnough() {
        return super.IsOwnersManaEnough() && this.ETRoot.isManaEnoughForActive();
    }
}