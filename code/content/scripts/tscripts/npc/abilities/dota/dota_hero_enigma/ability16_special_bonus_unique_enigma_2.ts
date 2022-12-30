
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_enigma_2 = {"ID":"6510","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"8","ad_linked_ability":"enigma_malefice"},"02":{"var_type":"FIELD_INTEGER","value2":"4","ad_linked_ability":"enigma_malefice"}}} ;

@registerAbility()
export class ability16_special_bonus_unique_enigma_2 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_enigma_2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_enigma_2 = Data_special_bonus_unique_enigma_2 ;
}
    