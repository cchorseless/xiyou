
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_enigma_black_hole = {"ID":"5149","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","FightRecapLevel":"2","HasShardUpgrade":"1","HasScepterUpgrade":"1","AbilityCastRange":"275","AbilityCastPoint":"0.3 0.3 0.3","AbilityChannelTime":"4.0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityChannelAnimation":"ACT_DOTA_CHANNEL_ABILITY_4","AbilityCooldown":"200.0 180.0 160.0","AbilityManaCost":"300 400 500","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","scepter_radius":"1200"},"11":{"var_type":"FIELD_INTEGER","scepter_drag_speed":"175"},"12":{"var_type":"FIELD_FLOAT","scepter_pull_rotate_speed":"0.1"},"01":{"var_type":"FIELD_INTEGER","damage":"100 150 200"},"02":{"var_type":"FIELD_INTEGER","radius":"420"},"03":{"var_type":"FIELD_INTEGER","pull_speed":"30"},"04":{"var_type":"FIELD_FLOAT","tick_rate":"0.1 0.1 0.1"},"05":{"var_type":"FIELD_FLOAT","duration":"4.0 4.0 4.0"},"06":{"var_type":"FIELD_INTEGER","vision_radius":"800 800 800"},"07":{"var_type":"FIELD_FLOAT","pull_rotate_speed":"0.25"},"08":{"var_type":"FIELD_FLOAT","animation_rate":"0.2"},"09":{"var_type":"FIELD_FLOAT","scepter_pct_damage":"7"}}} ;

@registerAbility()
export class ability6_enigma_black_hole extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enigma_black_hole";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enigma_black_hole = Data_enigma_black_hole ;
}
    