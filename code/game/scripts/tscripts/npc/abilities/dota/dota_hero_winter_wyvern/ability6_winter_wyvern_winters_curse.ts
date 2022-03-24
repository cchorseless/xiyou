
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_winter_wyvern_winters_curse = {"ID":"5654","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","FightRecapLevel":"2","AbilitySound":"Hero_WinterWyvern.WintersCurse.Target","AbilityCastRange":"800","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"90 85 80","AbilityManaCost":"250","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"525"},"02":{"var_type":"FIELD_INTEGER","damage_reduction":"100"},"03":{"var_type":"FIELD_INTEGER","damage_amplification":"0"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"65"},"05":{"var_type":"FIELD_FLOAT","duration":"4.5 5 5.5","LinkedSpecialBonus":"special_bonus_unique_winter_wyvern_3"}}} ;

@registerAbility()
export class ability6_winter_wyvern_winters_curse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "winter_wyvern_winters_curse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_winter_wyvern_winters_curse = Data_winter_wyvern_winters_curse ;
}
    