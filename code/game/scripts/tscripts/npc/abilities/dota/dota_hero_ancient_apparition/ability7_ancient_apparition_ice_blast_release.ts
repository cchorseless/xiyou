
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_ancient_apparition_ice_blast_release = {"ID":"5349","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","MaxLevel":"1","AbilityCastPoint":"0 0 0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"1.0 1.0 1.0"} ;

@registerAbility()
export class ability7_ancient_apparition_ice_blast_release extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ancient_apparition_ice_blast_release";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ancient_apparition_ice_blast_release = Data_ancient_apparition_ice_blast_release ;
}
    