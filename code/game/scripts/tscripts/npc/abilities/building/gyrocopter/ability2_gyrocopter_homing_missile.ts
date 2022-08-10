
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_gyrocopter_homing_missile = {"ID":"5362","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilityCastRange":"1050","AbilityCastPoint":"0","AbilityCooldown":"26 21 16 11","AbilityManaCost":"120 130 140 150","AbilityDamage":"100 175 250 325","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","acceleration":"20"},"11":{"var_type":"FIELD_INTEGER","enemy_vision_time":"4"},"12":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_gyrocopter_1"},"01":{"var_type":"FIELD_INTEGER","hits_to_kill_tooltip":"3"},"02":{"var_type":"FIELD_INTEGER","tower_hits_to_kill_tooltip":"6"},"03":{"var_type":"FIELD_FLOAT","stun_duration":"2.25 2.5 2.75 3.0","LinkedSpecialBonus":"special_bonus_unique_gyrocopter_6"},"04":{"var_type":"FIELD_INTEGER","attack_speed_bonus_pct":"400 400 400 400"},"05":{"var_type":"FIELD_INTEGER","min_damage":"50"},"06":{"var_type":"FIELD_INTEGER","max_distance":"1500"},"07":{"var_type":"FIELD_FLOAT","pre_flight_time":"2.5"},"08":{"var_type":"FIELD_INTEGER","hero_damage":"34"},"09":{"var_type":"FIELD_FLOAT","speed":"500"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_gyrocopter_homing_missile extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "gyrocopter_homing_missile";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_gyrocopter_homing_missile = Data_gyrocopter_homing_missile ;
}
    