
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phoenix_icarus_dive = {"ID":"5623","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Phoenix.IcarusDive.Cast","AbilityCastPoint":"0.2","AbilityCooldown":"36 34 32 30","AbilityManaCost":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","hp_cost_perc":"15"},"02":{"var_type":"FIELD_INTEGER","dash_length":"1400","LinkedSpecialBonus":"special_bonus_unique_phoenix_4"},"03":{"var_type":"FIELD_INTEGER","dash_width":"500"},"04":{"var_type":"FIELD_INTEGER","hit_radius":"200"},"05":{"var_type":"FIELD_FLOAT","burn_duration":"4"},"06":{"var_type":"FIELD_INTEGER","damage_per_second":"10 30 50 70"},"07":{"var_type":"FIELD_FLOAT","burn_tick_interval":"1.0"},"08":{"var_type":"FIELD_INTEGER","slow_movement_speed_pct":"19 22 25 28","LinkedSpecialBonus":"special_bonus_unique_phoenix_6"},"09":{"var_type":"FIELD_FLOAT","dive_duration":"2.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_phoenix_icarus_dive extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phoenix_icarus_dive";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phoenix_icarus_dive = Data_phoenix_icarus_dive ;
}
    