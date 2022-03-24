
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_helm_of_the_overlord_custom = {"ID":"633","ItemCost":"1600","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_helm_of_the_overlord","ItemRequirements":{"01":"item_helm_of_the_dominator;item_ultimate_orb"}} ;

@registerAbility()
export class item_recipe_helm_of_the_overlord_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_helm_of_the_overlord";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_helm_of_the_overlord_custom = Data_item_recipe_helm_of_the_overlord_custom ;
};

    