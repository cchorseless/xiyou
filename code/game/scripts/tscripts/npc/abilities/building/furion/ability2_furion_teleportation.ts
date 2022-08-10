
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_furion_teleportation = {"ID":"5246","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Furion.Teleport_Grow","AbilityCastRange":"0","AbilityCastPoint":"3 3 3 3","AbilityCooldown":"65 50 35 20","AbilityManaCost":"50 50 50 50","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2","AbilitySpecial":{}} ;

@registerAbility()
export class ability2_furion_teleportation extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "furion_teleportation";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_furion_teleportation = Data_furion_teleportation ;
}
    