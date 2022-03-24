
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_lancer_juxtapose = {"ID":"5067","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","HasScepterUpgrade":"1","AbilityCooldown":"60","AbilityManaCost":"75","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","scepter_bonus_duration":"10"},"01":{"var_type":"FIELD_INTEGER","max_illusions":"6 8 10","LinkedSpecialBonus":"special_bonus_unique_phantom_lancer_3"},"02":{"var_type":"FIELD_INTEGER","proc_chance_pct":"40 45 50"},"03":{"var_type":"FIELD_INTEGER","illusion_proc_chance_pct":"8"},"04":{"var_type":"FIELD_INTEGER","illusion_duration":"8"},"05":{"var_type":"FIELD_INTEGER","illusion_damage_out_pct":"-78","CalculateSpellDamageTooltip":"0"},"06":{"var_type":"FIELD_INTEGER","tooltip_illusion_damage":"22","LinkedSpecialBonus":"special_bonus_unique_phantom_lancer_6","CalculateSpellDamageTooltip":"0"},"07":{"var_type":"FIELD_INTEGER","illusion_damage_in_pct":"550","CalculateSpellDamageTooltip":"0"},"08":{"var_type":"FIELD_INTEGER","tooltip_total_illusion_damage_in_pct":"650","CalculateSpellDamageTooltip":"0"},"09":{"var_type":"FIELD_INTEGER","illusion_from_illusion_duration":"4"}}} ;

@registerAbility()
export class ability6_phantom_lancer_juxtapose extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_lancer_juxtapose";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_lancer_juxtapose = Data_phantom_lancer_juxtapose ;
}
    