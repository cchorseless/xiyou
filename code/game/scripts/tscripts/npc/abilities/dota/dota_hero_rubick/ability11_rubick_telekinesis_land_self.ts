
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rubick_telekinesis_land_self = {"ID":"647","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE","MaxLevel":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"325 325 325 325"}}} ;

@registerAbility()
export class ability11_rubick_telekinesis_land_self extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rubick_telekinesis_land_self";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rubick_telekinesis_land_self = Data_rubick_telekinesis_land_self ;
}
    