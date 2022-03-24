
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_beastmaster_primal_roar = {"ID":"5177","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"2","AbilitySound":"Hero_Beastmaster.Primal_Roar","AbilityCastPoint":"0.5 0.5 0.5","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"90.0 80.0 70.0","AbilityManaCost":"150 175 200","AbilityCastRange":"600","AbilityModifierSupportValue":"0.6","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","movement_speed":"40"},"11":{"var_type":"FIELD_FLOAT","movement_speed_duration":"3.0 3.5 4"},"01":{"var_type":"FIELD_FLOAT","duration":"3.0 3.5 4.0"},"02":{"var_type":"FIELD_INTEGER","damage":"150 225 300"},"03":{"var_type":"FIELD_INTEGER","side_damage":"150 225 300"},"04":{"var_type":"FIELD_INTEGER","damage_radius":"300"},"05":{"var_type":"FIELD_INTEGER","slow_movement_speed_pct":"-60"},"06":{"var_type":"FIELD_INTEGER","slow_attack_speed_pct":"-60"},"07":{"var_type":"FIELD_INTEGER","push_distance":"450"},"08":{"var_type":"FIELD_FLOAT","push_duration":"1.0"},"09":{"var_type":"FIELD_FLOAT","slow_duration":"3 3.5 4"}}} ;

@registerAbility()
export class ability6_beastmaster_primal_roar extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "beastmaster_primal_roar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_beastmaster_primal_roar = Data_beastmaster_primal_roar ;
}
    