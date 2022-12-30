
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phoenix_sun_ray = {"ID":"5626","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Phoenix.SunRay.Cast","HasShardUpgrade":"1","AbilityCastRange":"1200","AbilityCastPoint":"0.01","AbilityCooldown":"30","AbilityDuration":"6.0","AbilityManaCost":"100 110 120 130","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","turn_rate":"25"},"01":{"var_type":"FIELD_INTEGER","hp_cost_perc_per_second":"6"},"02":{"var_type":"FIELD_INTEGER","base_damage":"14 20 26 32"},"03":{"var_type":"FIELD_FLOAT","hp_perc_damage":"1 2.75 4.5 6.25","LinkedSpecialBonus":"special_bonus_unique_phoenix_5"},"04":{"var_type":"FIELD_INTEGER","base_heal":"7 10 13 16"},"05":{"var_type":"FIELD_FLOAT","hp_perc_heal":"0.625 1.25 1.875 2.5"},"06":{"var_type":"FIELD_INTEGER","radius":"130"},"07":{"var_type":"FIELD_FLOAT","tick_interval":"0.2"},"08":{"var_type":"FIELD_FLOAT","forward_move_speed":"250"},"09":{"var_type":"FIELD_FLOAT","turn_rate_initial":"250"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_phoenix_sun_ray extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phoenix_sun_ray";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phoenix_sun_ray = Data_phoenix_sun_ray ;
}
    