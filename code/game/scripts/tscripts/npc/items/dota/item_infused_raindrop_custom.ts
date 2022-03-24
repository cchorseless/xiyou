
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_infused_raindrop_custom = {"ID":"265","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCastPoint":"0.0","AbilityCooldown":"7.0","ItemCost":"225","ItemShopTags":"armor","ItemQuality":"component","ItemAliases":"raindrop","ItemStackable":"0","ItemPermanent":"0","ItemInitialCharges":"6","ItemHideCharges":"0","ItemStockTime":"1","ItemStockInitial":"0","ItemStockMax":"1","ItemInitialStockTime":"270.0","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","mana_regen":"0.8"},"02":{"var_type":"FIELD_FLOAT","bonus_armor":"0"},"03":{"var_type":"FIELD_INTEGER","bonus_magical_armor":"0"},"04":{"var_type":"FIELD_INTEGER","magic_damage_block":"120"},"05":{"var_type":"FIELD_INTEGER","min_damage":"75"},"06":{"var_type":"FIELD_INTEGER","initial_charges":"6"}}} ;

@registerAbility()
export class item_infused_raindrop_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_infused_raindrop";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_infused_raindrop_custom = Data_item_infused_raindrop_custom ;
};

    