
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_vambrace_custom = {"ID":"329","ItemCost":"0","ItemShopTags":"","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","ItemRecipe":"1","ItemResult":"item_vambrace"} ;

@registerAbility()
export class item_recipe_vambrace_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_vambrace";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_vambrace_custom = Data_item_recipe_vambrace_custom ;
};

    