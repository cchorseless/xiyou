
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rubick_fade_bolt = {"ID":"5450","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Rubick.FadeBolt.Cast","AbilityCastPoint":"0.1 0.1 0.1 0.1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCooldown":"16 14 12 10","AbilityManaCost":"120 130 140 150","AbilityCastRange":"800 800 800 800","AbilityModifierSupportValue":"0.35","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"100 175 250 325"},"02":{"var_type":"FIELD_INTEGER","jump_damage_reduction_pct":"8","CalculateSpellDamageTooltip":"0"},"03":{"var_type":"FIELD_INTEGER","attack_damage_reduction":"10 18 26 34","LinkedSpecialBonus":"special_bonus_unique_rubick_2","CalculateSpellDamageTooltip":"0"},"04":{"var_type":"FIELD_FLOAT","duration":"10.0 10.0 10.0 10.0"},"05":{"var_type":"FIELD_INTEGER","radius":"440"},"06":{"var_type":"FIELD_FLOAT","jump_delay":"0.25 0.25 0.25 0.25"}}} ;

@registerAbility()
export class ability2_rubick_fade_bolt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rubick_fade_bolt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rubick_fade_bolt = Data_rubick_fade_bolt ;
}
    