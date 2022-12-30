
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_lancer_doppelwalk = {"ID":"5066","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","FightRecapLevel":"1","AbilitySound":"Hero_PhantomLancer.Doppelganger.Cast","AbilityCastRange":"575","AbilityCastPoint":"0.1","AbilityCooldown":"25 20 15 10","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","illusion_1_damage_out_pct":"-100","CalculateSpellDamageTooltip":"0"},"02":{"var_type":"FIELD_INTEGER","illusion_1_damage_in_pct":"0","CalculateSpellDamageTooltip":"0"},"03":{"var_type":"FIELD_INTEGER","illusion_2_damage_out_pct":"-80","CalculateSpellDamageTooltip":"0"},"04":{"var_type":"FIELD_INTEGER","illusion_2_damage_in_pct":"500","CalculateSpellDamageTooltip":"0"},"05":{"var_type":"FIELD_INTEGER","target_aoe":"325"},"06":{"var_type":"FIELD_INTEGER","search_radius":"900"},"07":{"var_type":"FIELD_FLOAT","delay":"1"},"08":{"var_type":"FIELD_FLOAT","illusion_duration":"8"},"09":{"var_type":"FIELD_FLOAT","illusion_extended_duration":"2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_phantom_lancer_doppelwalk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_lancer_doppelwalk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_lancer_doppelwalk = Data_phantom_lancer_doppelwalk ;
}
    