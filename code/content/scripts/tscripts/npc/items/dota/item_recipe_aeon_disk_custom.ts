
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_aeon_disk_custom = {"ID":"255","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"1200","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_aeon_disk","ItemRequirements":{"01":"item_vitality_booster;item_energy_booster"}} ;

@registerAbility()
export class item_recipe_aeon_disk_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_aeon_disk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_aeon_disk_custom = Data_item_recipe_aeon_disk_custom ;
};

    