
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_mana_break_20 = {"ID":"6987","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"20"},"02":{"var_type":"FIELD_INTEGER","burn_illusions_ranged":"10"},"03":{"var_type":"FIELD_INTEGER","burn_illusions_melee":"10"},"04":{"var_type":"FIELD_FLOAT","damage_per_burn":"0.8"}}} ;

@registerAbility()
export class ability15_special_bonus_mana_break_20 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_mana_break_20";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_mana_break_20 = Data_special_bonus_mana_break_20 ;
}
    