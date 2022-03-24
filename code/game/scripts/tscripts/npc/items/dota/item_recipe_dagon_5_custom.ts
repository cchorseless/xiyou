
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_dagon_5_custom = {"ID":"200","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_dagon_5","ItemRequirements":{"02":"item_dagon_4*;item_recipe_dagon"}} ;

@registerAbility()
export class item_recipe_dagon_5_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_dagon_5";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_dagon_5_custom = Data_item_recipe_dagon_5_custom ;
};

    