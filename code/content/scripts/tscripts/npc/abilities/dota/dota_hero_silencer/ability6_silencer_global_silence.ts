
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_silencer_global_silence = {"ID":"5380","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"2","AbilitySound":"Hero_Silencer.GlobalSilence.Cast","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"130 115 100","AbilityDuration":"4.5 5.25 6.0","AbilityManaCost":"300 450 600","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","abilityduration":"","LinkedSpecialBonus":"special_bonus_unique_silencer_4"}}} ;

@registerAbility()
export class ability6_silencer_global_silence extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "silencer_global_silence";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_silencer_global_silence = Data_silencer_global_silence ;
}
    