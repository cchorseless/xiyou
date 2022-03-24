
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_ironwood_tree_custom = {"ID":"303","ItemCost":"1","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","ItemRecipe":"1","ItemResult":"item_ironwood_tree"} ;

@registerAbility()
export class item_recipe_ironwood_tree_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_ironwood_tree";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_ironwood_tree_custom = Data_item_recipe_ironwood_tree_custom ;
};

    