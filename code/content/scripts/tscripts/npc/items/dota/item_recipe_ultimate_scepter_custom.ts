
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_ultimate_scepter_custom = {"ID":"107","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_ultimate_scepter","ItemRequirements":{"01":"item_point_booster;item_staff_of_wizardry;item_ogre_axe;item_blade_of_alacrity"}} ;

@registerAbility()
export class item_recipe_ultimate_scepter_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_ultimate_scepter";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_ultimate_scepter_custom = Data_item_recipe_ultimate_scepter_custom ;
};

    