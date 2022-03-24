
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_yasha_and_kaya_custom = {"ID":"274","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_yasha_and_kaya","ItemRequirements":{"01":"item_kaya;item_yasha"}} ;

@registerAbility()
export class item_recipe_yasha_and_kaya_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_yasha_and_kaya";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_yasha_and_kaya_custom = Data_item_recipe_yasha_and_kaya_custom ;
};

    