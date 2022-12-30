
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_ethereal_blade_custom = {"ID":"175","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_ethereal_blade","ItemRequirements":{"01":"item_eagle;item_ghost*"}} ;

@registerAbility()
export class item_recipe_ethereal_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_ethereal_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_ethereal_blade_custom = Data_item_recipe_ethereal_blade_custom ;
};

    