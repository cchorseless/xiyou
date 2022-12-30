
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_elder_titan_return_spirit = {"ID":"5592","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","MaxLevel":"1","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"0.0 0.0 0.0"} ;

@registerAbility()
export class ability7_elder_titan_return_spirit extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "elder_titan_return_spirit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_elder_titan_return_spirit = Data_elder_titan_return_spirit ;
}
    