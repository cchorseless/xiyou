
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_chaos_meteor = {"ID":"5385","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","MaxLevel":"1","HotKeyOverride":"D","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Invoker.ChaosMeteor.Impact","HasShardUpgrade":"1","AbilityCastRange":"700","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"55","AbilityManaCost":"200","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","burn_dps":"11.5 15 18.5 22 25.5 29 32.5 36","LinkedSpecialBonus":"special_bonus_unique_invoker_6","LinkedSpecialBonusOperation":"SPECIAL_BONUS_MULTIPLY","levelkey":"exortlevel","CalculateSpellDamageTooltip":"1"},"01":{"var_type":"FIELD_FLOAT","land_time":"1.3"},"02":{"var_type":"FIELD_INTEGER","area_of_effect":"275"},"03":{"var_type":"FIELD_INTEGER","travel_distance":"465 615 780 930 1095 1245 1410 1575","levelkey":"wexlevel"},"04":{"var_type":"FIELD_INTEGER","travel_speed":"300"},"05":{"var_type":"FIELD_FLOAT","damage_interval":"0.5","CalculateSpellDamageTooltip":"0"},"06":{"var_type":"FIELD_INTEGER","vision_distance":"500"},"07":{"var_type":"FIELD_FLOAT","end_vision_duration":"3.0"},"08":{"var_type":"FIELD_FLOAT","main_damage":"57.5 75 92.5 110 127.5 145 162.5 180","LinkedSpecialBonus":"special_bonus_unique_invoker_6","LinkedSpecialBonusOperation":"SPECIAL_BONUS_MULTIPLY","levelkey":"exortlevel"},"09":{"var_type":"FIELD_FLOAT","burn_duration":"3.0"}}} ;

@registerAbility()
export class ability12_invoker_chaos_meteor extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_chaos_meteor";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_chaos_meteor = Data_invoker_chaos_meteor ;
}
    