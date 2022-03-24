
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_meepo_divided_we_stand = {"ID":"5433","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","DisplayAdditionalHeroes":"1","LevelsBetweenUpgrades":"7","RequiredLevel":"4","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","tooltip_clones":"1 2 3","LinkedSpecialBonus":"special_bonus_unique_meepo_5"},"02":{"var_type":"FIELD_INTEGER","tooltip_share_percentage":"20"},"03":{"var_type":"FIELD_INTEGER","tooltip_share_percentage_scepter":"100"},"04":{"var_type":"FIELD_FLOAT","respawn":"0.0"},"05":{"var_type":"FIELD_INTEGER","tooltip_respawn":"20"}}} ;

@registerAbility()
export class ability6_meepo_divided_we_stand extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "meepo_divided_we_stand";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_meepo_divided_we_stand = Data_meepo_divided_we_stand ;
}
    