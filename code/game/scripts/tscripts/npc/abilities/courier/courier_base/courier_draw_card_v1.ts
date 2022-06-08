import { GameEnum } from "../../../../GameEnum";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { DrawConfig } from "../../../../rules/System/Draw/DrawConfig";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

// 初级抽卡
@registerAbility()
export class courier_draw_card_v1 extends BaseAbility_Plus {
    public readonly DrawCardType = DrawConfig.EDrawCardType.DrawCardV1;

    GetManaCost() {
        return 0;
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID();
        GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(iPlayerID).DrawComp().DrawCard(this.DrawCardType, 4);
        // Draw.DrawCard(iPlayerID, this.GetReservoirName(), this.GetSpecialValueFor("draw_count") + PlayerProperty.GetProperty(iPlayerID, PLAYER_PROPERTY_EXTRA_CARD1));
        // this.SpendWood();
    }
    ProcsMagicStick() {
        return false;
    }
    GetCooldown(iLevel: number) {
        // if (IsServer()) {
        //     return (this.GetAutoCastState() && 0) || 0.5;
        // } else {
        //     // return super.GetCooldown(iLevel);
        //     return 10
        // }
        return 10

    }
}
