
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_furion_wrath_of_nature = {"ID":"5248","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"2","AbilitySound":"Hero_Furion.WrathOfNature_Cast","HasScepterUpgrade":"1","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityCastRange":"0","AbilityCastPoint":"0.5 0.5 0.5","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"85","AbilityManaCost":"175 225 275","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","max_targets":"18"},"02":{"var_type":"FIELD_INTEGER","damage":"115 150 185","LinkedSpecialBonus":"special_bonus_unique_furion_5"},"03":{"var_type":"FIELD_INTEGER","damage_percent_add":"10"},"04":{"var_type":"FIELD_FLOAT","jump_delay":"0.25"},"05":{"var_type":"FIELD_INTEGER","kill_damage":"4 5 6"},"06":{"var_type":"FIELD_FLOAT","kill_damage_duration":"50"}}} ;

@registerAbility()
export class ability6_furion_wrath_of_nature extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "furion_wrath_of_nature";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_furion_wrath_of_nature = Data_furion_wrath_of_nature ;
}
    