
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_monkey_king_bar_custom = {"ID":"134","ItemCost":"675","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_monkey_king_bar","ItemRequirements":{"01":"item_demon_edge;item_javelin;item_blitz_knuckles"}} ;

@registerAbility()
export class item_recipe_monkey_king_bar_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_monkey_king_bar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_monkey_king_bar_custom = Data_item_recipe_monkey_king_bar_custom ;
};

    