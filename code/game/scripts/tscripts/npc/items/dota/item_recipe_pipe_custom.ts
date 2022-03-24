
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_pipe_custom = {"ID":"89","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1550","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_pipe","ItemRequirements":{"01":"item_hood_of_defiance*;item_headdress"}} ;

@registerAbility()
export class item_recipe_pipe_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_pipe";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_pipe_custom = Data_item_recipe_pipe_custom ;
};

    