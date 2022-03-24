
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_faceless_void_time_walk = {"ID":"5182","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","AbilitySound":"Hero_FacelessVoid.TimeWalk","HasScepterUpgrade":"1","HasShardUpgrade":"1","AbilityCastRange":"0","AbilityCastPoint":"0.3","AbilityCooldown":"24 18 12 6","AbilityManaCost":"40","AbilityModifierSupportValue":"0.25","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","speed":"3000"},"02":{"var_type":"FIELD_INTEGER","range":"650","LinkedSpecialBonus":"special_bonus_unique_faceless_void"},"03":{"var_type":"FIELD_FLOAT","backtrack_duration":"2.0"},"04":{"var_type":"FIELD_INTEGER","radius_scepter":"350","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_faceless_void_time_walk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "faceless_void_time_walk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_faceless_void_time_walk = Data_faceless_void_time_walk ;
}
    