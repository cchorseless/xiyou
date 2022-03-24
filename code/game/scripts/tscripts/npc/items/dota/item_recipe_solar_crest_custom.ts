
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_solar_crest_custom = {"ID":"227","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"900","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_solar_crest","ItemRequirements":{"01":"item_medallion_of_courage*;item_crown;item_wind_lace"}} ;

@registerAbility()
export class item_recipe_solar_crest_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_solar_crest";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_solar_crest_custom = Data_item_recipe_solar_crest_custom ;
};

    