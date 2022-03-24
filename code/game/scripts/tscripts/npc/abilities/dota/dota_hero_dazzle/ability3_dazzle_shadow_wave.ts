
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dazzle_shadow_wave = {"ID":"5235","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilitySound":"Hero_Dazzle.Shadow_Wave","HasScepterUpgrade":"1","AbilityCastRange":"800","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"14 12 10 8","AbilityManaCost":"90 100 110 120","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bounce_radius":"475"},"02":{"var_type":"FIELD_INTEGER","damage_radius":"185"},"03":{"var_type":"FIELD_INTEGER","max_targets":"3 4 5 6"},"04":{"var_type":"FIELD_INTEGER","tooltip_max_targets_inc_dazzle":"4 5 6 7"},"05":{"var_type":"FIELD_INTEGER","damage":"80 100 120 140","LinkedSpecialBonus":"special_bonus_unique_dazzle_2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_dazzle_shadow_wave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dazzle_shadow_wave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dazzle_shadow_wave = Data_dazzle_shadow_wave ;
}
    