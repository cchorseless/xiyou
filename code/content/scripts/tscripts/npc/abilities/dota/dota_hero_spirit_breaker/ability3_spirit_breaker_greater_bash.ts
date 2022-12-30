
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_spirit_breaker_greater_bash = {"ID":"5355","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilitySound":"Hero_Spirit_Breaker.GreaterBash","AbilityCooldown":"1.5 1.5 1.5 1.5","AbilityModifierSupportBonus":"40","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","chance_pct":"17 17 17 17","LinkedSpecialBonus":"special_bonus_unique_spirit_breaker_1"},"02":{"var_type":"FIELD_FLOAT","damage":"14 20 26 32","LinkedSpecialBonus":"special_bonus_unique_spirit_breaker_3"},"03":{"var_type":"FIELD_FLOAT","duration":"0.9 1.2 1.5 1.8"},"04":{"var_type":"FIELD_FLOAT","knockback_duration":"0.5 0.5 0.5 0.5"},"05":{"var_type":"FIELD_INTEGER","knockback_distance":"143 152 158 162"},"06":{"var_type":"FIELD_INTEGER","knockback_height":"50 50 50 50"},"07":{"var_type":"FIELD_INTEGER","bonus_movespeed_pct":"17"},"08":{"var_type":"FIELD_FLOAT","movespeed_duration":"3.0 3.0 3.0 3.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_spirit_breaker_greater_bash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spirit_breaker_greater_bash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spirit_breaker_greater_bash = Data_spirit_breaker_greater_bash ;
}
    