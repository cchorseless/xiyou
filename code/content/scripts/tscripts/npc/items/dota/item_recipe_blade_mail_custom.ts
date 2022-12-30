
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_blade_mail_custom = {"ID":"126","Model":"models/props_gameplay/recipe.vmdl","FightRecapLevel":"1","ItemCost":"575","ItemShopTags":"","ItemRecipe":"1","ItemResult":"item_blade_mail","ItemRequirements":{"01":"item_broadsword;item_chainmail"}} ;

@registerAbility()
export class item_recipe_blade_mail_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_blade_mail";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_blade_mail_custom = Data_item_recipe_blade_mail_custom ;
};

    