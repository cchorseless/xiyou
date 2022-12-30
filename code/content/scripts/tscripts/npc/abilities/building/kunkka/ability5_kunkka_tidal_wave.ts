
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_kunkka_tidal_wave = {"ID":"605","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"1400","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"12","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","speed":"700"},"02":{"var_type":"FIELD_INTEGER","radius":"750"},"03":{"var_type":"FIELD_INTEGER","damage":"250"},"04":{"var_type":"FIELD_FLOAT","duration":"1.25"},"05":{"var_type":"FIELD_INTEGER","knockback_distance":"600"}}} ;

@registerAbility()
export class ability5_kunkka_tidal_wave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_tidal_wave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_tidal_wave = Data_kunkka_tidal_wave ;
}
    