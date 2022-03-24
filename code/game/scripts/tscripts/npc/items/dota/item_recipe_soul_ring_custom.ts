
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_soul_ring_custom = {"ID":"177","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"225","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_soul_ring","ItemRequirements":{"01":"item_ring_of_protection;item_gauntlets;item_gauntlets"}} ;

@registerAbility()
export class item_recipe_soul_ring_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_soul_ring";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_soul_ring_custom = Data_item_recipe_soul_ring_custom ;
};

    