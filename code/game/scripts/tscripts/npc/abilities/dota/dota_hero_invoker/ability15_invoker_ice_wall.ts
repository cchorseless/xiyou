
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_ice_wall = {"ID":"5389","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","HotKeyOverride":"G","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Invoker.IceWall.Cast","AbilityCooldown":"25","AbilityManaCost":"175","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3.0 4.5 6.0 7.5 9.0 10.5 12.0 13.5","levelkey":"quaslevel"},"02":{"var_type":"FIELD_INTEGER","slow":"-20 -40 -60 -80 -100 -120 -140 -160","levelkey":"quaslevel"},"03":{"var_type":"FIELD_FLOAT","slow_duration":"2.0"},"04":{"var_type":"FIELD_FLOAT","damage_per_second":"6 12 18 24 30 36 42 48","LinkedSpecialBonus":"special_bonus_unique_invoker_13","levelkey":"exortlevel"},"05":{"var_type":"FIELD_INTEGER","wall_place_distance":"200"},"06":{"var_type":"FIELD_INTEGER","num_wall_elements":"15"},"07":{"var_type":"FIELD_INTEGER","wall_element_spacing":"80"},"08":{"var_type":"FIELD_INTEGER","wall_element_radius":"105"}}} ;

@registerAbility()
export class ability15_invoker_ice_wall extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_ice_wall";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_ice_wall = Data_invoker_ice_wall ;
}
    