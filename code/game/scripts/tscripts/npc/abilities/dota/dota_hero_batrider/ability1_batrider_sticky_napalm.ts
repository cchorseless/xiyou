
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_batrider_sticky_napalm = {"ID":"5320","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Batrider.StickyNapalm.Impact","AbilityCastRange":"550 600 650 700","AbilityCastPoint":"0","AbilityCooldown":"3.0 3.0 3.0 3.0","AbilityManaCost":"20","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"6 12 18 24","LinkedSpecialBonus":"special_bonus_unique_batrider_4","CalculateSpellDamageTooltip":"1"},"02":{"var_type":"FIELD_INTEGER","radius":"375 400 425 450"},"03":{"var_type":"FIELD_FLOAT","duration":"8"},"04":{"var_type":"FIELD_INTEGER","movement_speed_pct":"-2 -4 -6 -8","LinkedSpecialBonus":"special_bonus_unique_batrider_7","LinkedSpecialBonusOperation":"SPECIAL_BONUS_SUBTRACT"},"05":{"var_type":"FIELD_INTEGER","turn_rate_pct":"-10 -30 -50 -70"},"06":{"var_type":"FIELD_INTEGER","max_stacks":"10 10 10 10"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_batrider_sticky_napalm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "batrider_sticky_napalm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_batrider_sticky_napalm = Data_batrider_sticky_napalm ;
}
    