
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_wisp_spirits_in = {"ID":"5490","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_HIDDEN","MaxLevel":"4","AbilityCastPoint":"0 0 0 0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"0"} ;

@registerAbility()
export class ability4_wisp_spirits_in extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "wisp_spirits_in";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_wisp_spirits_in = Data_wisp_spirits_in ;
}
    