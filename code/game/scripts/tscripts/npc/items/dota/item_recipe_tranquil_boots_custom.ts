
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_tranquil_boots_custom = {"ID":"213","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_tranquil_boots","ItemRequirements":{"01":"item_boots;item_wind_lace;item_ring_of_regen"}} ;

@registerAbility()
export class item_recipe_tranquil_boots_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_tranquil_boots";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_tranquil_boots_custom = Data_item_recipe_tranquil_boots_custom ;
};

    