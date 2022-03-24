
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_dawnbreaker_fire_wreath_charges = {"ID":"7939","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"2"}}} ;

@registerAbility()
export class ability14_special_bonus_unique_dawnbreaker_fire_wreath_charges extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_dawnbreaker_fire_wreath_charges";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_dawnbreaker_fire_wreath_charges = Data_special_bonus_unique_dawnbreaker_fire_wreath_charges ;
}
    