
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_wisp_tether = {"ID":"5485","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","HasShardUpgrade":"1","AbilityCastPoint":"0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"12","AbilityManaCost":"40 40 40 40","AbilityCastRange":"1600","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"900 900 900 900"},"02":{"var_type":"FIELD_INTEGER","movespeed":"6 8 10 12"},"03":{"var_type":"FIELD_INTEGER","latch_distance":"700 700 700 700"},"04":{"var_type":"FIELD_INTEGER","latch_speed":"1000 1000 1000 1000"},"05":{"var_type":"FIELD_FLOAT","tether_heal_amp":"0.6 0.8 1.0 1.2"},"06":{"var_type":"FIELD_INTEGER","self_bonus":"0"},"07":{"var_type":"FIELD_INTEGER","slow":"15 25 35 45"},"08":{"var_type":"FIELD_FLOAT","slow_duration":"0.2"}}} ;

@registerAbility()
export class ability1_wisp_tether extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "wisp_tether";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_wisp_tether = Data_wisp_tether ;
}
    