import { AI_ability } from "../../../ai/AI_ability";
import { ERoundBoard } from "../../../rules/Components/Round/ERoundBoard";
import { EEnum } from "../../../shared/Gen/Types";
import { RoundConfig } from "../../../shared/RoundConfig";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../ActiveRootAbility";

@registerAbility()
export class courier_challenge_gold extends ActiveRootAbility {
    IsHiddenAbilityCastable() {
        return true;
    }

    GetSoulCrystal(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeGoldCost;
    }
    GetManaCost() {
        return 0
    }

    GetCooldown(iLevel: number) {
        return 120;
    }
    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        let level = this.GetLevel();
        if (level >= this.GetAbilityJinDuMax()) {
            this.errorStr = "challenge jindu finish";
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
            if (!playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.SoulCrystal, this.GetSoulCrystal())) {
                this.errorStr = "cost SoulCrystal not enough";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        return root.RoundManagerComp().getBoardChallengeRound(RoundConfig.EERoundType.challenge_gold);
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let round = root.RoundManagerComp().getCurrentBoardRound();
        if (round.IsRoundBattle() || round.IsRoundStart()) {
            let challengeround = this.GetchallengeRound();
            if (challengeround) {
                challengeround.OnRound_Start(this.GetLevel());
                root.PlayerDataComp().ModifySoulCrystal(-this.GetSoulCrystal());
            }
            if (this.GetAutoCastState()) {
                this.ToggleAutoCast();
            }
        }
        else {
            this.ToggleAutoCast();
            this.EndCooldown();
        }
    }
    ProcsMagicStick() {
        return false;
    }
    GetAbilityJinDuInfo(): string {
        return `${0},${this.GetAbilityJinDuMax()},${this.GetLevel()}`
    }

    OnRound_Start(round: ERoundBoard): void {
        if (round.config.roundIndex >= this.GetSpecialValueFor("unlock_round")) {
            if (this.IsActivated() == false) {
                this.SetActivated(true);
            }
            else {
                if (this.GetAutoCastState()) {
                    AI_ability.NO_TARGET_cast(this);
                }
            }
        }
        else if (this.IsActivated()) {
            this.SetActivated(false);
        }
    }

    OnRound_Prize(round: ERoundBoard): void {
        if (this.IsActivated() && round.isWin > 0) {
            let level = this.GetLevel();
            if (level < this.GetAbilityJinDuMax()) {
                this.UpgradeAbility(true);
            }
        }
    }
}


@registerAbility()
export class courier_challenge_wood extends courier_challenge_gold {
    GetSoulCrystal(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeWoodCost;
    }
    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        return root.RoundManagerComp().getBoardChallengeRound(RoundConfig.EERoundType.challenge_wood);
    }

}


@registerAbility()
export class courier_challenge_equip extends ActiveRootAbility {
    IsHiddenAbilityCastable() {
        return true;
    }
    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        let level = this.GetLevel();
        if (level >= this.GetAbilityJinDuMax()) {
            this.errorStr = "challenge jindu finish";
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
            if (!playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.SoulCrystal, this.GetSoulCrystal())) {
                this.errorStr = "cost SoulCrystal not enough";
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
        return root.RoundManagerComp().getBoardChallengeRound(RoundConfig.EERoundType.challenge_equip);
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        let round = root.RoundManagerComp().getCurrentBoardRound();
        if (round.IsRoundBattle() || round.IsRoundStart()) {
            let challengeround = this.GetchallengeRound();
            if (challengeround) {
                challengeround.OnRound_Start(this.GetLevel());
                root.PlayerDataComp().ModifySoulCrystal(-this.GetSoulCrystal());
            }
            if (this.GetAutoCastState()) {
                this.ToggleAutoCast();
            }
        }
        else {
            this.ToggleAutoCast();
            this.EndCooldown();
        }
    }
    ProcsMagicStick() {
        return false;
    }
    GetAbilityJinDuInfo(): string {
        return `${0},${this.GetAbilityJinDuMax()},${this.GetLevel()}`
    }
    GetCooldown(level?: number): number {
        return 240;
    }
    OnRound_Start(round: ERoundBoard): void {
        if (round.config.roundIndex >= this.GetSpecialValueFor("unlock_round")) {
            if (this.IsActivated() == false) {
                this.SetActivated(true);
            }
            else {
                if (this.GetAutoCastState()) {
                    AI_ability.NO_TARGET_cast(this);
                }
            }
        }
        else if (this.IsActivated()) {
            this.SetActivated(false);
        }
    }
    OnRound_Prize(round: ERoundBoard): void {
        if (this.IsActivated() && round.isWin > 0) {
            let level = this.GetLevel();
            if (level < this.GetAbilityJinDuMax()) {
                this.UpgradeAbility(true);
            }
        }
    }
}

@registerAbility()
export class courier_challenge_artifact extends courier_challenge_equip {
    GetSoulCrystal(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(math.max(this.GetLevel(), 1) + "").ChallengeArtifactCost;
    }
    GetCooldown(level?: number): number {
        return 360;
    }
    GetchallengeRound() {
        let caster = this.GetCasterPlus();
        let playerid = caster.GetPlayerID()
        let root = GPlayerEntityRoot.GetOneInstance(playerid);
        return root.RoundManagerComp().getBoardChallengeRound(RoundConfig.EERoundType.challenge_artifact);
    }
}