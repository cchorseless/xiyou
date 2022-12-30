
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_refresher_custom = {"ID":"109","Model":"models/props_gameplay/recipe.vmdl","FightRecapLevel":"2","ItemCost":"1700","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_refresher","ItemRequirements":{"01":"item_pers;item_pers"}} ;

@registerAbility()
export class item_recipe_refresher_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_refresher";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_refresher_custom = Data_item_recipe_refresher_custom ;
};

    