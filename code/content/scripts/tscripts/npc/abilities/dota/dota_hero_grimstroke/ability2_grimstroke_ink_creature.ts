
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_grimstroke_ink_creature = {"ID":"8006","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilityCastAnimation":"ACT_DOTA_GS_INK_CREATURE","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"900","AbilityCastPoint":"0.0","AbilityCooldown":"36 30 24 18","AbilityManaCost":"80 100 120 140","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","infection_search_radius":"1000"},"11":{"var_type":"FIELD_INTEGER","pop_damage":"120 200 280 360"},"12":{"var_type":"FIELD_INTEGER","return_projectile_speed":"750"},"13":{"var_type":"FIELD_INTEGER","latched_unit_offset":"130"},"14":{"var_type":"FIELD_INTEGER","latched_unit_offset_short":"95"},"01":{"var_type":"FIELD_FLOAT","spawn_time":"0.0"},"02":{"var_type":"FIELD_FLOAT","speed":"750"},"03":{"var_type":"FIELD_FLOAT","latch_duration":"5"},"04":{"var_type":"FIELD_INTEGER","destroy_attacks":"6 6 9 9","LinkedSpecialBonus":"special_bonus_unique_grimstroke_4"},"05":{"var_type":"FIELD_INTEGER","hero_attack_multiplier":"3"},"06":{"var_type":"FIELD_INTEGER","damage_per_tick":"5 10 15 20"},"07":{"var_type":"FIELD_INTEGER","dps_tooltip":"10 20 30 40","LinkedSpecialBonus":"special_bonus_unique_grimstroke_8"},"08":{"var_type":"FIELD_INTEGER","enemy_vision_time":"4"},"09":{"var_type":"FIELD_FLOAT","tick_interval":"0.5"}}} ;

@registerAbility()
export class ability2_grimstroke_ink_creature extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "grimstroke_ink_creature";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_grimstroke_ink_creature = Data_grimstroke_ink_creature ;
}
    