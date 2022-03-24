
import { GameEnum } from "../../../../GameEnum";
import { LogHelper } from "../../../../helper/LogHelper";
import { RoundSystem } from "../../../../rules/System/Round/RoundSystem";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";
import { modifier_tp } from "../../../modifier/modifier_tp";

@registerAbility()
export class ability4_courier_base extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
    }
    GetCooldown() {
        return 0
    }

    GetManaCost() {
        return 0
    }

    OnSpellStart() {
        RoundSystem.runSingleRound("2");
     
    }


}



