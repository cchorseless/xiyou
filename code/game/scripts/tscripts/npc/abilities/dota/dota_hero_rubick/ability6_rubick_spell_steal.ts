
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rubick_spell_steal = {"ID":"5452","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Rubick.SpellSteal.Cast","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"1","HasScepterUpgrade":"1","AbilityCastPoint":"0.1 0.1 0.1 0.1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_7","AbilityCooldown":"26 20 14","AbilityManaCost":"25 25 25","AbilityCastRange":"1000 1000 1000","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"180.0 240.0 300.0"},"02":{"var_type":"FIELD_INTEGER","projectile_speed":"900"},"03":{"var_type":"FIELD_INTEGER","cast_range_scepter":"1400","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","cooldown_scepter":"6 4 2","RequiresScepter":"1"},"05":{"var_type":"FIELD_INTEGER","stolen_debuff_amp":"10 20 30"}}} ;

@registerAbility()
export class ability6_rubick_spell_steal extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rubick_spell_steal";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rubick_spell_steal = Data_rubick_spell_steal ;
}
    