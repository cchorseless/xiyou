
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_eternal_shroud_custom = {"ID":"691","ItemCost":"1100","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_eternal_shroud","ItemRequirements":{"01":"item_voodoo_mask;item_hood_of_defiance"}} ;

@registerAbility()
export class item_recipe_eternal_shroud_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_eternal_shroud";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_eternal_shroud_custom = Data_item_recipe_eternal_shroud_custom ;
};

    