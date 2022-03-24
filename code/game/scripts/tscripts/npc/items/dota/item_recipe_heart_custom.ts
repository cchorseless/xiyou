
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_heart_custom = {"ID":"113","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1300","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_heart","ItemRequirements":{"01":"item_vitality_booster;item_reaver"}} ;

@registerAbility()
export class item_recipe_heart_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_heart";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_heart_custom = Data_item_recipe_heart_custom ;
};

    