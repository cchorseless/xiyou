
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bane_nightmare = {"ID":"5014","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Bane.Nightmare","AbilityCastRange":"425 500 575 650","AbilityCastPoint":"0.4","AbilityCooldown":"22 19 16 13","AbilityDuration":"4.0 5.0 6.0 7.0","AbilityManaCost":"165","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","nightmare_invuln_time":"1.0"},"02":{"var_type":"FIELD_FLOAT","duration":"4.0 5.0 6.0 7.0"},"03":{"var_type":"FIELD_FLOAT","animation_rate":"0.2 0.2 0.2 0.2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_bane_nightmare extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bane_nightmare";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bane_nightmare = Data_bane_nightmare ;
}
    