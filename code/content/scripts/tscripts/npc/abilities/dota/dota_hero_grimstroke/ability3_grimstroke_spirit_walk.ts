
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_grimstroke_spirit_walk = {"ID":"8007","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellDispellableType":"SPELL_DISPELLABLE_YES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_ObsidianDestroyer.AstralImprisonment","FightRecapLevel":"1","HasShardUpgrade":"1","AbilityCooldown":"30 25 20 15","AbilityCastRange":"400 525 650 775","AbilityCastPoint":"0.15","AbilityManaCost":"120 130 140 150","AbilityModifierSupportValue":"0.75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","buff_duration":"3.0"},"02":{"var_type":"FIELD_INTEGER","movespeed_bonus_pct":"10 12 14 16","LinkedSpecialBonus":"special_bonus_unique_grimstroke_6"},"03":{"var_type":"FIELD_INTEGER","radius":"400","LinkedSpecialBonus":"special_bonus_unique_grimstroke_1"},"04":{"var_type":"FIELD_INTEGER","max_damage":"90 180 270 360","LinkedSpecialBonus":"special_bonus_unique_grimstroke_5"},"05":{"var_type":"FIELD_FLOAT","max_stun":"1.1 1.9 2.7 3.5"},"06":{"var_type":"FIELD_INTEGER","damage_per_tick":"5 7 9 11"},"07":{"var_type":"FIELD_FLOAT","tick_rate":"0.2"},"08":{"var_type":"FIELD_INTEGER","tick_dps_tooltip":"25 35 45 55"},"09":{"var_type":"FIELD_FLOAT","max_threshold_duration":"2.5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilityCastGestureSlot":"DEFAULT"} ;

@registerAbility()
export class ability3_grimstroke_spirit_walk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "grimstroke_spirit_walk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_grimstroke_spirit_walk = Data_grimstroke_spirit_walk ;
}
    