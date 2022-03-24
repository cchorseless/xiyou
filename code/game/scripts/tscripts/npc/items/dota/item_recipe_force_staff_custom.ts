
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_force_staff_custom = {"ID":"101","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"950","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_force_staff","ItemRequirements":{"01":"item_staff_of_wizardry;item_fluffy_hat"}} ;

@registerAbility()
export class item_recipe_force_staff_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_force_staff";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_force_staff_custom = Data_item_recipe_force_staff_custom ;
};

    