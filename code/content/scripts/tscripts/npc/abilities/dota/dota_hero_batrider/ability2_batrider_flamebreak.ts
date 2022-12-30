
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_batrider_flamebreak = {"ID":"5321","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Batrider.Flamebreak","AbilityCastRange":"1300","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"18 17 16 15","AbilityManaCost":"110 120 130 140","AbilityModifierSupportValue":"1.0","HasShardUpgrade":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","knockback_duration":"0.35"},"01":{"var_type":"FIELD_INTEGER","damage_impact":"30 60 90 120"},"02":{"var_type":"FIELD_INTEGER","damage_per_second":"20"},"03":{"var_type":"FIELD_FLOAT","damage_duration":"2 4 6 8","CalculateSpellDamageTooltip":"0","LinkedSpecialBonus":"special_bonus_unique_batrider_3"},"04":{"var_type":"FIELD_INTEGER","explosion_radius":"500"},"05":{"var_type":"FIELD_INTEGER","collision_radius":"100 100 100 100"},"06":{"var_type":"FIELD_FLOAT","stun_duration":"0.5 0.5 0.5 0.5"},"07":{"var_type":"FIELD_INTEGER","speed":"1200"},"08":{"var_type":"FIELD_FLOAT","knockback_distance":"300"},"09":{"var_type":"FIELD_INTEGER","knockback_height":"100 100 100 100"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_batrider_flamebreak extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "batrider_flamebreak";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_batrider_flamebreak = Data_batrider_flamebreak ;
}
    