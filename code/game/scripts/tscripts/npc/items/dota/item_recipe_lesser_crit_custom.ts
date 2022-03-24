
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_lesser_crit_custom = {"ID":"148","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"500","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_lesser_crit","ItemRequirements":{"01":"item_broadsword;item_blades_of_attack"}} ;

@registerAbility()
export class item_recipe_lesser_crit_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_lesser_crit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_lesser_crit_custom = Data_item_recipe_lesser_crit_custom ;
};

    