
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_lotus_orb_custom = {"ID":"221","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_lotus_orb","ItemRequirements":{"01":"item_pers;item_platemail;item_energy_booster"}} ;

@registerAbility()
export class item_recipe_lotus_orb_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_lotus_orb";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_lotus_orb_custom = Data_item_recipe_lotus_orb_custom ;
};

    