
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_life_stealer_consume = {"ID":"5253","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_UNRESTRICTED | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","FightRecapLevel":"1","AbilitySound":"Hero_LifeStealer.Consume","AbilityCastPoint":"0.0","AbilityCastAnimation":"ACT_INVALID"} ;

@registerAbility()
export class ability7_life_stealer_consume extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "life_stealer_consume";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_life_stealer_consume = Data_life_stealer_consume ;
}
    