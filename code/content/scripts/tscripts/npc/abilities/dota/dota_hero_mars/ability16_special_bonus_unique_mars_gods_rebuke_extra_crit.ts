
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_mars_gods_rebuke_extra_crit = {"ID":"6756","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"65","ad_linked_ability":"mars_gods_rebuke"}}} ;

@registerAbility()
export class ability16_special_bonus_unique_mars_gods_rebuke_extra_crit extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_mars_gods_rebuke_extra_crit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_mars_gods_rebuke_extra_crit = Data_special_bonus_unique_mars_gods_rebuke_extra_crit ;
}
    