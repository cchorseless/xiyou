
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_heavens_halberd_custom = {"ID":"209","ItemCost":"200","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_heavens_halberd","ItemRequirements":{"01":"item_sange;item_talisman_of_evasion"}} ;

@registerAbility()
export class item_recipe_heavens_halberd_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_heavens_halberd";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_heavens_halberd_custom = Data_item_recipe_heavens_halberd_custom ;
};

    