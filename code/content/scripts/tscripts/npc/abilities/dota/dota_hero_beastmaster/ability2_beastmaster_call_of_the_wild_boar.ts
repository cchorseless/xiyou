
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_beastmaster_call_of_the_wild_boar = {"ID":"7230","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilitySound":"Hero_Beastmaster.Call.Boar","AbilityCastPoint":"0.3","AbilityCooldown":"42 38 34 30","AbilityManaCost":"60 65 70 75","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","duration":"60 60 60 60"},"02":{"var_type":"FIELD_INTEGER","boar_hp_tooltip":"300 450 600 750"},"03":{"var_type":"FIELD_INTEGER","boar_damage_tooltip":"16 32 48 64","LinkedSpecialBonus":"special_bonus_unique_beastmaster_2"},"04":{"var_type":"FIELD_INTEGER","boar_moveslow_tooltip":"10 20 30 40"},"05":{"var_type":"FIELD_FLOAT","boar_poison_duration_tooltip":"3.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_beastmaster_call_of_the_wild_boar extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "beastmaster_call_of_the_wild_boar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_beastmaster_call_of_the_wild_boar = Data_beastmaster_call_of_the_wild_boar ;
}
    