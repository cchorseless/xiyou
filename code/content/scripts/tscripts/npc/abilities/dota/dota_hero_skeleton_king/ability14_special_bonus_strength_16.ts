
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_strength_16 = {"ID":"447","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"16"}}} ;

@registerAbility()
export class ability14_special_bonus_strength_16 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_strength_16";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_strength_16 = Data_special_bonus_strength_16 ;
}
    