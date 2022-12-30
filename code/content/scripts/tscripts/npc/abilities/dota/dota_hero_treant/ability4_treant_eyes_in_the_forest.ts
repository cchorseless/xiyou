
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_treant_eyes_in_the_forest = {"ID":"5649","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Hero_Treant.Eyes.Cast","AbilityCastRange":"160","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCharges":"3","AbilityChargeRestoreTime":"40.0","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","vision_aoe":"800","LinkedSpecialBonus":"special_bonus_unique_treant_5","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","overgrowth_aoe":"800","LinkedSpecialBonus":"special_bonus_unique_treant_5","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","tree_respawn_seconds":"10","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_treant_eyes_in_the_forest extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "treant_eyes_in_the_forest";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_treant_eyes_in_the_forest = Data_treant_eyes_in_the_forest ;
}
    