
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_medallion_of_courage_custom = {"ID":"186","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_medallion_of_courage","ItemRequirements":{"01":"item_chainmail;item_sobi_mask;item_blight_stone"}} ;

@registerAbility()
export class item_recipe_medallion_of_courage_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_medallion_of_courage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_medallion_of_courage_custom = Data_item_recipe_medallion_of_courage_custom ;
};

    