import { AbilityEntityRoot } from "../../rules/Components/Ability/AbilityEntityRoot";
import { ERoundBoard } from "../../rules/Components/Round/ERoundBoard";
import { BaseAbility_Plus } from "../entityPlus/BaseAbility_Plus";
@GReloadable
export class ActiveRootAbility extends BaseAbility_Plus {
    ETRoot: IAbilityEntityRoot = null;
    constructor() {
        super();
        AbilityEntityRoot.TryToActive(this);
    }
    IsOwnersManaEnough() {
        return super.IsOwnersManaEnough() && this.ETRoot.isManaEnoughForActive();
    }
    // 技能战吼
    OnRoundStartBattle() {
        this.ETRoot.OnRoundStartBattle();
    }

    OnRoundStartPrize?(round: ERoundBoard): void;
}

