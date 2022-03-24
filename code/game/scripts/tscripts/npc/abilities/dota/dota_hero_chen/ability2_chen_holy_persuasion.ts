
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chen_holy_persuasion = {"ID":"5330","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","SpellDispellableType":"SPELL_DISPELLABLE_NO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilitySound":"Hero_Chen.HolyPersuasionCast","HasScepterUpgrade":"1","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"600","AbilityCooldown":"15","AbilityManaCost":"90 110 130 150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","max_units":"1 2 3 4","LinkedSpecialBonus":"special_bonus_unique_chen_1"},"02":{"var_type":"FIELD_INTEGER","level_req":"3 4 5 6"},"03":{"var_type":"FIELD_INTEGER","health_min":"700 800 900 1000","LinkedSpecialBonus":"special_bonus_unique_chen_4"},"04":{"var_type":"FIELD_INTEGER","movement_speed_bonus":"10 15 20 25"},"05":{"var_type":"FIELD_INTEGER","damage_bonus":"8 16 24 32","LinkedSpecialBonus":"special_bonus_unique_chen_5"},"06":{"var_type":"FIELD_FLOAT","teleport_delay":"6"},"07":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_chen_1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability2_chen_holy_persuasion extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chen_holy_persuasion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chen_holy_persuasion = Data_chen_holy_persuasion ;
}
    