import { ERoundBoard } from "../../../rules/Components/Round/ERoundBoard";
import { DrawConfig } from "../../../shared/DrawConfig";
import { EEnum } from "../../../shared/Gen/Types";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../ActiveRootAbility";

// 初级抽卡
@registerAbility()
export class courier_draw_card_v1 extends ActiveRootAbility {
    public readonly DrawCardType = DrawConfig.EDrawType.DrawCardV1;
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.DrawComp().DrawCard(this.DrawCardType, 4);
        playerroot.PlayerDataComp().ModifyWood(-this.GetWoodCost(this.GetLevel()));
        // playerroot.DrawComp().DrawEnemy(playerroot.RoundManagerComp().getCurrentBoardRound());
        const forward = Vector(0, 1, 0);
        GLogHelper.print("changeToEndBossPos 1", GFuncVector.Rotation2D(forward, 90, true))

    }
    ProcsMagicStick() {
        return false;
    }
    GetManaCost() {
        return 0;
    }
    GetCooldown(iLevel: number) {
        return 0.3
    }
    GetWoodCost(level: number): number {
        return this.GetSpecialValueFor("wood_cost")
    }

    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
            let isEnoughItem = playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.Wood, this.GetWoodCost(this.GetLevel()));
            if (!isEnoughItem) {
                this.errorStr = "wood not enough";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }
}

// 中级抽卡
@registerAbility()
export class courier_draw_card_v2 extends ActiveRootAbility {
    public readonly DrawCardType = DrawConfig.EDrawType.DrawCardV2;


    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.DrawComp().DrawCard(this.DrawCardType, 4);
        playerroot.PlayerDataComp().ModifyWood(-this.GetWoodCost(this.GetLevel()));
    }

    ProcsMagicStick() {
        return false;
    }
    GetManaCost() {
        return 0;
    }
    GetCooldown(iLevel: number) {
        return 0.3
    }
    GetWoodCost(level: number): number {
        return this.GetSpecialValueFor("wood_cost")
    }

    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
            let isEnoughItem = playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.Wood, this.GetWoodCost(this.GetLevel()));
            if (!isEnoughItem) {
                this.errorStr = "wood not enough";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    Init(): void {
        if (IsServer()) {
            this.SetActivated(false);
        }
    }
    OnRound_Start(round: ERoundBoard): void {
        if (round.config.roundIndex >= this.GetSpecialValueFor("unlock_round")) {
            if (this.IsActivated() == false) {
                this.SetActivated(true);
            }
        }
        else if (this.IsActivated()) {
            this.SetActivated(false);
        }
    }
}


// 高级抽卡
@registerAbility()
export class courier_draw_card_v3 extends ActiveRootAbility {
    public readonly DrawCardType = DrawConfig.EDrawType.DrawCardV3;

    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.DrawComp().DrawCard(this.DrawCardType, 4);
        playerroot.PlayerDataComp().ModifyWood(-this.GetWoodCost(this.GetLevel()));
    }
    ProcsMagicStick() {
        return false;
    }
    GetManaCost() {
        return 0;
    }
    GetCooldown(iLevel: number) {
        return 0.3
    }

    GetWoodCost(level: number): number {
        return this.GetSpecialValueFor("wood_cost")
    }

    CastFilterResult(): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let playerid = caster.GetPlayerID()
            let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
            let isEnoughItem = playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.Wood, this.GetWoodCost(this.GetLevel()));
            if (!isEnoughItem) {
                this.errorStr = "wood not enough";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    Init(): void {
        if (IsServer()) {
            this.SetActivated(false);
        }
    }

    OnRound_Start(round: ERoundBoard): void {
        if (round.config.roundIndex >= this.GetSpecialValueFor("unlock_round")) {
            if (this.IsActivated() == false) {
                this.SetActivated(true);
            }
        }
        else if (this.IsActivated()) {
            this.SetActivated(false);
        }
    }
}
