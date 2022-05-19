
import { GameEnum } from "../../../../GameEnum";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { RoundSystem } from "../../../../rules/System/Round/RoundSystem";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

// 中级抽卡
@registerAbility()
export class courier_draw_card_v2 extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
    }
    GetCooldown() {
        return 5
    }

    GetManaCost() {
        return 0
    }

    OnSpellStart() {
    }


}



