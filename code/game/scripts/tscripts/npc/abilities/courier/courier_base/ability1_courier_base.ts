
import { GameEnum } from "../../../../GameEnum";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_test } from "../../../modifier/modifier_test";

@registerAbility()
export class ability1_courier_base extends BaseAbility_Plus {
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



