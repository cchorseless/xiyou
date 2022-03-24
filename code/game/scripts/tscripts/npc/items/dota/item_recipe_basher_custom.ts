
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_basher_custom = {"ID":"142","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"900","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_basher","ItemRequirements":{"01":"item_mithril_hammer;item_belt_of_strength"}} ;

@registerAbility()
export class item_recipe_basher_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_basher";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_basher_custom = Data_item_recipe_basher_custom ;
};

    