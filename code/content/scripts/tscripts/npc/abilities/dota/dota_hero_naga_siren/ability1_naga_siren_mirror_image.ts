
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_naga_siren_mirror_image = {"ID":"5467","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilitySound":"Hero_NagaSiren.MirrorImage","AbilityCastPoint":"0.65","AbilityCooldown":"40 36 32 28","AbilityManaCost":"70 85 100 115","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","illusion_duration":"26"},"02":{"var_type":"FIELD_INTEGER","outgoing_damage":"-75 -70 -65 -60","LinkedSpecialBonus":"special_bonus_unique_naga_siren_4"},"03":{"var_type":"FIELD_INTEGER","outgoing_damage_tooltip":"25 30 35 40","LinkedSpecialBonus":"special_bonus_unique_naga_siren_4"},"04":{"var_type":"FIELD_INTEGER","incoming_damage":"250"},"05":{"var_type":"FIELD_INTEGER","tooltip_incoming_damage_total_pct":"350"},"06":{"var_type":"FIELD_INTEGER","images_count":"3 3 3 3","LinkedSpecialBonus":"special_bonus_unique_naga_siren"},"07":{"var_type":"FIELD_FLOAT","invuln_duration":"0.3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_naga_siren_mirror_image extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "naga_siren_mirror_image";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_naga_siren_mirror_image = Data_naga_siren_mirror_image ;
}
    