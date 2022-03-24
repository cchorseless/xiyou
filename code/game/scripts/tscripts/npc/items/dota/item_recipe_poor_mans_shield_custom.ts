
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_poor_mans_shield_custom = {"ID":"70","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","IsObsolete":"1","ItemRecipe":"1","ItemResult":"item_poor_mans_shield","ItemPurchasable":"0","ItemRequirements":{}} ;

@registerAbility()
export class item_recipe_poor_mans_shield_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_poor_mans_shield";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_poor_mans_shield_custom = Data_item_recipe_poor_mans_shield_custom ;
};

    