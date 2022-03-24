
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_monkey_king_primal_spring_early = {"ID":"5726","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE","AbilityTextureName":"monkey_king_primal_spring","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastAnimation":"ACT_INVALID"} ;

@registerAbility()
export class ability7_monkey_king_primal_spring_early extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_primal_spring_early";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_primal_spring_early = Data_monkey_king_primal_spring_early ;
}
    