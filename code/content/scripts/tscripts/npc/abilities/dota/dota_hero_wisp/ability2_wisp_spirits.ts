
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_wisp_spirits = {"ID":"5486","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Wisp.Spirits.Cast","HasScepterUpgrade":"1","AbilityCastPoint":"0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"26.0 24.0 22.0 20.0","AbilityDuration":"19.0 19.0 19.0 19.0","AbilityManaCost":"120 130 140 150","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","spirit_duration":"19.0 19.0 19.0 19.0"},"01":{"var_type":"FIELD_INTEGER","creep_damage":"10 15 20 25"},"02":{"var_type":"FIELD_INTEGER","hero_damage":"30 50 70 90","LinkedSpecialBonus":"special_bonus_unique_wisp"},"03":{"var_type":"FIELD_FLOAT","revolution_time":"5.0 5.0 5.0 5.0"},"04":{"var_type":"FIELD_INTEGER","min_range":"200"},"05":{"var_type":"FIELD_INTEGER","max_range":"650","LinkedSpecialBonus":"special_bonus_unique_wisp_3"},"06":{"var_type":"FIELD_INTEGER","hero_hit_radius":"110"},"07":{"var_type":"FIELD_INTEGER","explode_radius":"360"},"08":{"var_type":"FIELD_INTEGER","hit_radius":"150 150 150 150"},"09":{"var_type":"FIELD_INTEGER","spirit_movement_rate":"250 250 250 250"}}} ;

@registerAbility()
export class ability2_wisp_spirits extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "wisp_spirits";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_wisp_spirits = Data_wisp_spirits ;
}
    