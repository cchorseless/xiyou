
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tusk_ice_shards = {"ID":"5565","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Tusk.IceShards","AbilityCastRange":"1800","AbilityCastPoint":"0.1 0.1 0.1 0.1","AbilityCooldown":"23.0 20.0 17.0 14.0","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","shard_width":"200"},"02":{"var_type":"FIELD_INTEGER","shard_damage":"70 140 210 280"},"03":{"var_type":"FIELD_INTEGER","shard_count":"7"},"04":{"var_type":"FIELD_FLOAT","shard_speed":"1200.0"},"05":{"var_type":"FIELD_FLOAT","shard_duration":"4 5 6 7"},"06":{"var_type":"FIELD_FLOAT","shard_angle_step":"40.0"},"07":{"var_type":"FIELD_INTEGER","shard_distance":"200"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_tusk_ice_shards extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tusk_ice_shards";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tusk_ice_shards = Data_tusk_ice_shards ;
}
    