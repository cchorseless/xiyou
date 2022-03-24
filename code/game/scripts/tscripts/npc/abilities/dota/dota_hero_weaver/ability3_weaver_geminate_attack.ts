
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_weaver_geminate_attack = {"ID":"5291","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilityCooldown":"9.0 7.0 5.0 3.0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","delay":"0.25"},"02":{"var_type":"FIELD_INTEGER","tooltip_attack":"1","LinkedSpecialBonus":"special_bonus_unique_weaver_5"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"10 25 40 55"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_weaver_geminate_attack extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "weaver_geminate_attack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_weaver_geminate_attack = Data_weaver_geminate_attack ;
}
    