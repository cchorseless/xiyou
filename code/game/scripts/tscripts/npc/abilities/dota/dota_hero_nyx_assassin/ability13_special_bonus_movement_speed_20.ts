
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_movement_speed_20 = {"ID":"5918","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"20"}}} ;

@registerAbility()
export class ability13_special_bonus_movement_speed_20 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_movement_speed_20";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_movement_speed_20 = Data_special_bonus_movement_speed_20 ;
}
    