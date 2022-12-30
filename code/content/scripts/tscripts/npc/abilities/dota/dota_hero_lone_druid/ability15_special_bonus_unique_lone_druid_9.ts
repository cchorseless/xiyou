
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_lone_druid_9 = {"ID":"7036","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"0","ad_linked_ability":"multi_linked_or_ability","linked_ad_abilities":"lone_druid_spirit_bear lone_druid_true_form"}}} ;

@registerAbility()
export class ability15_special_bonus_unique_lone_druid_9 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_lone_druid_9";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_lone_druid_9 = Data_special_bonus_unique_lone_druid_9 ;
}
    