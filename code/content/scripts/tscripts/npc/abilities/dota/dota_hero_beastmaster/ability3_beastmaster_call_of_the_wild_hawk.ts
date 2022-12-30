
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_beastmaster_call_of_the_wild_hawk = {"ID":"7231","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilitySound":"Hero_Beastmaster.Call.Hawk","HasShardUpgrade":"1","AbilityCastRange":"0","AbilityCastPoint":"0.3","AbilityCooldown":"60 50 40 30","AbilityManaCost":"30","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","duration":"60"},"02":{"var_type":"FIELD_INTEGER","hawk_hp_tooltip":"150 200 250 300"},"03":{"var_type":"FIELD_INTEGER","hawk_speed_tooltip":"300 340 380 420","LinkedSpecialBonus":"special_bonus_unique_beastmaster_2"},"04":{"var_type":"FIELD_INTEGER","hawk_vision_tooltip":"600 700 800 900","LinkedSpecialBonus":"special_bonus_unique_beastmaster_5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability3_beastmaster_call_of_the_wild_hawk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "beastmaster_call_of_the_wild_hawk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_beastmaster_call_of_the_wild_hawk = Data_beastmaster_call_of_the_wild_hawk ;
}
    