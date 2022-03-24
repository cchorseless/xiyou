
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_morphling_morph_agi = {"ID":"5055","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE","LinkedAbility":"morphling_morph_str","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","points_per_tick":"1"},"02":{"var_type":"FIELD_FLOAT","morph_cooldown":"0.333 0.166 0.083 0.0416"},"03":{"var_type":"FIELD_INTEGER","bonus_attributes":"3 5 7 9"},"04":{"var_type":"FIELD_INTEGER","morph_rate_tooltip":"3 6 12 24"},"05":{"var_type":"FIELD_INTEGER","mana_cost":"10"}}} ;

@registerAbility()
export class ability4_morphling_morph_agi extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "morphling_morph_agi";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_morphling_morph_agi = Data_morphling_morph_agi ;
}
    