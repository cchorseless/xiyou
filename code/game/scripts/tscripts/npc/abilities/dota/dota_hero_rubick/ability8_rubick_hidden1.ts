
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rubick_hidden1 = {"ID":"5455","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","MaxLevel":"0","AbilityCastAnimation":"ACT_INVALID"} ;

@registerAbility()
export class ability8_rubick_hidden1 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rubick_hidden1";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rubick_hidden1 = Data_rubick_hidden1 ;
}
    