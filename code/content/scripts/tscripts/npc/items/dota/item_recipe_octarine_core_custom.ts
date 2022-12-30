
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_octarine_core_custom = {"ID":"228","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_octarine_core","ItemRequirements":{"01":"item_aether_lens;item_soul_booster"}} ;

@registerAbility()
export class item_recipe_octarine_core_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_octarine_core";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_octarine_core_custom = Data_item_recipe_octarine_core_custom ;
};

    