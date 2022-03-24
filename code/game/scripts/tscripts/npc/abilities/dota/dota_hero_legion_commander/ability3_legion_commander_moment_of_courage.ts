
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_legion_commander_moment_of_courage = {"ID":"5597","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySound":"Hero_LegionCommander.Courage","AbilityCooldown":"2.3 1.8 1.3 0.8","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","trigger_chance":"25","LinkedSpecialBonus":"special_bonus_unique_legion_commander_3"},"02":{"var_type":"FIELD_FLOAT","buff_duration":"1.0"},"03":{"var_type":"FIELD_INTEGER","hp_leech_percent":"55 65 75 85"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_legion_commander_moment_of_courage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "legion_commander_moment_of_courage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_legion_commander_moment_of_courage = Data_legion_commander_moment_of_courage ;
}
    