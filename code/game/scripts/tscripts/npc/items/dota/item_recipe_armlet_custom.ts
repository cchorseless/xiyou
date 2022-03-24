
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_armlet_custom = {"ID":"150","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"650","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_armlet","ItemRequirements":{"01":"item_helm_of_iron_will;item_gloves;item_blades_of_attack"}} ;

@registerAbility()
export class item_recipe_armlet_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_armlet";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_armlet_custom = Data_item_recipe_armlet_custom ;
};

    