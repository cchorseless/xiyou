
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_kunkka_torrent_storm = {"ID":"319","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Ability.Torrent","AbilityCastPoint":"0.4","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilityCooldown":"70","AbilityManaCost":"250","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","torrent_interval":"0.25","RequiresScepter":"1"},"02":{"var_type":"FIELD_FLOAT","torrent_duration":"5.0","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","torrent_min_distance":"300","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","torrent_max_distance":"1100","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_kunkka_torrent_storm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_torrent_storm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_torrent_storm = Data_kunkka_torrent_storm ;
}
    