import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { AbilityEntityRoot } from "../../../../rules/Components/Ability/AbilityEntityRoot";
import { serializeDomainProps } from "../../../../rules/Entity/Entity";
import { DifficultyState } from "../../../../rules/System/Difficulty/DifficultyState";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";
import { modifier_task } from "../../../modifier/modifier_task";
import { ActiveRootAbility } from "../../ActiveRootAbility";
import { EEnum } from "../../../../shared/Gen/Types";

/**删除 */
@registerAbility()
export class courier_challenge_wood extends ActiveRootAbility {

    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerroot = caster.ETRoot.AsHero().GetPlayer();
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

    @serializeDomainProps()
    costType: number = EEnum.EMoneyType.Gold;
    @serializeDomainProps()
    costCount: number = 0;
    updateNetTable() {
        this.costCount = this.GetLevel() * 200;
        this.ETRoot.SyncClientEntity(this.ETRoot, true);
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let root = caster.ETRoot.AsHero().GetPlayer();
            let round = root.RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                let configid = DifficultyState.DifficultyChapter + "_wood";
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
