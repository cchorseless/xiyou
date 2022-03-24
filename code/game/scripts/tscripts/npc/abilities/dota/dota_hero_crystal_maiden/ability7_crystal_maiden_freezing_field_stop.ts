
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_crystal_maiden_freezing_field_stop = {"ID":"8032","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"1"} ;

@registerAbility()
export class ability7_crystal_maiden_freezing_field_stop extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "crystal_maiden_freezing_field_stop";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_crystal_maiden_freezing_field_stop = Data_crystal_maiden_freezing_field_stop ;
}
    