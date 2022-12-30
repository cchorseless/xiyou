
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_flying_courier_custom = {"ID":"286","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES","ItemCost":"100","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"crow;flying courier","ItemStockMax":"1","ItemStockInitial":"0","ItemInitialStockTime":"270.0","ItemStockTime":"1","ItemSupport":"1","IsTempestDoubleClonable":"0","ItemPurchasable":"0"} ;

@registerAbility()
export class item_flying_courier_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_flying_courier";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_flying_courier_custom = Data_item_flying_courier_custom ;
};

    