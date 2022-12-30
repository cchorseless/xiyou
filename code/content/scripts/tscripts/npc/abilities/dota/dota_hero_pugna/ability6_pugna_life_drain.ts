
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_pugna_life_drain = {"ID":"5189","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","HasShardUpgrade":"1","HasScepterUpgrade":"1","AbilityCastRange":"700","AbilityCastPoint":"0.2 0.2 0.2","AbilityChannelTime":"10.0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityChannelAnimation":"ACT_DOTA_CHANNEL_ABILITY_4","AbilityCooldown":"7","AbilityManaCost":"125 175 225","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health_drain":"150 225 300","CalculateSpellDamageTooltip":"1"},"02":{"var_type":"FIELD_INTEGER","scepter_health_drain":"200 300 400","RequiresScepter":"1"},"03":{"var_type":"FIELD_FLOAT","tick_rate":"0.25 0.25 0.25"},"04":{"var_type":"FIELD_INTEGER","drain_buffer":"200"},"05":{"var_type":"FIELD_INTEGER","scepter_cooldown":"0","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_pugna_life_drain extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pugna_life_drain";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pugna_life_drain = Data_pugna_life_drain ;
}
    