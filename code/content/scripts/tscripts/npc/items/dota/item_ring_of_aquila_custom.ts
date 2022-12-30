
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ring_of_aquila_custom = {"ID":"212","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE","AbilityCastRange":"1200","Model":"models/props_gameplay/neutral_box.vmdl","ItemCost":"0","ItemShopTags":"","ItemQuality":"rare","ItemAliases":"roa;ring of aquila","ItemShareability":"","ActiveDescriptionLine":"2","ItemPurchasable":"0","ShouldBeSuggested":"0","ItemSellable":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"7"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"3"},"03":{"var_type":"FIELD_INTEGER","bonus_agility":"9"},"04":{"var_type":"FIELD_INTEGER","bonus_intellect":"3"},"05":{"var_type":"FIELD_INTEGER","bonus_armor":"0"},"06":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"07":{"var_type":"FIELD_FLOAT","aura_mana_regen":"1.25"},"08":{"var_type":"FIELD_INTEGER","aura_bonus_armor":"2"}}} ;

@registerAbility()
export class item_ring_of_aquila_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ring_of_aquila";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ring_of_aquila_custom = Data_item_ring_of_aquila_custom ;
};

    