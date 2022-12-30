
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_sharpshooter = {"ID":"8106","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"1","AbilitySound":"Hero_Mirana.ArrowCast","AbilityCastRange":"3000","AbilityCastPoint":"0.0","AbilityCooldown":"45","AbilityManaCost":"125 175 225","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","max_slow_debuff_duration":"5.0"},"11":{"var_type":"FIELD_FLOAT","misfire_time":"5.0"},"12":{"var_type":"FIELD_INTEGER","slow_move_pct":"30 40 50"},"13":{"var_type":"FIELD_FLOAT","turn_rate":"60"},"14":{"var_type":"FIELD_FLOAT","base_power":"0.2"},"01":{"var_type":"FIELD_FLOAT","arrow_speed":"2200"},"02":{"var_type":"FIELD_INTEGER","arrow_width":"125"},"03":{"var_type":"FIELD_INTEGER","arrow_range":"3000"},"04":{"var_type":"FIELD_INTEGER","arrow_vision":"350"},"05":{"var_type":"FIELD_FLOAT","max_charge_time":"3.0","LinkedSpecialBonus":"special_bonus_unique_hoodwink_sharpshooter_speed"},"06":{"var_type":"FIELD_INTEGER","max_damage":"550 900 1250"},"07":{"var_type":"FIELD_INTEGER","recoil_distance":"350"},"08":{"var_type":"FIELD_INTEGER","recoil_height":"75"},"09":{"var_type":"FIELD_FLOAT","recoil_duration":"0.4"}},"AbilityCastAnimation":"ACT_DOTA_CHANNEL_ABILITY_6"} ;

@registerAbility()
export class ability6_hoodwink_sharpshooter extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_sharpshooter";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_sharpshooter = Data_hoodwink_sharpshooter ;
}
    