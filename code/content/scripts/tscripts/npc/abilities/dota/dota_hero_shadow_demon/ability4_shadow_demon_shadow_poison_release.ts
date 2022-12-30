
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shadow_demon_shadow_poison_release = {"ID":"5424","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","MaxLevel":"1","AbilityCastPoint":"0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"1.0"} ;

@registerAbility()
export class ability4_shadow_demon_shadow_poison_release extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_demon_shadow_poison_release";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_demon_shadow_poison_release = Data_shadow_demon_shadow_poison_release ;
}
    