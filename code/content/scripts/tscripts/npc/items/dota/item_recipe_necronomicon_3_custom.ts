
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_necronomicon_3_custom = {"ID":"192","ItemCost":"0","ItemShopTags":"","ItemBaseLevel":"3","ShouldBeSuggested":"0","ItemPurchasable":"0","IsObsolete":"1","ItemRecipe":"1","ItemResult":"item_necronomicon_3","ItemRequirements":{"01":"item_necronomicon_2*;item_recipe_necronomicon"}} ;

@registerAbility()
export class item_recipe_necronomicon_3_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_necronomicon_3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_necronomicon_3_custom = Data_item_recipe_necronomicon_3_custom ;
};

    