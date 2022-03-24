
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_oblivion_staff_custom = {"ID":"66","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_oblivion_staff","ItemRequirements":{"01":"item_quarterstaff;item_sobi_mask;item_robe"}} ;

@registerAbility()
export class item_recipe_oblivion_staff_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_oblivion_staff";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_oblivion_staff_custom = Data_item_recipe_oblivion_staff_custom ;
};

    