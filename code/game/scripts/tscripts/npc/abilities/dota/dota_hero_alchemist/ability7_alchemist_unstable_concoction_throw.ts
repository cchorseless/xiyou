
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_unstable_concoction_throw = {"ID":"5367","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityCastRange":"775","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_INVALID","AbilityModifierSupportBonus":"120","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","brew_time":"5.0"},"02":{"var_type":"FIELD_FLOAT","min_stun":"0.25"},"03":{"var_type":"FIELD_FLOAT","max_stun":"1.75 2.5 3.25 4.0"},"04":{"var_type":"FIELD_INTEGER","min_damage":"0"},"05":{"var_type":"FIELD_INTEGER","max_damage":"150 220 290 360"},"06":{"var_type":"FIELD_INTEGER","movement_speed":"900"},"07":{"var_type":"FIELD_INTEGER","vision_range":"300"},"08":{"var_type":"FIELD_INTEGER","midair_explosion_radius":"250"},"09":{"var_type":"FIELD_FLOAT","brew_explosion":"7.0"}}} ;

@registerAbility()
export class ability7_alchemist_unstable_concoction_throw extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_unstable_concoction_throw";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_unstable_concoction_throw = Data_alchemist_unstable_concoction_throw ;
}
    