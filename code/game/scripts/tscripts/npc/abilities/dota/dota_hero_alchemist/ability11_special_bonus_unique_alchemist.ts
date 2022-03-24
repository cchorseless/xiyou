
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_alchemist = {"ID":"6101","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"6","ad_linked_ability":"alchemist_unstable_concoction"}}} ;

@registerAbility()
export class ability11_special_bonus_unique_alchemist extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_alchemist";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_alchemist = Data_special_bonus_unique_alchemist ;
}
    