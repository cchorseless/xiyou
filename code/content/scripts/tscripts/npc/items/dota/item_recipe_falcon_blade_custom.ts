
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_falcon_blade_custom = {"ID":"599","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"225","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_falcon_blade","ItemRequirements":{"01":"item_fluffy_hat;item_sobi_mask;item_blades_of_attack"}} ;

@registerAbility()
export class item_recipe_falcon_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_falcon_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_falcon_blade_custom = Data_item_recipe_falcon_blade_custom ;
};

    