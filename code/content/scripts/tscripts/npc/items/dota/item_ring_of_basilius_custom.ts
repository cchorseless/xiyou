
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ring_of_basilius_custom = {"ID":"88","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCastRange":"1200","ItemCost":"425","ItemShopTags":"regen_mana","ItemQuality":"rare","ItemAliases":"rob;ring of basilius","ShouldBeInitiallySuggested":"1","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","mana_regen":"0.5"},"02":{"var_type":"FIELD_FLOAT","aura_mana_regen":"1.0"},"03":{"var_type":"FIELD_INTEGER","aura_radius":"1200"}}} ;

@registerAbility()
export class item_ring_of_basilius_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ring_of_basilius";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ring_of_basilius_custom = Data_item_ring_of_basilius_custom ;
};

    