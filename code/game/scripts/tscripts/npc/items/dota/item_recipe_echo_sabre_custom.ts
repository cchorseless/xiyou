
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_echo_sabre_custom = {"ID":"251","Model":"models/props_gameplay/recipe.vmdl","ItemCost":"0","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_echo_sabre","ItemRequirements":{"01":"item_ogre_axe;item_oblivion_staff"}} ;

@registerAbility()
export class item_recipe_echo_sabre_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_echo_sabre";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_echo_sabre_custom = Data_item_recipe_echo_sabre_custom ;
};

    