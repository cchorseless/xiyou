
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_oracle_false_promise = {"ID":"5640","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Oracle.FalsePromise.Cast","HasShardUpgrade":"1","AbilityCastRange":"700 850 1000","AbilityCastPoint":"0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"120 90 60","AbilityManaCost":"100 150 200","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"8 9 10","LinkedSpecialBonus":"special_bonus_unique_oracle"},"02":{"var_type":"FIELD_FLOAT","radius":"400"}}} ;

@registerAbility()
export class ability6_oracle_false_promise extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "oracle_false_promise";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_oracle_false_promise = Data_oracle_false_promise ;
}
    