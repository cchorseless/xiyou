
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_courier_custom = {"ID":"45","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES","ItemCost":"50","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"donkey;chicken;animal courier","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemStockMax":"1","ItemStockTime":"36000.0","ItemSupport":"1","ItemKillable":"0","ItemSellable":"0","IsTempestDoubleClonable":"0","ShouldBeInitiallySuggested":"0","ItemPurchasable":"0"} ;

@registerAbility()
export class item_courier_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_courier";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_courier_custom = Data_item_courier_custom ;
};

    