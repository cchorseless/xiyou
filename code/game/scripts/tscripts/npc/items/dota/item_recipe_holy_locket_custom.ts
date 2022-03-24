
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_holy_locket_custom = {"ID":"268","ItemCost":"475","ItemShopTags":"","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","ItemRecipe":"1","ItemResult":"item_holy_locket","ItemRequirements":{"01":"item_headdress;item_fluffy_hat;item_energy_booster;item_magic_wand"}} ;

@registerAbility()
export class item_recipe_holy_locket_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_holy_locket";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_holy_locket_custom = Data_item_recipe_holy_locket_custom ;
};

    