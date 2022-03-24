
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_naga_siren_ensnare = {"ID":"5468","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_NagaSiren.Ensnare.Cast","HasScepterUpgrade":"1","AbilityCastPoint":"0.4","AbilityCooldown":"23 20 17 14","AbilityManaCost":"70 80 90 100","AbilityCastRange":"575 600 625 650","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"2.75 3.5 4.25 5.0"},"02":{"var_type":"FIELD_INTEGER","net_speed":"1500"},"03":{"var_type":"FIELD_INTEGER","fake_ensnare_distance":"900 900 900 900"},"04":{"var_type":"FIELD_INTEGER","scepter_cooldown":"6"},"05":{"var_type":"FIELD_INTEGER","scepter_range":"400"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_naga_siren_ensnare extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "naga_siren_ensnare";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_naga_siren_ensnare = Data_naga_siren_ensnare ;
}
    