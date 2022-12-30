
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_elder_titan_earth_splitter = {"ID":"5594","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"2","AbilitySound":"Hero_ElderTitan.EarthSplitter.Cast","AbilityCastRange":"2400","AbilityCastPoint":"0.4 0.4 0.4","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"120 110 100","AbilityManaCost":"125 175 225","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","vision_duration":"4.0"},"11":{"var_type":"FIELD_INTEGER","vision_step":"200"},"12":{"var_type":"FIELD_INTEGER","total_steps":"12"},"13":{"var_type":"FIELD_FLOAT","slow_duration_scepter":"4.0 5.0 6.0"},"01":{"var_type":"FIELD_FLOAT","crack_time":"2.7182"},"02":{"var_type":"FIELD_INTEGER","crack_width":"315"},"03":{"var_type":"FIELD_INTEGER","crack_distance":"2400"},"04":{"var_type":"FIELD_INTEGER","slow_pct":"30 40 50"},"05":{"var_type":"FIELD_FLOAT","slow_duration":"3.0 4.0 5.0"},"06":{"var_type":"FIELD_INTEGER","speed":"1100"},"07":{"var_type":"FIELD_INTEGER","damage_pct":"30 40 50"},"08":{"var_type":"FIELD_INTEGER","vision_width":"500"},"09":{"var_type":"FIELD_FLOAT","vision_interval":"0.22"}}} ;

@registerAbility()
export class ability6_elder_titan_earth_splitter extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "elder_titan_earth_splitter";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_elder_titan_earth_splitter = Data_elder_titan_earth_splitter ;
}
    