
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shadow_demon_disruption = {"ID":"5421","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY | DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO | DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_ShadowDemon.Disruption","AbilityDuration":"2.75","AbilityCooldown":"27.0 24.0 21.0 18.0","AbilityCastRange":"600","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityManaCost":"120 120 120 120","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","disruption_duration":"2.75","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_5"},"02":{"var_type":"FIELD_FLOAT","illusion_duration":"11 12 13 14"},"03":{"var_type":"FIELD_FLOAT","illusion_outgoing_damage":"-70.0 -55.0 -40.0 -25.0"},"04":{"var_type":"FIELD_FLOAT","illusion_outgoing_tooltip":"30.0 45.0 60.0 75.0"},"05":{"var_type":"FIELD_FLOAT","illusion_incoming_damage":"200"},"06":{"var_type":"FIELD_FLOAT","tooltip_total_illusion_incoming_damage":"300"},"07":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_7"},"08":{"var_type":"FIELD_INTEGER","illusion_bounty_base":"0"},"09":{"var_type":"FIELD_INTEGER","illusion_bounty_growth":"2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_shadow_demon_disruption extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_demon_disruption";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_demon_disruption = Data_shadow_demon_disruption ;
}
    