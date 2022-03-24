
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_ancient_janggo_custom = {"ID":"184","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"550","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_ancient_janggo","ItemRequirements":{"01":"item_belt_of_strength;item_robe;item_wind_lace","02":"item_ancient_janggo"}} ;

@registerAbility()
export class item_recipe_ancient_janggo_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_ancient_janggo";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_ancient_janggo_custom = Data_item_recipe_ancient_janggo_custom ;
};

    