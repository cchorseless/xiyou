
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_enigma_demonic_conversion = {"ID":"5147","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","AbilitySound":"Hero_Enigma.Demonic_Conversion","AbilityCastRange":"700","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"50 45 40 35","AbilityDuration":"40.0","AbilityManaCost":"140 150 160 170","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","spawn_count":"3 3 3 3","LinkedSpecialBonus":"special_bonus_unique_enigma"},"02":{"var_type":"FIELD_INTEGER","split_attack_count":"6 6 6 6"},"03":{"var_type":"FIELD_INTEGER","eidolon_hp_tooltip":"180 200 220 240","LinkedSpecialBonus":"special_bonus_unique_enigma_7"},"04":{"var_type":"FIELD_FLOAT","life_extension":"2.0 2.0 2.0 2.0"},"05":{"var_type":"FIELD_INTEGER","eidolon_dmg_tooltip":"20 28 38 47","LinkedSpecialBonus":"special_bonus_unique_enigma_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_enigma_demonic_conversion extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enigma_demonic_conversion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enigma_demonic_conversion = Data_enigma_demonic_conversion ;
}
    