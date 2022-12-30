
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_techies_land_mines = {"ID":"5599","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","HasScepterUpgrade":"1","AbilityCastRange":"100","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCooldown":"0","AbilityCharges":"3","AbilityChargeRestoreTime":"23","AbilityManaCost":"110 130 150 170","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"400"},"02":{"var_type":"FIELD_FLOAT","proximity_threshold":"1.6"},"03":{"var_type":"FIELD_INTEGER","damage":"200 400 600 800"},"04":{"var_type":"FIELD_FLOAT","burn_duration":"5"},"05":{"var_type":"FIELD_INTEGER","building_damage_pct":"25"},"06":{"var_type":"FIELD_FLOAT","activation_delay":"1.75"},"07":{"var_type":"FIELD_INTEGER","cast_range_scepter_bonus":"300","RequiresScepter":"1"},"08":{"var_type":"FIELD_FLOAT","AbilityChargeRestoreTime":"","LinkedSpecialBonus":"special_bonus_unique_techies_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_techies_land_mines extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "techies_land_mines";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_techies_land_mines = Data_techies_land_mines ;
}
    