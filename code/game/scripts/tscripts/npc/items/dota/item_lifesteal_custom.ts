
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_lifesteal_custom = {"ID":"26","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"900","ItemShopTags":"unique","ItemQuality":"component","ItemAliases":"morbid mask","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","lifesteal_percent":"15"}}} ;

@registerAbility()
export class item_lifesteal_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_lifesteal";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_lifesteal_custom = Data_item_lifesteal_custom ;
};

    