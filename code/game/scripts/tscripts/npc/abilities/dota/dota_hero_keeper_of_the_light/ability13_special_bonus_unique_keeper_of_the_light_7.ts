
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_keeper_of_the_light_7 = {"ID":"527","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"4","ad_linked_ability":"keeper_of_the_light_chakra_magic"}}} ;

@registerAbility()
export class ability13_special_bonus_unique_keeper_of_the_light_7 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_keeper_of_the_light_7";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_keeper_of_the_light_7 = Data_special_bonus_unique_keeper_of_the_light_7 ;
}
    