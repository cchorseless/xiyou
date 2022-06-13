import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { KVHelper } from "../../../../helper/KVHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { DifficultyState } from "../../../../rules/System/Difficulty/DifficultyState";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";

@registerAbility()
export class courier_challenge_gold extends BaseAbility_Plus {
    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let round = caster.ETRoot.AsPlayer().RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                return UnitFilterResult.UF_SUCCESS;
            } else {
                this.errorStr = "not in battle stage";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let root = caster.ETRoot.AsPlayer();
            let round = root.RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                let configid = DifficultyState.DifficultyChapter + "_gold";
                let challengeround = root.RoundManagerComp().getBoardChallengeRound(configid);
                if (challengeround) {
                    challengeround.OnStart();
                }
            }
        }
    }
    ProcsMagicStick() {
        return false;
    }
}
