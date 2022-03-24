
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_goblins_greed = {"ID":"5368","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityCastRange":"0","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","duration":"36"},"02":{"var_type":"FIELD_INTEGER","bonus_gold":"3"},"03":{"var_type":"FIELD_INTEGER","bonus_bonus_gold":"3"},"04":{"var_type":"FIELD_INTEGER","bonus_gold_cap":"15 18 21 24"},"05":{"var_type":"FIELD_FLOAT","bounty_multiplier":"1.5 2.0 2.5 3.0"}}} ;

@registerAbility()
export class ability3_alchemist_goblins_greed extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_goblins_greed";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_goblins_greed = Data_alchemist_goblins_greed ;
}
    