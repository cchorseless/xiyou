
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_silencer_curse_of_the_silent = {"ID":"5377","AbilityType":"DOTA_ABILITY_TYPE_BASIC","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Silencer.Curse.Cast","AbilityCastRange":"1000","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"20 18 16 14","AbilityManaCost":"125 130 135 140","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"16 24 32 40","LinkedSpecialBonus":"special_bonus_unique_silencer"},"02":{"var_type":"FIELD_INTEGER","radius":"425"},"03":{"var_type":"FIELD_INTEGER","duration":"6"},"04":{"var_type":"FIELD_INTEGER","penalty_duration":"5"},"05":{"var_type":"FIELD_INTEGER","movespeed":"-9 -12 -15 -18","LinkedSpecialBonus":"special_bonus_unique_silencer_6","LinkedSpecialBonusOperation":"SPECIAL_BONUS_SUBTRACT"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_silencer_curse_of_the_silent extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "silencer_curse_of_the_silent";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_silencer_curse_of_the_silent = Data_silencer_curse_of_the_silent ;
}
    