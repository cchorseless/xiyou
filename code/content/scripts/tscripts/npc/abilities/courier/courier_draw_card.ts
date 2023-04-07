import { DrawConfig } from "../../../shared/DrawConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

// 初级抽卡
@registerAbility()
export class courier_draw_card_v1 extends BaseAbility_Plus {
    public readonly DrawCardType = DrawConfig.EDrawCardType.DrawCardV1;
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.DrawComp().DrawCard(this.DrawCardType, 4);
        playerroot.PlayerDataComp().ModifyGold(-this.GetGoldCost(this.GetLevel()));
        // Draw.DrawCard(iPlayerID, this.GetReservoirName(), this.GetSpecialValueFor("draw_count") + PlayerProperty.GetProperty(iPlayerID, PLAYER_PROPERTY_EXTRA_CARD1));
        // this.SpendWood();

    }
    ProcsMagicStick() {
        return false;
    }
    GetManaCost() {
        return 0;
    }
    GetCooldown(iLevel: number) {
        return 0
    }
    GetGoldCost(level: number): number {
        return 10;
    }
}

// 中级抽卡
@registerAbility()
export class courier_draw_card_v2 extends BaseAbility_Plus {
    public readonly DrawCardType = DrawConfig.EDrawCardType.DrawCardV2;


    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.DrawComp().DrawCard(this.DrawCardType, 4);
        playerroot.PlayerDataComp().ModifyGold(-this.GetGoldCost(this.GetLevel()));
    }

    ProcsMagicStick() {
        return false;
    }
    GetManaCost() {
        return 0;
    }
    GetCooldown(iLevel: number) {
        return 0
    }
    GetGoldCost(level: number): number {
        return 20
    }

}


// 高级抽卡
@registerAbility()
export class courier_draw_card_v3 extends BaseAbility_Plus {
    public readonly DrawCardType = DrawConfig.EDrawCardType.DrawCardV3;

    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.DrawComp().DrawCard(this.DrawCardType, 4);
        playerroot.PlayerDataComp().ModifyGold(-this.GetGoldCost(this.GetLevel()));
    }
    ProcsMagicStick() {
        return false;
    }
    GetManaCost() {
        return 0;
    }
    GetCooldown(iLevel: number) {
        return 0
    }

    GetGoldCost(level: number): number {
        return 50
    }
}
