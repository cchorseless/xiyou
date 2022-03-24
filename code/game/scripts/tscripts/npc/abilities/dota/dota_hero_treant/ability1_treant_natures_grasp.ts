
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_treant_natures_grasp = {"ID":"338","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilitySound":"Hero_Treant.NaturesGuise.On","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityCastRange":"1500","AbilityCastPoint":"0.2","AbilityCooldown":"20 19 18 17","AbilityManaCost":"75 80 85 90","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_per_second":"30 40 50 60","LinkedSpecialBonus":"special_bonus_unique_treant_9"},"02":{"var_type":"FIELD_INTEGER","movement_slow":"25 30 35 40"},"03":{"var_type":"FIELD_FLOAT","vines_duration":"12"},"04":{"var_type":"FIELD_FLOAT","creation_interval":"0.1"},"05":{"var_type":"FIELD_FLOAT","initial_latch_delay":"0.3"},"06":{"var_type":"FIELD_INTEGER","vine_spawn_interval":"175"},"07":{"var_type":"FIELD_INTEGER","latch_range":"135"},"08":{"var_type":"FIELD_INTEGER","latch_vision":"150"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability1_treant_natures_grasp extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "treant_natures_grasp";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_treant_natures_grasp = Data_treant_natures_grasp ;
}
    