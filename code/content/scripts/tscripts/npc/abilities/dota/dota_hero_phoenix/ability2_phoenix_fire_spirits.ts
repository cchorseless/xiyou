
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phoenix_fire_spirits = {"ID":"5625","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Phoenix.FireSpirits.Cast","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"1400","AbilityCooldown":"51 44 37 30","AbilityManaCost":"120","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","hp_cost_perc":"20"},"02":{"var_type":"FIELD_FLOAT","spirit_duration":"20"},"03":{"var_type":"FIELD_INTEGER","spirit_speed":"900 900 900 900"},"04":{"var_type":"FIELD_INTEGER","radius":"175 175 175 175"},"05":{"var_type":"FIELD_FLOAT","duration":"4.0"},"06":{"var_type":"FIELD_INTEGER","attackspeed_slow":"-80 -100 -120 -140"},"07":{"var_type":"FIELD_INTEGER","damage_per_second":"15 35 55 75","LinkedSpecialBonus":"special_bonus_unique_phoenix_3"},"08":{"var_type":"FIELD_INTEGER","spirit_count":"5"},"09":{"var_type":"FIELD_FLOAT","tick_interval":"1.0"}}} ;

@registerAbility()
export class ability2_phoenix_fire_spirits extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phoenix_fire_spirits";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phoenix_fire_spirits = Data_phoenix_fire_spirits ;
}
    