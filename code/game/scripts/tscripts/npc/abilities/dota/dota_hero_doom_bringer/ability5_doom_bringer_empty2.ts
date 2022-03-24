
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_doom_bringer_empty2 = {"ID":"5344","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","MaxLevel":"0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5"} ;

@registerAbility()
export class ability5_doom_bringer_empty2 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "doom_bringer_empty2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_doom_bringer_empty2 = Data_doom_bringer_empty2 ;
}
    