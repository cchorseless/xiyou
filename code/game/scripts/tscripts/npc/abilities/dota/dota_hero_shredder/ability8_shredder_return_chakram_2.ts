
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shredder_return_chakram_2 = {"ID":"5646","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","MaxLevel":"3","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"0.0 0.0 0.0"} ;

@registerAbility()
export class ability8_shredder_return_chakram_2 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shredder_return_chakram_2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shredder_return_chakram_2 = Data_shredder_return_chakram_2 ;
}
    