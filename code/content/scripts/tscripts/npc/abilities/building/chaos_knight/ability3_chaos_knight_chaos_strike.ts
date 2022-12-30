
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chaos_knight_chaos_strike = {"ID":"5428","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySound":"Hero_ChaosKnight.ChaosStrike","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","chance":"30","LinkedSpecialBonus":"special_bonus_unique_chaos_knight_5"},"02":{"var_type":"FIELD_INTEGER","crit_min":"120"},"03":{"var_type":"FIELD_INTEGER","crit_max":"140 170 200 230"},"04":{"var_type":"FIELD_INTEGER","lifesteal":"25 40 55 70"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_chaos_knight_chaos_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chaos_knight_chaos_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chaos_knight_chaos_strike = Data_chaos_knight_chaos_strike ;
}
    