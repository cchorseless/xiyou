
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_naga_siren_rip_tide = {"ID":"5469","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_NagaSiren.Riptide.Cast","HasShardUpgrade":"1","AbilityCastPoint":"0 0 0 0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","chance":"17"},"02":{"var_type":"FIELD_INTEGER","armor_reduction":"-2 -4 -6 -8","LinkedSpecialBonus":"special_bonus_unique_naga_siren_3"},"03":{"var_type":"FIELD_INTEGER","damage":"30 40 50 60"},"04":{"var_type":"FIELD_INTEGER","radius":"300"},"05":{"var_type":"FIELD_FLOAT","duration":"4.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_naga_siren_rip_tide extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "naga_siren_rip_tide";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_naga_siren_rip_tide = Data_naga_siren_rip_tide ;
}
    