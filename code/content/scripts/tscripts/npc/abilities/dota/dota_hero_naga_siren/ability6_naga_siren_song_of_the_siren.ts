
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_naga_siren_song_of_the_siren = {"ID":"5470","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_NagaSiren.SongOfTheSiren","AbilityCastPoint":"1.0","AbilityCastRange":"1000 1200 1400","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"160.0 120.0 80.0","AbilityManaCost":"150 175 200","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"1000 1200 1400"},"02":{"var_type":"FIELD_FLOAT","duration":"7.0 7.0 7.0"},"03":{"var_type":"FIELD_FLOAT","animation_rate":"0.55 0.55 0.55"},"04":{"var_type":"FIELD_FLOAT","regen_rate":"10.0"},"05":{"var_type":"FIELD_FLOAT","regen_rate_self":"10.0"},"06":{"var_type":"FIELD_INTEGER","regen_rate_tooltip_scepter":"10","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","scepter_cooldown":"160.0 120.0 80.0","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_naga_siren_song_of_the_siren extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "naga_siren_song_of_the_siren";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_naga_siren_song_of_the_siren = Data_naga_siren_song_of_the_siren ;
}
    