
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_earth_spirit_4 = {"ID":"324","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"325","ad_linked_ability":"earth_spirit_rolling_boulder"},"02":{"var_type":"FIELD_INTEGER","value2":"650","ad_linked_ability":"earth_spirit_rolling_boulder"}}} ;

@registerAbility()
export class ability10_special_bonus_unique_earth_spirit_4 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_earth_spirit_4";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_earth_spirit_4 = Data_special_bonus_unique_earth_spirit_4 ;
}
    