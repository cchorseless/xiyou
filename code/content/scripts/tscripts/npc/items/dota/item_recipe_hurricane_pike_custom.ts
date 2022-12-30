
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_hurricane_pike_custom = {"ID":"262","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"450","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_hurricane_pike","ItemRequirements":{"01":"item_force_staff*;item_dragon_lance"}} ;

@registerAbility()
export class item_recipe_hurricane_pike_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_hurricane_pike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_hurricane_pike_custom = Data_item_recipe_hurricane_pike_custom ;
};

    