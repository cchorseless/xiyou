
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_bfury_custom = {"ID":"144","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_bfury","ItemRequirements":{"01":"item_broadsword;item_claymore;item_pers;item_quelling_blade*"}} ;

@registerAbility()
export class item_recipe_bfury_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_bfury";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_bfury_custom = Data_item_recipe_bfury_custom ;
};

    