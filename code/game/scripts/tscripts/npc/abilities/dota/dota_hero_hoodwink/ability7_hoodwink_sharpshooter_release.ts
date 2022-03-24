
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_sharpshooter_release = {"ID":"8159","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityCastPoint":"0.0","AbilityCastRange":"999999","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_7","MaxLevel":"3"} ;

@registerAbility()
export class ability7_hoodwink_sharpshooter_release extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_sharpshooter_release";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_sharpshooter_release = Data_hoodwink_sharpshooter_release ;
}
    