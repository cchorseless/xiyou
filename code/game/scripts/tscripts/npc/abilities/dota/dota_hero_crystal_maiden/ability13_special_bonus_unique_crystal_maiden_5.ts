
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_crystal_maiden_5 = {"ID":"7654","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"3","ad_linked_ability":"crystal_maiden_crystal_nova"}}} ;

@registerAbility()
export class ability13_special_bonus_unique_crystal_maiden_5 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_crystal_maiden_5";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_crystal_maiden_5 = Data_special_bonus_unique_crystal_maiden_5 ;
}
    