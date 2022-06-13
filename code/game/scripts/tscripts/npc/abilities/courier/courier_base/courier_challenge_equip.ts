
import { GameEnum } from "../../../../GameEnum";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";
import { modifier_tp } from "../../../modifier/modifier_tp";

@registerAbility()
export class courier_challenge_equip extends BaseAbility_Plus {
    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let round = caster.ETRoot.AsPlayer().RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                return UnitFilterResult.UF_SUCCESS;
            } else {
                this.errorStr = "not in battle";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }

    OnSpellStart() {
       
    }
    ProcsMagicStick() {
        return false;
    }

}



