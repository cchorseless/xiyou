
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_hood_of_defiance_custom = {"ID":"130","ItemCost":"","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_hood_of_defiance","ItemRequirements":{"01":"item_ring_of_health;item_cloak;item_ring_of_regen"}} ;

@registerAbility()
export class item_recipe_hood_of_defiance_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_hood_of_defiance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_hood_of_defiance_custom = Data_item_recipe_hood_of_defiance_custom ;
};

    