
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phoenix_sun_ray_toggle_move = {"ID":"5628","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","MaxLevel":"1","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID"} ;

@registerAbility()
export class ability4_phoenix_sun_ray_toggle_move extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phoenix_sun_ray_toggle_move";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phoenix_sun_ray_toggle_move = Data_phoenix_sun_ray_toggle_move ;
}
    