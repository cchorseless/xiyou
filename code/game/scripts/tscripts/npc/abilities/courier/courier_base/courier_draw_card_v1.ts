import { GameEnum } from "../../../../GameEnum";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { RoundSystem } from "../../../../rules/System/Round/RoundSystem";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

// 初级抽卡
@registerAbility()
export class courier_draw_card_v1 extends BaseAbility_Plus {

    GetManaCost() {
        return 0;
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID();
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
