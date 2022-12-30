
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bane_nightmare_end = {"ID":"5523","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE","MaxLevel":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5"} ;

@registerAbility()
export class ability7_bane_nightmare_end extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bane_nightmare_end";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bane_nightmare_end = Data_bane_nightmare_end ;
}
    