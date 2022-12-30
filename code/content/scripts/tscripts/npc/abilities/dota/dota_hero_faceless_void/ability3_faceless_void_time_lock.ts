
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_faceless_void_time_lock = {"ID":"5184","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilitySound":"Hero_FacelessVoid.TimeLockImpact","AbilityModifierSupportBonus":"25","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"0.65"},"02":{"var_type":"FIELD_FLOAT","duration_creep":"2.0"},"03":{"var_type":"FIELD_INTEGER","chance_pct":"12 16 20 24"},"04":{"var_type":"FIELD_INTEGER","bonus_damage":"15 20 25 30","LinkedSpecialBonus":"special_bonus_unique_faceless_void_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_faceless_void_time_lock extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "faceless_void_time_lock";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_faceless_void_time_lock = Data_faceless_void_time_lock ;
}
    