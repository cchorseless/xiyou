
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_soul_assumption = {"ID":"5481","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Visage.SoulAssumption.Cast","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"4.0 4.0 4.0 4.0","AbilityManaCost":"125","AbilityCastRange":"1000","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bolt_speed":"1000"},"02":{"var_type":"FIELD_INTEGER","soul_base_damage":"20"},"03":{"var_type":"FIELD_INTEGER","soul_charge_damage":"75","LinkedSpecialBonus":"special_bonus_unique_visage_4"},"04":{"var_type":"FIELD_INTEGER","stack_limit":"3 4 5 6"},"05":{"var_type":"FIELD_FLOAT","stack_duration":"6.0"},"06":{"var_type":"FIELD_INTEGER","damage_limit":"100"},"07":{"var_type":"FIELD_INTEGER","radius":"1500"},"08":{"var_type":"FIELD_FLOAT","damage_min":"2.0"},"09":{"var_type":"FIELD_FLOAT","damage_max":"3000.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_visage_soul_assumption extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_soul_assumption";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_soul_assumption = Data_visage_soul_assumption ;
}
    