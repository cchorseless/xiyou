
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_abaddon_frostmourne = {"ID":"5587","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","HasShardUpgrade":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","slow_duration":"5"},"02":{"var_type":"FIELD_INTEGER","movement_speed":"10 15 20 25"},"03":{"var_type":"FIELD_INTEGER","hit_count":"4"},"04":{"var_type":"FIELD_FLOAT","curse_duration":"4.5"},"05":{"var_type":"FIELD_INTEGER","curse_slow":"15 30 45 60"},"06":{"var_type":"FIELD_INTEGER","curse_attack_speed":"40 60 80 100","LinkedSpecialBonus":"special_bonus_unique_abaddon_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_abaddon_frostmourne extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abaddon_frostmourne";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abaddon_frostmourne = Data_abaddon_frostmourne ;
}
    