
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_winter_wyvern_5 = {"ID":"418","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"1.5","ad_linked_ability":"winter_wyvern_cold_embrace"}}} ;

@registerAbility()
export class ability10_special_bonus_unique_winter_wyvern_5 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_winter_wyvern_5";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_winter_wyvern_5 = Data_special_bonus_unique_winter_wyvern_5 ;
}
    