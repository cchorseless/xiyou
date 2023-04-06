
import { EEnum } from "../../../shared/Gen/Types";
import { serializeDomainProps } from "../../../shared/lib/Entity";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../ActiveRootAbility";

@registerAbility()
export class courier_challenge_artifact extends ActiveRootAbility implements IAbilityChallenge {
    IsHiddenAbilityCastable() {
        return true;
    }

    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
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
    costType: number = EEnum.EMoneyType.Wood;
    @serializeDomainProps()
    costCount: number = 0;
    updateNetTable() {
        this.costCount = this.GetLevel() * 80;
        this.ETRoot.SyncClient(true);
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let root = GPlayerEntityRoot.GetOneInstance(playerid);
            let round = root.RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                let configid = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + "_artifact";
                let challengeround = root.RoundManagerComp().getBoardChallengeRound(configid);
                if (challengeround) {
                    challengeround.OnRound_Start();
                    root.PlayerDataComp().changeItem(this.costType, -this.costCount);
                    root.PlayerDataComp().SyncClient();
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



