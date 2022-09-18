
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_troll_warlord_whirling_axes_ranged = {"ID":"5509","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_TrollWarlord.WhirlingAxes.Ranged","HasScepterUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_WHIRLING_AXES_RANGED","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"950","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"9","AbilityManaCost":"60","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","axe_width":"100"},"02":{"var_type":"FIELD_FLOAT","axe_speed":"1500.0"},"03":{"var_type":"FIELD_FLOAT","axe_range":"950.0"},"04":{"var_type":"FIELD_INTEGER","axe_damage":"75","LinkedSpecialBonus":"special_bonus_unique_troll_warlord_3"},"05":{"var_type":"FIELD_FLOAT","axe_slow_duration":"2.5 3 3.5 4"},"06":{"var_type":"FIELD_INTEGER","movement_speed":"40"},"07":{"var_type":"FIELD_INTEGER","axe_spread":"25"},"08":{"var_type":"FIELD_INTEGER","axe_count":"5"},"09":{"var_type":"FIELD_FLOAT","scepter_cooldown":"4"}}} ;

@registerAbility()
export class ability2_troll_warlord_whirling_axes_ranged extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "troll_warlord_whirling_axes_ranged";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_troll_warlord_whirling_axes_ranged = Data_troll_warlord_whirling_axes_ranged ;
}
    