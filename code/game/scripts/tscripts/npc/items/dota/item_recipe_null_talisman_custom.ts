
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_null_talisman_custom = {"ID":"76","ItemCost":"210","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_null_talisman","ItemRequirements":{"01":"item_circlet;item_mantle"}} ;

@registerAbility()
export class item_recipe_null_talisman_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_null_talisman";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_null_talisman_custom = Data_item_recipe_null_talisman_custom ;
};

    