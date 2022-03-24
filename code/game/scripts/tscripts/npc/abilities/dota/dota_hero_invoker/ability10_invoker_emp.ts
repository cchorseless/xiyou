
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_emp = {"ID":"5383","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","MaxLevel":"1","HotKeyOverride":"C","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilitySound":"Hero_Invoker.EMP.Charge","AbilityCastRange":"950","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"30","AbilityManaCost":"125","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","delay":"2.9","levelkey":"wexlevel"},"02":{"var_type":"FIELD_INTEGER","area_of_effect":"675"},"03":{"var_type":"FIELD_INTEGER","mana_burned":"100 175 250 325 400 475 550 625","levelkey":"wexlevel"},"04":{"var_type":"FIELD_INTEGER","damage_per_mana_pct":"60"}}} ;

@registerAbility()
export class ability10_invoker_emp extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_emp";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_emp = Data_invoker_emp ;
}
    