
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_faceless_void_time_dilation = {"ID":"5691","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_FacelessVoid.TimeDilation.Cast","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityCastPoint":"0.1","AbilityCooldown":"28 24 20 16","AbilityManaCost":"60 70 80 90","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"775"},"02":{"var_type":"FIELD_FLOAT","duration":"8 9 10 11"},"03":{"var_type":"FIELD_INTEGER","slow":"10"},"04":{"var_type":"FIELD_INTEGER","cooldown_percentage":"60"},"05":{"var_type":"FIELD_INTEGER","damage_per_stack":"10 11 12 13"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_faceless_void_time_dilation extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "faceless_void_time_dilation";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_faceless_void_time_dilation = Data_faceless_void_time_dilation ;
}
    