
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_techies_stasis_trap = {"ID":"5600","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN | DOTA_ABILITY_BEHAVIOR_AOE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","HasScepterUpgrade":"1","AbilityCastRange":"150","AbilityCastPoint":"1.0","AbilityCooldown":"20.0 16.0 13.0 10.0","AbilityManaCost":"80 110 140 160","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","activation_radius":"400"},"02":{"var_type":"FIELD_FLOAT","explode_delay":"0"},"03":{"var_type":"FIELD_INTEGER","stun_radius":"600"},"04":{"var_type":"FIELD_FLOAT","stun_duration":"2 3 4 5"},"05":{"var_type":"FIELD_FLOAT","activation_time":"2.0"},"06":{"var_type":"FIELD_FLOAT","fade_time":"2.0"},"07":{"var_type":"FIELD_FLOAT","duration":"600.0"},"08":{"var_type":"FIELD_INTEGER","cast_range_scepter_bonus":"300","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_techies_stasis_trap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "techies_stasis_trap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_techies_stasis_trap = Data_techies_stasis_trap ;
}
    