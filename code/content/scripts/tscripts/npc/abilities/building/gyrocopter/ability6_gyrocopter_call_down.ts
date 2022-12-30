
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_gyrocopter_call_down = {"ID":"5364","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"2","AbilitySound":"Hero_Gyrocopter.CallDown.Fire","AbilityCastRange":"1000","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"90","AbilityManaCost":"125 125 125","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","missile_delay_tooltip":"2"},"01":{"var_type":"FIELD_INTEGER","slow_duration_first":"2"},"02":{"var_type":"FIELD_INTEGER","slow_duration_second":"4"},"03":{"var_type":"FIELD_INTEGER","damage_first":"150 250 350"},"04":{"var_type":"FIELD_INTEGER","damage_second":"200 275 350"},"05":{"var_type":"FIELD_FLOAT","slow_first":"30"},"06":{"var_type":"FIELD_FLOAT","slow_second":"60"},"07":{"var_type":"FIELD_INTEGER","radius":"600"},"08":{"var_type":"FIELD_INTEGER","range_scepter":"0"},"09":{"var_type":"FIELD_INTEGER","damage_second_scepter":"175 225 275"}}} ;

@registerAbility()
export class ability6_gyrocopter_call_down extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "gyrocopter_call_down";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_gyrocopter_call_down = Data_gyrocopter_call_down ;
}
    