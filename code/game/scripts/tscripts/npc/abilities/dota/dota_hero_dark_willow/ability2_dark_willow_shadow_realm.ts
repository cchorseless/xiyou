
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_willow_shadow_realm = {"ID":"6341","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2","AbilityCastGestureSlot":"ABSOLUTE","HasScepterUpgrade":"1","AbilityCooldown":"26 22 18 14","AbilityCastPoint":"0","AbilityManaCost":"70 80 90 100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"5"},"02":{"var_type":"FIELD_INTEGER","damage":"90 180 270 360","LinkedSpecialBonus":"special_bonus_unique_dark_willow_1"},"03":{"var_type":"FIELD_INTEGER","attack_range_bonus":"600"},"04":{"var_type":"FIELD_FLOAT","max_damage_duration":"3.5","CalculateSpellDamageTooltip":"0"},"05":{"var_type":"FIELD_INTEGER","scepter_radius":"900","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability2_dark_willow_shadow_realm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_willow_shadow_realm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_willow_shadow_realm = Data_dark_willow_shadow_realm ;
}
    