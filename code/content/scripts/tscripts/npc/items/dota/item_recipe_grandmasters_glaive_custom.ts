
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_grandmasters_glaive_custom = {"ID":"653","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemPurchasable":"0","IsObsolete":"1","ItemRecipe":"1","ItemResult":"item_grandmasters_glaive","ItemRequirements":{}} ;

@registerAbility()
export class item_recipe_grandmasters_glaive_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_grandmasters_glaive";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_grandmasters_glaive_custom = Data_item_recipe_grandmasters_glaive_custom ;
};

    