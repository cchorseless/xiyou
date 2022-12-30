
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_legion_commander_press_the_attack = {"ID":"5596","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_LegionCommander.PressTheAttack","AbilityCastRange":"700","AbilityCastPoint":"0.2","AbilityCooldown":"16.0 15.0 14.0 13.0","AbilityManaCost":"110","AbilityModifierSupportValue":"3.0","HasShardUpgrade":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"5.0"},"02":{"var_type":"FIELD_INTEGER","attack_speed":"65 90 115 140"},"03":{"var_type":"FIELD_INTEGER","hp_regen":"30 40 50 60"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_legion_commander_press_the_attack extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "legion_commander_press_the_attack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_legion_commander_press_the_attack = Data_legion_commander_press_the_attack ;
}
    