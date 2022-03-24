
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_morphling_morph_replicate = {"ID":"5058","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityCastAnimation":"ACT_INVALID","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityManaCost":"0","AbilityCastPoint":"0.0","AbilityCooldown":"1"} ;

@registerAbility()
export class ability7_morphling_morph_replicate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "morphling_morph_replicate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_morphling_morph_replicate = Data_morphling_morph_replicate ;
}
    