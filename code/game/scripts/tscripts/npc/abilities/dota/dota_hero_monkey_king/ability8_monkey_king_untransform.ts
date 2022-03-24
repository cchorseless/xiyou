
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_monkey_king_untransform = {"ID":"5722","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN","AbilitySound":"Hero_MonkeyKing.Transform.Off","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID","MaxLevel":"1","AbilityCooldown":"1","AbilityDuration":"10.0 10.0 10.0 10.0","AbilityManaCost":"0 0 0 0"} ;

@registerAbility()
export class ability8_monkey_king_untransform extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_untransform";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_untransform = Data_monkey_king_untransform ;
}
    