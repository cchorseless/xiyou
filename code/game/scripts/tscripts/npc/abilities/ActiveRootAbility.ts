import { AbilityEntityRoot } from "../../rules/Components/Ability/AbilityEntityRoot";
import { CombinationConfig } from "../../rules/System/Combination/CombinationConfig";
import { BaseAbility_Plus } from "../entityPlus/BaseAbility_Plus";

export class ActiveRootAbility extends BaseAbility_Plus implements CombinationConfig.I.ICombinationHandler {
    constructor() {
        super();
        if (IsServer()) {
            AbilityEntityRoot.Active(this);
        }
    }
    OnApplyCombinationEffect(str: string): void { }
    OnCancelCombinationEffect(str: string): void { }
}