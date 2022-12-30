
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_hp_200 = {"ID":"5959","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"200"}}} ;

@registerAbility()
export class ability10_special_bonus_hp_200 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_hp_200";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_hp_200 = Data_special_bonus_hp_200 ;
}
    