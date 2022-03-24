
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tidehunter_kraken_shell = {"ID":"5119","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySound":"Hero_Tidehunter.KrakenShell","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_reduction":"18 30 42 54","LinkedSpecialBonus":"special_bonus_unique_tidehunter_4","CalculateSpellDamageTooltip":"0"},"02":{"var_type":"FIELD_INTEGER","damage_cleanse":"600 550 500 450","CalculateSpellDamageTooltip":"0"},"03":{"var_type":"FIELD_FLOAT","damage_reset_interval":"6.0 6.0 6.0 6.0","CalculateSpellDamageTooltip":"0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_tidehunter_kraken_shell extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tidehunter_kraken_shell";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tidehunter_kraken_shell = Data_tidehunter_kraken_shell ;
}
    