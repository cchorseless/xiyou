
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nyx_assassin_spiked_carapace = {"ID":"5464","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_NyxAssassin.SpikedCarapace","AbilityCooldown":"25 20 15 10","AbilityCastPoint":"0 0 0 0","AbilityManaCost":"40 40 40 40","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","reflect_duration":"2.0"},"02":{"var_type":"FIELD_FLOAT","stun_duration":"0.6 1.2 1.8 2.4","LinkedSpecialBonus":"special_bonus_unique_nyx_6"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"0"},"04":{"var_type":"FIELD_INTEGER","bonus_armor":"0"},"05":{"var_type":"FIELD_INTEGER","bonus_intellect":"0"},"06":{"var_type":"FIELD_INTEGER","burrow_aoe":"300"},"07":{"var_type":"FIELD_INTEGER","damage_reflect_pct":"100","LinkedSpecialBonus":"special_bonus_unique_nyx"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_nyx_assassin_spiked_carapace extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nyx_assassin_spiked_carapace";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nyx_assassin_spiked_carapace = Data_nyx_assassin_spiked_carapace ;
}
    