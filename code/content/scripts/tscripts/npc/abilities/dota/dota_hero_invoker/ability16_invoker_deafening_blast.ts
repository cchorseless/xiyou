
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_deafening_blast = {"ID":"5390","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","HotKeyOverride":"B","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Invoker.DeafeningBlast","AbilityCastRange":"1000","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"40","AbilityManaCost":"300","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","travel_distance":"1000"},"02":{"var_type":"FIELD_INTEGER","travel_speed":"1100"},"03":{"var_type":"FIELD_INTEGER","radius_start":"175"},"04":{"var_type":"FIELD_INTEGER","radius_end":"225"},"05":{"var_type":"FIELD_FLOAT","end_vision_duration":"1.75"},"06":{"var_type":"FIELD_FLOAT","damage":"40 80 120 160 200 240 280 320","levelkey":"exortlevel"},"07":{"var_type":"FIELD_FLOAT","knockback_duration":"0.25 0.5 0.75 1.0 1.25 1.5 1.75 2.0","levelkey":"quaslevel"},"08":{"var_type":"FIELD_FLOAT","disarm_duration":"1.25 2.0 2.75 3.5 4.25 5.0 5.75 6.5","levelkey":"wexlevel"}}} ;

@registerAbility()
export class ability16_invoker_deafening_blast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_deafening_blast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_deafening_blast = Data_invoker_deafening_blast ;
}
    