
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_travel_boots_2_custom = {"ID":"219","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_travel_boots_2","ItemRequirements":{"01":"item_travel_boots*;item_recipe_travel_boots"}} ;

@registerAbility()
export class item_recipe_travel_boots_2_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_travel_boots_2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_travel_boots_2_custom = Data_item_recipe_travel_boots_2_custom ;
};

    