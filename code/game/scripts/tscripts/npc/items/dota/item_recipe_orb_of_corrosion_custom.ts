
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_orb_of_corrosion_custom = {"ID":"640","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"100","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_orb_of_corrosion","ItemRequirements":{"01":"item_orb_of_venom;item_blight_stone;item_fluffy_hat"}} ;

@registerAbility()
export class item_recipe_orb_of_corrosion_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_orb_of_corrosion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_orb_of_corrosion_custom = Data_item_recipe_orb_of_corrosion_custom ;
};

    