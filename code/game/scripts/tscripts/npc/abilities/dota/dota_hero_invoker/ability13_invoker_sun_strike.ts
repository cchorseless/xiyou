
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_sun_strike = {"ID":"5386","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","MaxLevel":"1","HotKeyOverride":"T","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","FightRecapLevel":"1","AbilitySound":"Hero_Invoker.SunStrike.Charge","HasScepterUpgrade":"1","AbilityCastRange":"0","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"25","AbilityManaCost":"175","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","delay":"1.7"},"02":{"var_type":"FIELD_INTEGER","area_of_effect":"175"},"03":{"var_type":"FIELD_FLOAT","damage":"100 162.5 225 287.5 350 412.5 475 537.5","levelkey":"exortlevel"},"04":{"var_type":"FIELD_INTEGER","vision_distance":"400"},"05":{"var_type":"FIELD_FLOAT","vision_duration":"4.0"},"06":{"var_type":"FIELD_INTEGER","cataclysm_cooldown":"100"},"07":{"var_type":"FIELD_INTEGER","cataclysm_min_range":"160"},"08":{"var_type":"FIELD_INTEGER","cataclysm_max_range":"200"}}} ;

@registerAbility()
export class ability13_invoker_sun_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_sun_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_sun_strike = Data_invoker_sun_strike ;
}
    