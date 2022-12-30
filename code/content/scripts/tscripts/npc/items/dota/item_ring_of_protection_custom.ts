
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ring_of_protection_custom = {"ID":"12","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"175","ItemShopTags":"armor","ItemQuality":"component","ItemAliases":"rop;ring of protection","ShouldBeInitiallySuggested":"1","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","bonus_armor":"2"}}} ;

@registerAbility()
export class item_ring_of_protection_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ring_of_protection";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ring_of_protection_custom = Data_item_ring_of_protection_custom ;
};

    