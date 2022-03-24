
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_batrider_firefly = {"ID":"5322","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCastGestureSlot":"DEFAULT","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCooldown":"40 38 36 34","AbilityManaCost":"125","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_per_second":"10 30 50 70"},"02":{"var_type":"FIELD_INTEGER","movement_speed":"3 6 9 12"},"03":{"var_type":"FIELD_INTEGER","radius":"200 200 200 200"},"04":{"var_type":"FIELD_FLOAT","duration":"15","LinkedSpecialBonus":"special_bonus_unique_batrider_1"},"05":{"var_type":"FIELD_FLOAT","tick_interval":"0.5 0.5 0.5 0.5"},"06":{"var_type":"FIELD_INTEGER","tree_radius":"100 100 100 100"},"07":{"var_type":"FIELD_INTEGER","bonus_vision":"200 400 600 800"}}} ;

@registerAbility()
export class ability3_batrider_firefly extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "batrider_firefly";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_batrider_firefly = Data_batrider_firefly ;
}
    