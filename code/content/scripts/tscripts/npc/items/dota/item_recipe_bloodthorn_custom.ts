
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_bloodthorn_custom = {"ID":"245","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"800","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_bloodthorn","ItemRequirements":{"01":"item_orchid*;item_hyperstone"}} ;

@registerAbility()
export class item_recipe_bloodthorn_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_bloodthorn";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_bloodthorn_custom = Data_item_recipe_bloodthorn_custom ;
};

    