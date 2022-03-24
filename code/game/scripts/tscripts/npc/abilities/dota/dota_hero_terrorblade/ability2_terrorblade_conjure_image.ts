
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_terrorblade_conjure_image = {"ID":"5620","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilitySound":"Hero_Terrorblade.ConjureImage","AbilityCastPoint":"0.15","AbilityCooldown":"16","AbilityManaCost":"70 75 80 85","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","illusion_duration":"34.0","LinkedSpecialBonus":"special_bonus_unique_terrorblade_5"},"02":{"var_type":"FIELD_FLOAT","illusion_outgoing_damage":"-70 -60 -50 -40"},"03":{"var_type":"FIELD_FLOAT","illusion_outgoing_tooltip":"30 40 50 60"},"04":{"var_type":"FIELD_FLOAT","illusion_incoming_damage":"220.0"},"05":{"var_type":"FIELD_FLOAT","illusion_incoming_damage_total_tooltip":"320.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_terrorblade_conjure_image extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "terrorblade_conjure_image";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_terrorblade_conjure_image = Data_terrorblade_conjure_image ;
}
    