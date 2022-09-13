import { AbilityEntityRoot } from "../../rules/Components/Ability/AbilityEntityRoot";
import { CombinationConfig } from "../../rules/System/Combination/CombinationConfig";
import { BaseItem_Plus } from "../entityPlus/BaseItem_Plus";

export class ActiveRootItem extends BaseItem_Plus implements CombinationConfig.I.ICombinationHandler {
    constructor() {
        super();
        if (IsServer()) {
            AbilityEntityRoot.Active(this);
        }
    }
    OnApplyCombinationEffect(str: string): void { }
    OnCancelCombinationEffect(str: string): void { }
}