
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_seer_surge = {"ID":"5257","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Dark_Seer.Surge","AbilityCastRange":"600","AbilityCastPoint":"0.4","AbilityCooldown":"19 16 13 10","AbilityManaCost":"50","AbilityModifierSupportValue":"2.5","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3 4 5 6"},"02":{"var_type":"FIELD_INTEGER","speed_boost":"550"},"03":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_dark_seer_9"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_dark_seer_surge extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_seer_surge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_seer_surge = Data_dark_seer_surge ;
}
    