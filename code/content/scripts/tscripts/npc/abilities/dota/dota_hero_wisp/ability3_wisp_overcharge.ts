
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_wisp_overcharge = {"ID":"5487","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityCastPoint":"0 0 0 0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"22 20 18 16","AbilityManaCost":"40 60 80 100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"50 70 90 110"},"02":{"var_type":"FIELD_INTEGER","bonus_spell_amp":"10 12 14 16"},"03":{"var_type":"FIELD_FLOAT","hp_regen":"0.5 0.6 0.7 0.8"},"04":{"var_type":"FIELD_FLOAT","duration":"8"}}} ;

@registerAbility()
export class ability3_wisp_overcharge extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "wisp_overcharge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_wisp_overcharge = Data_wisp_overcharge ;
}
    