
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_swift_blink_custom = {"ID":"607","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1750","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_swift_blink","ItemRequirements":{"01":"item_blink*;item_eagle"}} ;

@registerAbility()
export class item_recipe_swift_blink_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_swift_blink";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_swift_blink_custom = Data_item_recipe_swift_blink_custom ;
};

    