
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_spirit_vessel_custom = {"ID":"266","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1000","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_spirit_vessel","ItemRequirements":{"01":"item_urn_of_shadows*;item_vitality_booster"}} ;

@registerAbility()
export class item_recipe_spirit_vessel_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_spirit_vessel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_spirit_vessel_custom = Data_item_recipe_spirit_vessel_custom ;
};

    