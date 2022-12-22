
import { DrawConfig } from "../../../shared/DrawConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 中级抽卡
@registerAbility()
export class courier_draw_card_v2 extends BaseAbility_Plus {
    public readonly DrawCardType = DrawConfig.EDrawCardType.DrawCardV2;

    GetManaCost() {
        return 0;
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID();
        GPlayerSystem.GetInstance().GetPlayer(iPlayerID).DrawComp().DrawCard(this.DrawCardType, 3);
        // Draw.DrawCard(iPlayerID, this.GetReservoirName(), this.GetSpecialValueFor("draw_count") + PlayerProperty.GetProperty(iPlayerID, PLAYER_PROPERTY_EXTRA_CARD1));
        // this.SpendWood();
    }
    ProcsMagicStick() {
        return false;
    }
    GetCooldown(iLevel: number) {
        if (IsServer()) {
            return (this.GetAutoCastState() && 0) || 0.5;
        } else {
            return super.GetCooldown(iLevel);
        }
    }


}



