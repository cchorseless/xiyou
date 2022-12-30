
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_warlock_rain_of_chaos = {"ID":"5165","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"2","HasScepterUpgrade":"1","AbilitySound":"Hero_Warlock.RainOfChaos","AbilityCastPoint":"0.5 0.5 0.5","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"170","AbilityManaCost":"250 375 500","AbilityCastRange":"1200","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","golem_dmg_tooltip_scepter":"75 110 150","RequiresScepter":"1"},"11":{"var_type":"FIELD_INTEGER","hp_dmg_reduction_scepter":"25","RequiresScepter":"1"},"12":{"var_type":"FIELD_INTEGER","bounty_reduction_scepter":"50","RequiresScepter":"1"},"01":{"var_type":"FIELD_FLOAT","golem_duration":"60 60 60"},"02":{"var_type":"FIELD_FLOAT","stun_duration":"1.0"},"03":{"var_type":"FIELD_INTEGER","aoe":"600"},"04":{"var_type":"FIELD_INTEGER","golem_hp_tooltip":"1000 2000 3000"},"05":{"var_type":"FIELD_INTEGER","golem_dmg_tooltip":"100 150 200"},"06":{"var_type":"FIELD_INTEGER","golem_armor_tooltip":"6 9 12","LinkedSpecialBonus":"special_bonus_unique_warlock_2"},"07":{"var_type":"FIELD_INTEGER","golem_regen_tooltip":"25 50 75"},"08":{"var_type":"FIELD_INTEGER","number_of_golems_scepter":"2","RequiresScepter":"1"},"09":{"var_type":"FIELD_INTEGER","golem_hp_tooltip_scepter":"750 1500 2250","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_warlock_rain_of_chaos extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "warlock_rain_of_chaos";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_warlock_rain_of_chaos = Data_warlock_rain_of_chaos ;
}
    