
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_broodmother_spin_web = {"ID":"5280","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Broodmother.SpinWebCast","HasScepterUpgrade":"1","AbilityCastRange":"1000","AbilityCastPoint":"0.4","AbilityCooldown":"0.0","AbilityManaCost":"50","AbilityCharges":"3 5 7 9","AbilityChargeRestoreTime":"40","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"900"},"02":{"var_type":"FIELD_INTEGER","count":"3 5 7 9"},"03":{"var_type":"FIELD_INTEGER","heath_regen":"3 5 7 9"},"04":{"var_type":"FIELD_INTEGER","bonus_movespeed":"18 30 42 54"},"05":{"var_type":"FIELD_INTEGER","max_charges_scepter":"6 10 14 18","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","bonus_movespeed_scepter":"35 50 65 80","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","count_scepter":"6 10 14 18","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_broodmother_spin_web extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "broodmother_spin_web";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_broodmother_spin_web = Data_broodmother_spin_web ;
}
    