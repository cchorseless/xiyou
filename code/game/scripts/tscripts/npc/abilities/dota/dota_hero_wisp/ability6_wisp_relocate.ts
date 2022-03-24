
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_wisp_relocate = {"ID":"5488","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Wisp.Relocate","AbilityCastPoint":"0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"100 90 80","AbilityManaCost":"175","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","cast_delay":"3.5 3.25 3.0"},"02":{"var_type":"FIELD_FLOAT","return_time":"12.0 12.0 12.0"}}} ;

@registerAbility()
export class ability6_wisp_relocate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "wisp_relocate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_wisp_relocate = Data_wisp_relocate ;
}
    