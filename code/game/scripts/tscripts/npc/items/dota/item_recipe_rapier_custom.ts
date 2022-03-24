
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_rapier_custom = {"ID":"132","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_rapier","ItemRequirements":{"01":"item_relic;item_demon_edge"}} ;

@registerAbility()
export class item_recipe_rapier_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_rapier";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_rapier_custom = Data_item_recipe_rapier_custom ;
};

    