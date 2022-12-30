
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_seer_wall_of_replica = {"ID":"5258","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","FightRecapLevel":"2","AbilitySound":"Hero_Dark_Seer.Wall_of_Replica_Start","AbilityDraftUltShardAbility":"dark_seer_normal_punch","AbilityCastRange":"1300","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"100.0 100.0 100.0","AbilityManaCost":"125 250 375","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","scepter_length_multiplier":"2","RequiresScepter":"1"},"01":{"var_type":"FIELD_FLOAT","duration":"45.0"},"02":{"var_type":"FIELD_INTEGER","replica_damage_outgoing":"-30 -15 0"},"03":{"var_type":"FIELD_INTEGER","tooltip_outgoing":"70 85 100","LinkedSpecialBonus":"special_bonus_unique_dark_seer_7"},"04":{"var_type":"FIELD_INTEGER","replica_damage_incoming":"100"},"05":{"var_type":"FIELD_INTEGER","tooltip_replica_total_damage_incoming":"200","CalculateSpellDamageTooltip":"0"},"06":{"var_type":"FIELD_INTEGER","width":"1300"},"07":{"var_type":"FIELD_INTEGER","replica_scale":"0"},"08":{"var_type":"FIELD_INTEGER","movement_slow":"50 60 70"},"09":{"var_type":"FIELD_FLOAT","slow_duration":"1","LinkedSpecialBonus":"special_bonus_unique_dark_seer_12"}}} ;

@registerAbility()
export class ability6_dark_seer_wall_of_replica extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_seer_wall_of_replica";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_seer_wall_of_replica = Data_dark_seer_wall_of_replica ;
}
    