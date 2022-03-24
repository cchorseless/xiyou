
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_spirit_breaker_charge_of_darkness = {"ID":"5353","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Spirit_Breaker.ChargeOfDarkness","HasScepterUpgrade":"1","AbilityCastPoint":"0.3","AbilityCastRange":"0","AbilityCooldown":"17 15 13 11","AbilityManaCost":"70 80 90 100","AbilityModifierSupportValue":".30","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","movement_speed":"300 325 350 375"},"02":{"var_type":"FIELD_FLOAT","stun_duration":"1.2 1.6 2.0 2.4"},"03":{"var_type":"FIELD_INTEGER","bash_radius":"300 300 300 300"},"04":{"var_type":"FIELD_INTEGER","vision_radius":"400 400 400 400"},"05":{"var_type":"FIELD_FLOAT","vision_duration":"0.94 0.94 0.94 0.94"},"06":{"var_type":"FIELD_FLOAT","scepter_cooldown":"7","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","scepter_speed":"175","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_spirit_breaker_charge_of_darkness extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spirit_breaker_charge_of_darkness";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spirit_breaker_charge_of_darkness = Data_spirit_breaker_charge_of_darkness ;
}
    