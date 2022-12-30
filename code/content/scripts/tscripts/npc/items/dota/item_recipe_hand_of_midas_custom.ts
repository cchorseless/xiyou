
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_hand_of_midas_custom = {"ID":"64","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1750","ItemShopTags":"","ItemAliases":"hom","ItemRecipe":"1","ItemResult":"item_hand_of_midas","ItemRequirements":{"01":"item_gloves*"}} ;

@registerAbility()
export class item_recipe_hand_of_midas_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_hand_of_midas";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_hand_of_midas_custom = Data_item_recipe_hand_of_midas_custom ;
};

    