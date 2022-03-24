
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_witch_doctor_3 = {"ID":"6524","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"2","ad_linked_ability":"witch_doctor_paralyzing_cask"}}} ;

@registerAbility()
export class ability12_special_bonus_unique_witch_doctor_3 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_witch_doctor_3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_witch_doctor_3 = Data_special_bonus_unique_witch_doctor_3 ;
}
    