
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_invis_sword_custom = {"ID":"183","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_invis_sword","ItemRequirements":{"01":"item_shadow_amulet*;item_blitz_knuckles;item_broadsword"}} ;

@registerAbility()
export class item_recipe_invis_sword_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_invis_sword";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_invis_sword_custom = Data_item_recipe_invis_sword_custom ;
};

    