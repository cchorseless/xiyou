
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_pugna_decrepify = {"ID":"5187","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Pugna.Decrepify","AbilityCastRange":"400 500 600 700","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"15.0 12.0 9.0 6.0","AbilityDuration":"3.5","AbilityManaCost":"60","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_spell_damage_pct_allies":"-25"},"02":{"var_type":"FIELD_INTEGER","bonus_movement_speed_allies":"0"},"03":{"var_type":"FIELD_INTEGER","bonus_spell_damage_pct":"-30 -40 -50 -60"},"04":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"-30 -40 -50 -60"},"05":{"var_type":"FIELD_FLOAT","abilityduration":"","LinkedSpecialBonus":"special_bonus_unique_pugna_5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_pugna_decrepify extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pugna_decrepify";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pugna_decrepify = Data_pugna_decrepify ;
}
    