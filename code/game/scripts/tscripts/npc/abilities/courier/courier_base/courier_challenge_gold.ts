import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { KVHelper } from "../../../../helper/KVHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { NetTablesHelper } from "../../../../helper/NetTablesHelper";
import { TimerHelper } from "../../../../helper/TimerHelper";
import { AbilityEntityRoot } from "../../../../rules/Components/Ability/AbilityEntityRoot";
import { serializeDomainProps } from "../../../../rules/Entity/Entity";
import { DifficultyState } from "../../../../rules/System/Difficulty/DifficultyState";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";

@registerAbility()
export class courier_challenge_gold extends BaseAbility_Plus {
    Init() {
        if (IsServer()) {
            AbilityEntityRoot.Active(this);
        }
    }

    @serializeDomainProps()
    costType: number = GameEnum.Item.EItemIndex.Gold;
    @serializeDomainProps()
    costCount: number = 0;
    updateNetTable() {
        this.costCount = this.GetLevel() * 100;
        NetTablesHelper.SetETEntity(this.ETRoot, true, this.GetOwnerPlus().GetPlayerOwnerID());
    }

    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerroot = caster.ETRoot.AsPlayer();
            let round = playerroot.RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                if (playerroot.PlayerDataComp().isEnoughItem(this.costType, this.costCount)) {
                    return UnitFilterResult.UF_SUCCESS;
                } else {
                    this.errorStr = "cost not enough";
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
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
                    root.PlayerDataComp().changeItem(this.costType, -this.costCount);
                    root.PlayerDataComp().updateNetTable();
                    let level = this.GetLevel();
                    if (level < this.GetMaxLevel()) {
                        this.SetLevel(level + 1);
                    }
                    this.updateNetTable();
                }
            }
        }
    }
    ProcsMagicStick() {
        return false;
    }
    public OnUpgrade(): void {
        super.OnUpgrade();
        this.updateNetTable();
    }
}
