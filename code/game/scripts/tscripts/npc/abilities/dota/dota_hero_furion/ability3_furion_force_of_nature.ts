
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_furion_force_of_nature = {"ID":"5247","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilitySound":"Hero_Furion.ForceOfNature","AbilityCastRange":"750","AbilityCastPoint":"0.5 0.5 0.5 0.5","AbilityCooldown":"37","AbilityManaCost":"130 140 150 160","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","area_of_effect":"150 225 300 375"},"02":{"var_type":"FIELD_INTEGER","max_treants":"2 3 4 5","LinkedSpecialBonus":"special_bonus_unique_furion_2"},"03":{"var_type":"FIELD_FLOAT","duration":"60 60 60 60"},"04":{"var_type":"FIELD_INTEGER","treant_health_tooltip":"550","LinkedSpecialBonus":"special_bonus_unique_furion","LinkedSpecialBonusOperation":"SPECIAL_BONUS_MULTIPLY"},"05":{"var_type":"FIELD_INTEGER","treant_dmg_tooltip":"18 26 34 42","LinkedSpecialBonus":"special_bonus_unique_furion","LinkedSpecialBonusOperation":"SPECIAL_BONUS_MULTIPLY"},"06":{"var_type":"FIELD_INTEGER","treant_hp_bonus":"825"},"07":{"var_type":"FIELD_INTEGER","treant_damage_bonus":"27 39 51 63"},"08":{"var_type":"FIELD_INTEGER","treant_large_hp_bonus":"1320","RequiresScepter":"1"},"09":{"var_type":"FIELD_INTEGER","treant_large_damage_bonus":"57 67 77 87","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_furion_force_of_nature extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "furion_force_of_nature";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_furion_force_of_nature = Data_furion_force_of_nature ;
}
    