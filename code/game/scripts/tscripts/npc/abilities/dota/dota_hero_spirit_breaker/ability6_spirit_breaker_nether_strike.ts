
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_spirit_breaker_nether_strike = {"ID":"5356","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"2","AbilitySound":"Hero_Spirit_Breaker.NetherStrike.Begin","HasShardUpgrade":"1","AbilityCastPoint":"1.0","AbilityCastRange":"700","AbilityCastRangeBuffer":"500","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"90 70 50","AbilityManaCost":"125 150 175","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"100 175 250"},"02":{"var_type":"FIELD_FLOAT","fade_time":"1.0 1.0 1.0"}}} ;

@registerAbility()
export class ability6_spirit_breaker_nether_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spirit_breaker_nether_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spirit_breaker_nether_strike = Data_spirit_breaker_nether_strike ;
}
    