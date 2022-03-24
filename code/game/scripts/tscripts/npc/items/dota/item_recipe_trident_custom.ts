
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_trident_custom = {"ID":"275","ItemCost":"1","ItemShopTags":"","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","ItemRecipe":"1","ItemResult":"item_trident","ItemRequirements":{"01":"item_kaya;item_sange;item_yasha;","02":"item_kaya_and_sange;item_yasha;","03":"item_sange_and_yasha;item_kaya;","04":"item_yasha_and_kaya;item_sange;"}} ;

@registerAbility()
export class item_recipe_trident_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_trident";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_trident_custom = Data_item_recipe_trident_custom ;
};

    