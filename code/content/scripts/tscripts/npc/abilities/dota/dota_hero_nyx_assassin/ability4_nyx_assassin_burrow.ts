
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nyx_assassin_burrow = {"ID":"5666","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","AbilitySound":"Hero_NyxAssassin.Burrow.In","LinkedAbility":"nyx_assassin_unburrow","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","HasScepterUpgrade":"1","AbilityCastPoint":"1.5","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","health_regen_rate":"1.5","RequiresScepter":"1"},"02":{"var_type":"FIELD_FLOAT","mana_regen_rate":"1.5","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","damage_reduction":"50","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","impale_burn_range_increase_pct_tooltip":"75","RequiresScepter":"1"},"05":{"var_type":"FIELD_INTEGER","mana_burn_burrow_range_tooltip":"1050","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","impale_burrow_range_tooltip":"1225","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","impale_burrow_cooldown_tooltip":"7","RequiresScepter":"1"},"08":{"var_type":"FIELD_INTEGER","carapace_burrow_range_tooltip":"300","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_nyx_assassin_burrow extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nyx_assassin_burrow";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nyx_assassin_burrow = Data_nyx_assassin_burrow ;
}
    