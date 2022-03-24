
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_witch_blade_custom = {"ID":"533","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"600","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_witch_blade","ItemRequirements":{"01":"item_blitz_knuckles;item_robe;item_chainmail"}} ;

@registerAbility()
export class item_recipe_witch_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_witch_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_witch_blade_custom = Data_item_recipe_witch_blade_custom ;
};

    