
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_seer_ion_shell = {"ID":"5256","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Dark_Seer.Ion_Shield_Start","HasScepterUpgrade":"1","AbilityCastRange":"600","AbilityCastPoint":"0.4 0.4 0.4 0.4","AbilityCooldown":"9","AbilityManaCost":"110 120 130 140","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"275","LinkedSpecialBonus":"special_bonus_unique_dark_seer_5"},"02":{"var_type":"FIELD_INTEGER","damage_per_second":"30 50 70 90","LinkedSpecialBonus":"special_bonus_unique_dark_seer"},"03":{"var_type":"FIELD_FLOAT","duration":"25"},"04":{"var_type":"FIELD_FLOAT","tick_interval":"0.15"},"05":{"var_type":"FIELD_INTEGER","max_charges":"2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_dark_seer_ion_shell extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_seer_ion_shell";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_seer_ion_shell = Data_dark_seer_ion_shell ;
}
    