
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_faceless_void_time_walk_reverse = {"ID":"8030","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","AbilitySound":"Hero_FacelessVoid.TimeWalk","MaxLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"0","AbilityCastPoint":"0","AbilityCooldown":"0.5","AbilityManaCost":"0","AbilityModifierSupportValue":"0.25","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","buff_duration":"3000"},"02":{"var_type":"FIELD_INTEGER","speed":"3000"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability4_faceless_void_time_walk_reverse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "faceless_void_time_walk_reverse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_faceless_void_time_walk_reverse = Data_faceless_void_time_walk_reverse ;
}
    