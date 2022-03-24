
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_soul_booster_custom = {"ID":"128","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_soul_booster","ItemRequirements":{"01":"item_vitality_booster;item_energy_booster;item_point_booster"}} ;

@registerAbility()
export class item_recipe_soul_booster_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_soul_booster";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_soul_booster_custom = Data_item_recipe_soul_booster_custom ;
};

    