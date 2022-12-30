
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mantle_custom = {"ID":"15","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"140","ItemShopTags":"int","ItemQuality":"component","ItemAliases":"mantle of intelligence","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"3"}}} ;

@registerAbility()
export class item_mantle_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mantle";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mantle_custom = Data_item_mantle_custom ;
};

    