
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_invoker_6 = {"ID":"6811","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"1.4","ad_linked_ability":"invoker_chaos_meteor_ad"},"02":{"var_type":"FIELD_INTEGER","value_tooltip":"40","ad_linked_ability":"invoker_chaos_meteor_ad"}}} ;

@registerAbility()
export class ability18_special_bonus_unique_invoker_6 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_invoker_6";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_invoker_6 = Data_special_bonus_unique_invoker_6 ;
}
    