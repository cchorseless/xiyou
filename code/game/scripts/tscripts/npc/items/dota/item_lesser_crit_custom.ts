
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_lesser_crit_custom = {"ID":"149","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1950","ItemShopTags":"damage;crit","ItemQuality":"epic","ItemAliases":"crystalys","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"32"},"02":{"var_type":"FIELD_INTEGER","crit_chance":"30"},"03":{"var_type":"FIELD_INTEGER","crit_multiplier":"160"},"04":{"var_type":"FIELD_INTEGER","tooltip_crit_damage":"60"}}} ;

@registerAbility()
export class item_lesser_crit_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_lesser_crit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_lesser_crit_custom = Data_item_lesser_crit_custom ;
};

    