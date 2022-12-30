
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_abyssal_underlord_cancel_dark_rift = {"ID":"5617","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","MaxLevel":"1","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_DOTA_OVERRIDE_ABILITY_4","AbilityCastGestureSlot":"DEFAULT"} ;

@registerAbility()
export class ability7_abyssal_underlord_cancel_dark_rift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abyssal_underlord_cancel_dark_rift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abyssal_underlord_cancel_dark_rift = Data_abyssal_underlord_cancel_dark_rift ;
}
    