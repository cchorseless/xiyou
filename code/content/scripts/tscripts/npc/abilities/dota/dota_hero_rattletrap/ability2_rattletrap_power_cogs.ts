
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rattletrap_power_cogs = {"ID":"5238","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_Rattletrap.Power_Cogs","AbilityCastPoint":"0.2","AbilityCooldown":"15","AbilityManaCost":"80","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","bonus_armor":"0"},"01":{"var_type":"FIELD_FLOAT","duration":"5.0 6.0 7.0 8.0"},"02":{"var_type":"FIELD_INTEGER","damage":"50 125 200 275"},"03":{"var_type":"FIELD_INTEGER","mana_burn":"50 80 110 140"},"04":{"var_type":"FIELD_INTEGER","attacks_to_destroy":"2","LinkedSpecialBonus":"special_bonus_unique_clockwerk_5"},"05":{"var_type":"FIELD_INTEGER","push_length":"300"},"06":{"var_type":"FIELD_FLOAT","push_duration":"1"},"07":{"var_type":"FIELD_INTEGER","cogs_radius":"215"},"08":{"var_type":"FIELD_INTEGER","trigger_distance":"185"},"09":{"var_type":"FIELD_INTEGER","extra_pull_buffer":"-10"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_rattletrap_power_cogs extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rattletrap_power_cogs";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rattletrap_power_cogs = Data_rattletrap_power_cogs ;
}
    