
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_troll_warlord_rampage = {"ID":"728","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","IsShardUpgrade":"1","IsGrantedByShard":"1","AbilityCastPoint":"0.0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"80","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_speed":"70"},"02":{"var_type":"FIELD_INTEGER","status_resistance":"25"},"03":{"var_type":"FIELD_FLOAT","duration":"5"}}} ;

@registerAbility()
export class ability5_troll_warlord_rampage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "troll_warlord_rampage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_troll_warlord_rampage = Data_troll_warlord_rampage ;
}
    