
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_mage_slayer_custom = {"ID":"597","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"400","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_mage_slayer","ItemRequirements":{"01":"item_cloak;item_blade_of_alacrity;item_claymore"}} ;

@registerAbility()
export class item_recipe_mage_slayer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_mage_slayer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_mage_slayer_custom = Data_item_recipe_mage_slayer_custom ;
};

    