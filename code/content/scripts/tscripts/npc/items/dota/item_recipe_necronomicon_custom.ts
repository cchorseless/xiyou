
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_necronomicon_custom = {"ID":"105","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1250","ItemShopTags":"","ShouldBeSuggested":"0","ItemPurchasable":"0","IsObsolete":"1","ItemRecipe":"1","ItemResult":"item_necronomicon","ItemRequirements":{"01":"item_sobi_mask;item_sobi_mask;item_belt_of_strength"}} ;

@registerAbility()
export class item_recipe_necronomicon_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_necronomicon";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_necronomicon_custom = Data_item_recipe_necronomicon_custom ;
};

    