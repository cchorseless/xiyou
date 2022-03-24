
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_moon_shard_custom = {"ID":"246","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_moon_shard","ItemRequirements":{"01":"item_hyperstone;item_hyperstone"}} ;

@registerAbility()
export class item_recipe_moon_shard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_moon_shard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_moon_shard_custom = Data_item_recipe_moon_shard_custom ;
};

    