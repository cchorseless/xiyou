
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_ring_of_aquila_custom = {"ID":"211","ItemCost":"0","ItemShopTags":"","ItemPurchasable":"0","IsObsolete":"1","ItemRecipe":"1","ItemResult":"item_ring_of_aquila","ItemRequirements":{}} ;

@registerAbility()
export class item_recipe_ring_of_aquila_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_ring_of_aquila";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_ring_of_aquila_custom = Data_item_recipe_ring_of_aquila_custom ;
};

    