
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shadow_demon_shadow_poison = {"ID":"5423","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_ShadowDemon.ShadowPoison","AbilityDuration":"10","AbilityCooldown":"2.5","AbilityCastRange":"1500","AbilityCastPoint":"0.25","AbilityManaCost":"35 40 45 50","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","stack_damage":"20 35 50 65","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_4","LinkedSpecialBonusOperation":"SPECIAL_BONUS_PERCENTAGE_ADD"},"02":{"var_type":"FIELD_INTEGER","max_multiply_stacks":"5"},"03":{"var_type":"FIELD_FLOAT","bonus_stack_damage":"50","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_4","LinkedSpecialBonusOperation":"SPECIAL_BONUS_PERCENTAGE_ADD"},"04":{"var_type":"FIELD_INTEGER","radius":"200"},"05":{"var_type":"FIELD_INTEGER","speed":"1000 1000 1000 1000"},"06":{"var_type":"FIELD_FLOAT","hit_damage":"26 34 42 50","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_4","LinkedSpecialBonusOperation":"SPECIAL_BONUS_PERCENTAGE_ADD"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_shadow_demon_shadow_poison extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_demon_shadow_poison";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_demon_shadow_poison = Data_shadow_demon_shadow_poison ;
}
    