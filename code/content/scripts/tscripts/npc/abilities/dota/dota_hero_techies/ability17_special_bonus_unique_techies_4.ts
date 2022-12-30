
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_techies_4 = {"ID":"6998","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"60","ad_linked_ability":"multi_linked_or_ability","linked_ad_abilities":"techies_land_mines techies_stasis_trap techies_remote_mines"}}} ;

@registerAbility()
export class ability17_special_bonus_unique_techies_4 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_techies_4";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_techies_4 = Data_special_bonus_unique_techies_4 ;
}
    