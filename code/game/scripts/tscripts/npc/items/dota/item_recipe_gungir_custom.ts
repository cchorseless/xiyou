
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_gungir_custom = {"ID":"1565","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"700","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_gungir","ItemRequirements":{"01":"item_maelstrom;item_rod_of_atos*"}} ;

@registerAbility()
export class item_recipe_gungir_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_gungir";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_gungir_custom = Data_item_recipe_gungir_custom ;
};

    