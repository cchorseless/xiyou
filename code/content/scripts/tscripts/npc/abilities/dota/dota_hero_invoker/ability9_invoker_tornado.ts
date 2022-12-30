
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_tornado = {"ID":"5382","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","HotKeyOverride":"X","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilitySound":"Hero_Invoker.Tornado","AbilityCastRange":"2000","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"30","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","travel_distance":"800 1200 1600 2000 2400 2800 3200 3600","levelkey":"wexlevel"},"02":{"var_type":"FIELD_INTEGER","travel_speed":"1000"},"03":{"var_type":"FIELD_INTEGER","area_of_effect":"200"},"04":{"var_type":"FIELD_INTEGER","vision_distance":"200"},"05":{"var_type":"FIELD_FLOAT","end_vision_duration":"1.75"},"06":{"var_type":"FIELD_FLOAT","lift_duration":"0.8 1.1 1.4 1.7 2.0 2.3 2.6 2.9","LinkedSpecialBonus":"special_bonus_unique_invoker_8","levelkey":"quaslevel"},"07":{"var_type":"FIELD_FLOAT","base_damage":"70"},"08":{"var_type":"FIELD_FLOAT","quas_damage":"0 0 0 0 0 0 0","levelkey":"quaslevel"},"09":{"var_type":"FIELD_FLOAT","wex_damage":"45 90 135 180 225 270 315 360","levelkey":"wexlevel"}}} ;

@registerAbility()
export class ability9_invoker_tornado extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_tornado";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_tornado = Data_invoker_tornado ;
}
    