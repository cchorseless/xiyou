
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_slark_depth_shroud = {"ID":"729","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"800","AbilityCastPoint":"0.1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"75","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3"}}} ;

@registerAbility()
export class ability4_slark_depth_shroud extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slark_depth_shroud";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slark_depth_shroud = Data_slark_depth_shroud ;
}
    