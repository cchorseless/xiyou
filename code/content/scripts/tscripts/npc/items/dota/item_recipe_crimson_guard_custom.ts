
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_crimson_guard_custom = {"ID":"243","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"950","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_crimson_guard","ItemRequirements":{"01":"item_vanguard;item_helm_of_iron_will"}} ;

@registerAbility()
export class item_recipe_crimson_guard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_crimson_guard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_crimson_guard_custom = Data_item_recipe_crimson_guard_custom ;
};

    