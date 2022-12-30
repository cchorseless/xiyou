
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_silver_edge_custom = {"ID":"248","ItemCost":"1100","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_silver_edge","ItemRequirements":{"01":"item_invis_sword*;item_oblivion_staff"}} ;

@registerAbility()
export class item_recipe_silver_edge_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_silver_edge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_silver_edge_custom = Data_item_recipe_silver_edge_custom ;
};

    