
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_morphling_adaptive_strike_str = {"ID":"7000","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_Morphling.AdaptiveStrike","LinkedAbility":"morphling_adaptive_strike_agi","AbilityCastRange":"600 700 800 900","AbilityCastPoint":"0.25","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCooldown":"10","AbilityManaCost":"50 60 70 80","AbilityModifierSupportValue":"0.3","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","stun_min":"0.5"},"02":{"var_type":"FIELD_FLOAT","stun_max":"1.5 2.0 2.5 3.0"},"03":{"var_type":"FIELD_INTEGER","knockback_min":"100"},"04":{"var_type":"FIELD_INTEGER","knockback_max":"500"},"05":{"var_type":"FIELD_FLOAT","projectile_speed":"1150"},"06":{"var_type":"FIELD_FLOAT","shared_cooldown":"3"}}} ;

@registerAbility()
export class ability3_morphling_adaptive_strike_str extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "morphling_adaptive_strike_str";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_morphling_adaptive_strike_str = Data_morphling_adaptive_strike_str ;
}
    