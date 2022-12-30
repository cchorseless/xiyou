
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_lancer_spirit_lance = {"ID":"5065","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_PhantomLancer.SpiritLance.Throw","HasShardUpgrade":"1","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"7","AbilityManaCost":"120","AbilityCastRange":"525 600 675 750","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","fake_lance_distance":"675"},"01":{"var_type":"FIELD_INTEGER","lance_damage":"100 160 220 280","LinkedSpecialBonus":"special_bonus_unique_phantom_lancer_2"},"02":{"var_type":"FIELD_INTEGER","lance_speed":"1000 1000 1000 1000"},"03":{"var_type":"FIELD_FLOAT","duration":"3.25"},"04":{"var_type":"FIELD_INTEGER","movement_speed_pct":"-10 -18 -26 -34"},"05":{"var_type":"FIELD_FLOAT","illusion_duration":"2.0 4.0 6.0 8.0"},"06":{"var_type":"FIELD_INTEGER","illusion_damage_out_pct":"-80","CalculateSpellDamageTooltip":"0"},"07":{"var_type":"FIELD_INTEGER","tooltip_illusion_damage":"20","CalculateSpellDamageTooltip":"0"},"08":{"var_type":"FIELD_INTEGER","illusion_damage_in_pct":"300 300 300 300","CalculateSpellDamageTooltip":"0"},"09":{"var_type":"FIELD_INTEGER","tooltip_illusion_total_damage_in_pct":"400 400 400 400","CalculateSpellDamageTooltip":"0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_phantom_lancer_spirit_lance extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_lancer_spirit_lance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_lancer_spirit_lance = Data_phantom_lancer_spirit_lance ;
}
    