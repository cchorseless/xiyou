import { EEnum } from "../../../shared/Gen/Types";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

@registerAbility()
export class courier_challenge_gold extends BaseAbility_Plus {
    IsHiddenAbilityCastable() {
        return true;
    }

    GetWoodCost(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeGoldCost;
    }
    GetManaCost() {
        return 0
    }
    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
            let round = playerroot.RoundManagerComp().getCurrentBoardRound();
            if (!round.IsBattle()) {
                this.errorStr = "not in battle stage";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }

    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let configid = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + "_gold";
        return root.RoundManagerComp().getBoardChallengeRound(configid);
    }


    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let round = root.RoundManagerComp().getCurrentBoardRound();
        if (round.IsBattle()) {
            let challengeround = this.GetchallengeRound()
            if (challengeround) {
                challengeround.OnRound_Start();
                root.PlayerDataComp().ModifyGold(-this.GetWoodCost());
                let level = this.GetLevel();
                if (level < this.GetAbilityJinDuMax()) {
                    this.UpgradeAbility(true);
                }
            }
        }
    }
    ProcsMagicStick() {
        return false;
    }
    GetAbilityJinDuInfo(): string {
        return `${0},${this.GetAbilityJinDuMax()},${this.GetLevel()}`
    }
}


@registerAbility()
export class courier_challenge_wood extends courier_challenge_gold {
    GetWoodCost(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeWoodCost;
    }
    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let configid = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + "_wood";
        return root.RoundManagerComp().getBoardChallengeRound(configid);
    }

}


@registerAbility()
export class courier_challenge_equip extends BaseAbility_Plus {
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
                if (playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.Wood, this.GetSoulCrystal())) {
                    return UnitFilterResult.UF_SUCCESS;
                } else {
                    this.errorStr = "cost wood not enough";
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
            } else {
                this.errorStr = "not in battle stage";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetSoulCrystal(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeEquipCost;
    }
    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let configid = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + "_equip";
        return root.RoundManagerComp().getBoardChallengeRound(configid);
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let round = root.RoundManagerComp().getCurrentBoardRound();
        if (round.IsBattle()) {
            let challengeround = this.GetchallengeRound();
            if (challengeround) {
                challengeround.OnRound_Start();
                root.PlayerDataComp().ModifyWood(-this.GetSoulCrystal());
                let level = this.GetLevel();
                if (level < this.GetAbilityJinDuMax()) {
                    this.UpgradeAbility(true);
                }
            }
        }
    }
    ProcsMagicStick() {
        return false;
    }
    GetAbilityJinDuInfo(): string {
        return `${0},${this.GetAbilityJinDuMax()},${this.GetLevel()}`
    }

}

@registerAbility()
export class courier_challenge_artifact extends courier_challenge_equip {
    GetSoulCrystal(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeArtifactCost;
    }

    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let configid = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + "_artifact";
        return root.RoundManagerComp().getBoardChallengeRound(configid);
    }
}