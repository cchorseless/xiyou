
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phoenix_launch_fire_spirit = {"ID":"5631","AbilityType":"DOTA_ABILITY_TYPE_BASIC","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_HIDDEN","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_Phoenix.FireSpirits.Launch","AbilityCastRange":"1400","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"0 0 0 0","AbilityManaCost":"0 0 0 0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","hp_cost_perc":"20"},"02":{"var_type":"FIELD_FLOAT","spirit_duration":"20.0 20.0 20.0 20.0"},"03":{"var_type":"FIELD_INTEGER","spirit_speed":"900 900 900 900"},"04":{"var_type":"FIELD_INTEGER","radius":"175 175 175 175"},"05":{"var_type":"FIELD_FLOAT","duration":"4.0"},"06":{"var_type":"FIELD_INTEGER","attackspeed_slow":"-80 -100 -120 -140"},"07":{"var_type":"FIELD_INTEGER","damage_per_second":"15 35 55 75","LinkedSpecialBonus":"special_bonus_unique_phoenix_3"},"08":{"var_type":"FIELD_INTEGER","spirit_count":"5"},"09":{"var_type":"FIELD_FLOAT","tick_interval":"1.0"}}} ;

@registerAbility()
export class ability7_phoenix_launch_fire_spirit extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phoenix_launch_fire_spirit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phoenix_launch_fire_spirit = Data_phoenix_launch_fire_spirit ;
}
    