
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_kaya_and_sange_custom = {"ID":"272","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_kaya_and_sange","ItemRequirements":{"01":"item_sange;item_kaya"}} ;

@registerAbility()
export class item_recipe_kaya_and_sange_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_kaya_and_sange";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_kaya_and_sange_custom = Data_item_recipe_kaya_and_sange_custom ;
};

    