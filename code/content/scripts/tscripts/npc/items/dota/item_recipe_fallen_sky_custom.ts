
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_fallen_sky_custom = {"ID":"317","ItemCost":"1","ItemShopTags":"","ItemIsNeutralDrop":"1","ItemPurchasable":"0","IsObsolete":"1","Model":"models/props_gameplay/neutral_box.vmdl","ItemRecipe":"1","ItemResult":"item_fallen_sky","ItemRequirements":{"01":"item_blink;item_meteor_hammer;"}} ;

@registerAbility()
export class item_recipe_fallen_sky_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_fallen_sky";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_fallen_sky_custom = Data_item_recipe_fallen_sky_custom ;
};

    