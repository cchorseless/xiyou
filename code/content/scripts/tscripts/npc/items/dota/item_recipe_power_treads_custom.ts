
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_power_treads_custom = {"ID":"62","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_power_treads","ItemRequirements":{"01":"item_boots*;item_gloves;item_belt_of_strength","04":"item_boots*;item_gloves;item_robe","06":"item_boots*;item_gloves;item_boots_of_elves"}} ;

@registerAbility()
export class item_recipe_power_treads_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_power_treads";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_power_treads_custom = Data_item_recipe_power_treads_custom ;
};

    