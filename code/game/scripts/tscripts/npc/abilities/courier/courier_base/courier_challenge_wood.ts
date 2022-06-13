import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";
import { modifier_task } from "../../../modifier/modifier_task";

/**删除 */
@registerAbility()
export class courier_challenge_wood extends BaseAbility_Plus {
    // GetBehavior(): DOTA_ABILITY_BEHAVIOR {
    //     return tonumber(super.GetBehavior()) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_HIDDEN;
    // }

    OnSpellStart() {}

    ProcsMagicStick() {
        return false;
    }
}
