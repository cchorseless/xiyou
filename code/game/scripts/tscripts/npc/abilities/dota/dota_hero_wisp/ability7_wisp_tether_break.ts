
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_wisp_tether_break = {"ID":"5489","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET","MaxLevel":"1","AbilityCastPoint":"0 0 0 0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"1.0 1.0 1.0 1.0"} ;

@registerAbility()
export class ability7_wisp_tether_break extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "wisp_tether_break";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_wisp_tether_break = Data_wisp_tether_break ;
}
    