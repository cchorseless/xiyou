
import { DrawConfig } from "../../../shared/DrawConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

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



