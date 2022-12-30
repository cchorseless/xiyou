
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_treant_overgrowth = {"ID":"5437","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Treant.Overgrowth.Cast","AbilityCastPoint":"0.5 0.5 0.5 0.5","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","FightRecapLevel":"2","HasScepterUpgrade":"1","AbilityDraftUltScepterAbility":"treant_eyes_in_the_forest","AbilityCooldown":"100","AbilityManaCost":"200 250 300","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3.0 4.0 5.0"},"02":{"var_type":"FIELD_INTEGER","radius":"800","LinkedSpecialBonus":"special_bonus_unique_treant_5"},"03":{"var_type":"FIELD_INTEGER","eyes_radius":"800","LinkedSpecialBonus":"special_bonus_unique_treant_5"},"04":{"var_type":"FIELD_INTEGER","damage":"75","LinkedSpecialBonus":"special_bonus_unique_treant_11"}}} ;

@registerAbility()
export class ability6_treant_overgrowth extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "treant_overgrowth";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_treant_overgrowth = Data_treant_overgrowth ;
}
    