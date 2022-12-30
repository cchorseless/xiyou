
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lich_frost_shield = {"ID":"5136","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_INVULNERABLE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Lich.FrostArmor","AbilityCastRange":"1000","AbilityCastPoint":"0.2","AbilityCooldown":"30 25 20 15","AbilityManaCost":"100 110 120 130","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_reduction":"30 40 50 60","CalculateSpellDamageTooltip":"0","LinkedSpecialBonus":"special_bonus_unique_lich_8"},"02":{"var_type":"FIELD_INTEGER","movement_slow":"20 25 30 35"},"03":{"var_type":"FIELD_FLOAT","slow_duration":"0.5"},"04":{"var_type":"FIELD_INTEGER","damage":"20 30 40 50"},"05":{"var_type":"FIELD_FLOAT","interval":"1"},"06":{"var_type":"FIELD_INTEGER","radius":"600"},"07":{"var_type":"FIELD_FLOAT","duration":"6","LinkedSpecialBonus":"special_bonus_unique_lich_4"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_lich_frost_shield extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lich_frost_shield";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lich_frost_shield = Data_lich_frost_shield ;
}
    