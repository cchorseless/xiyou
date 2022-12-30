import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_pangolier_gyroshell_stop = { "ID": "6459", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCastAnimation": "ACT_INVALID" };

@registerAbility()
export class ability7_pangolier_gyroshell_stop extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pangolier_gyroshell_stop";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pangolier_gyroshell_stop = Data_pangolier_gyroshell_stop;
}
