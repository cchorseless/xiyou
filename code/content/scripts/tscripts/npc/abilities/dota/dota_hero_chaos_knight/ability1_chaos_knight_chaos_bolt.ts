
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chaos_knight_chaos_bolt = {"ID":"5426","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_ChaosKnight.ChaosBolt.Cast","HasShardUpgrade":"1","AbilityCastRange":"500","AbilityCastPoint":"0.4 0.4 0.4 0.4","AbilityCooldown":"13 12 11 10","AbilityManaCost":"110 120 130 140","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","chaos_bolt_speed":"700"},"02":{"var_type":"FIELD_FLOAT","stun_min":"1.25 1.5 1.75 2","LinkedSpecialBonus":"special_bonus_unique_chaos_knight_3"},"03":{"var_type":"FIELD_FLOAT","stun_max":"2.2 2.8 3.4 4","LinkedSpecialBonus":"special_bonus_unique_chaos_knight_3"},"04":{"var_type":"FIELD_INTEGER","damage_min":"90 110 130 150"},"05":{"var_type":"FIELD_INTEGER","damage_max":"180 220 260 300"},"06":{"var_type":"FIELD_INTEGER","fake_bolt_distance":"675"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_chaos_knight_chaos_bolt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chaos_knight_chaos_bolt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chaos_knight_chaos_bolt = Data_chaos_knight_chaos_bolt ;
}
    