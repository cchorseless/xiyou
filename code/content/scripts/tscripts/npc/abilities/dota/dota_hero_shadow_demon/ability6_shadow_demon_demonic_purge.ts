
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shadow_demon_demonic_purge = {"ID":"5425","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_INVULNERABLE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"2","HasScepterUpgrade":"1","HasShardUpgrade":"1","AbilitySound":"Hero_ShadowDemon.DemonicPurge.Cast","AbilityDuration":"7.0","AbilityCooldown":"60","AbilityCastRange":"800","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityManaCost":"150 175 200","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","purge_damage":"300 400 500","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_1"},"02":{"var_type":"FIELD_INTEGER","max_charges":"3","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","charge_restore_time":"60","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","charge_restore_time_tooltip_scepter":"60","RequiresScepter":"1"},"05":{"var_type":"FIELD_FLOAT","max_slow":"100.0"},"06":{"var_type":"FIELD_FLOAT","min_slow":"20.0"}}} ;

@registerAbility()
export class ability6_shadow_demon_demonic_purge extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_demon_demonic_purge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_demon_demonic_purge = Data_shadow_demon_demonic_purge ;
}
    