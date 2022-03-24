
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_recipe_ring_of_basilius_custom = {"ID":"87","ItemCost":"250","ItemShopTags":"","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","ItemRecipe":"1","ItemResult":"item_ring_of_basilius","ItemRequirements":{"01":"item_sobi_mask"}} ;

@registerAbility()
export class item_recipe_ring_of_basilius_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_recipe_ring_of_basilius";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_recipe_ring_of_basilius_custom = Data_item_recipe_ring_of_basilius_custom ;
};

    