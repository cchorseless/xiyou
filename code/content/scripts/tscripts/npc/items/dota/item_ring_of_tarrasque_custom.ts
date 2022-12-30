
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ring_of_tarrasque_custom = {"ID":"279","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"650","ItemShopTags":"regen_health","ItemQuality":"component","ItemAliases":"rot","ShouldBeInitiallySuggested":"1","ItemPurchasable":"0","IsObsolete":"1","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"150"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"4"}}} ;

@registerAbility()
export class item_ring_of_tarrasque_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ring_of_tarrasque";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ring_of_tarrasque_custom = Data_item_ring_of_tarrasque_custom ;
};

    