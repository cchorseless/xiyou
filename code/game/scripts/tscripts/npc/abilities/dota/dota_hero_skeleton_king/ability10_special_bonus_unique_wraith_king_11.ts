
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_wraith_king_11 = {"ID":"809","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"0.5","ad_linked_ability":"skeleton_king_hellfire_blast"}}} ;

@registerAbility()
export class ability10_special_bonus_unique_wraith_king_11 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_wraith_king_11";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_wraith_king_11 = Data_special_bonus_unique_wraith_king_11 ;
}
    