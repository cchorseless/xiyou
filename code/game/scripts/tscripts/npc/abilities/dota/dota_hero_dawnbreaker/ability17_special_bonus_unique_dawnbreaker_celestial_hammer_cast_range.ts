
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_dawnbreaker_celestial_hammer_cast_range = {"ID":"7934","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"1100"}}} ;

@registerAbility()
export class ability17_special_bonus_unique_dawnbreaker_celestial_hammer_cast_range extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_dawnbreaker_celestial_hammer_cast_range";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_dawnbreaker_celestial_hammer_cast_range = Data_special_bonus_unique_dawnbreaker_celestial_hammer_cast_range ;
}
    