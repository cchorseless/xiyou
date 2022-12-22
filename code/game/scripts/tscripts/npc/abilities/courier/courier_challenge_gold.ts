import { serializeDomainProps } from "../../../rules/Entity/Entity";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../ActiveRootAbility";
import { EEnum } from "../../../shared/Gen/Types";

@registerAbility()
export class courier_challenge_gold extends ActiveRootAbility implements IAbilityChallenge {


    @serializeDomainProps()
    costType: number = EEnum.EMoneyType.Gold;
    @serializeDomainProps()
    costCount: number = 0;
    updateNetTable() {
        this.costCount = this.GetLevel() * 100;
        this.ETRoot.SyncClientEntity(this.ETRoot, true);
    }

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

    OnSpellStart() {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let root = caster.ETRoot.AsHero().GetPlayer();
            let round = root.RoundManagerComp().getCurrentBoardRound();
            if (round.IsBattle()) {
                let configid = GGameStateSystem.GetInstance().getDifficultyChapterDes() + "_gold";
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
