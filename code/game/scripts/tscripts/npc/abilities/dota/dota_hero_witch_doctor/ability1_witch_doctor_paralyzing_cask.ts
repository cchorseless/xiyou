
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_witch_doctor_paralyzing_cask = {"ID":"5138","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_WitchDoctor.Paralyzing_Cask_Cast","AbilityCastRange":"700","AbilityCastPoint":"0.35 0.35 0.35 0.35","AbilityCooldown":"20.0 18.0 16.0 14.0","AbilityDamage":"75 100 125 150","AbilityManaCost":"80 100 120 140","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","hero_duration":"1.0 1.0 1.0 1.0"},"02":{"var_type":"FIELD_FLOAT","creep_duration":"5.0 5.0 5.0 5.0"},"03":{"var_type":"FIELD_INTEGER","hero_damage":"50 60 70 80"},"04":{"var_type":"FIELD_INTEGER","bounce_range":"575 575 575 575"},"05":{"var_type":"FIELD_INTEGER","bounces":"3 5 7 9"},"06":{"var_type":"FIELD_INTEGER","speed":"1000"},"07":{"var_type":"FIELD_FLOAT","bounce_delay":"0.3"},"08":{"var_type":"FIELD_INTEGER","bounces_tooltip":"2 4 6 8","LinkedSpecialBonus":"special_bonus_unique_witch_doctor_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_witch_doctor_paralyzing_cask extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "witch_doctor_paralyzing_cask";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_witch_doctor_paralyzing_cask = Data_witch_doctor_paralyzing_cask ;
}
    