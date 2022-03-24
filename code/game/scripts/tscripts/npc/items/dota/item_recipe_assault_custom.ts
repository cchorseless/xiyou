
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_assault_custom = {"ID":"111","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1300","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_assault","ItemRequirements":{"01":"item_platemail;item_hyperstone;item_buckler"}} ;

@registerAbility()
export class item_recipe_assault_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_assault";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_assault_custom = Data_item_recipe_assault_custom ;
};

    