
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nyx_assassin_unburrow = {"ID":"5673","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","MaxLevel":"1","FightRecapLevel":"1","LinkedAbility":"nyx_assassin_burrow","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCastPoint":"0.0","AbilityCooldown":"0.0","AbilityManaCost":"0"} ;

@registerAbility()
export class ability7_nyx_assassin_unburrow extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nyx_assassin_unburrow";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nyx_assassin_unburrow = Data_nyx_assassin_unburrow ;
}
    