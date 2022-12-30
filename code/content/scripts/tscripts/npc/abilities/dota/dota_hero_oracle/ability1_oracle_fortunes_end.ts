
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_oracle_fortunes_end = {"ID":"5637","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_INVULNERABLE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Oracle.FortunesEnd.Target","AbilityCastRange":"850","AbilityCastPoint":"0","AbilityCooldown":"15 12 9 6","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","channel_time":"2.5","LinkedSpecialBonus":"special_bonus_unique_oracle_7","LinkedSpecialBonusOperation":"SPECIAL_BONUS_SUBTRACT"},"02":{"var_type":"FIELD_INTEGER","damage":"100 160 220 280"},"03":{"var_type":"FIELD_INTEGER","bolt_speed":"1000"},"04":{"var_type":"FIELD_FLOAT","minimum_purge_duration":"0.5","LinkedSpecialBonus":"special_bonus_unique_oracle_2"},"05":{"var_type":"FIELD_FLOAT","maximum_purge_duration":"2.5","LinkedSpecialBonus":"special_bonus_unique_oracle_2"},"06":{"var_type":"FIELD_INTEGER","radius":"300"},"07":{"var_type":"FIELD_INTEGER","scepter_bonus_range":"800","RequiresScepter":"1"},"08":{"var_type":"FIELD_INTEGER","scepter_bonus_radius":"150","RequiresScepter":"1"},"09":{"var_type":"FIELD_INTEGER","scepter_stun_percentage":"50","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_oracle_fortunes_end extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "oracle_fortunes_end";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_oracle_fortunes_end = Data_oracle_fortunes_end ;
}
    