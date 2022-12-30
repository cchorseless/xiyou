
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_naga_siren_song_of_the_siren_cancel = {"ID":"5478","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","MaxLevel":"1","AbilityCastPoint":"0 0 0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"1.0 1.0 1.0"} ;

@registerAbility()
export class ability7_naga_siren_song_of_the_siren_cancel extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "naga_siren_song_of_the_siren_cancel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_naga_siren_song_of_the_siren_cancel = Data_naga_siren_song_of_the_siren_cancel ;
}
    