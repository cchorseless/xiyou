
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_sheepstick_custom = {"ID":"95","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_sheepstick","ItemRequirements":{"01":"item_mystic_staff;item_ultimate_orb;item_void_stone"}} ;

@registerAbility()
export class item_recipe_sheepstick_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_sheepstick";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_sheepstick_custom = Data_item_recipe_sheepstick_custom ;
};

    