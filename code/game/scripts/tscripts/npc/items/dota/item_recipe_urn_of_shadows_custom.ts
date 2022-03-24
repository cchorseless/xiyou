
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_urn_of_shadows_custom = {"ID":"91","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"335","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_urn_of_shadows","ItemRequirements":{"01":"item_sobi_mask;item_circlet;item_ring_of_protection"}} ;

@registerAbility()
export class item_recipe_urn_of_shadows_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_urn_of_shadows";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_urn_of_shadows_custom = Data_item_recipe_urn_of_shadows_custom ;
};

    