
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_soul_ring_custom = {"ID":"178","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityCooldown":"25.0","AbilityManaCost":"0","ItemCost":"680","ItemShopTags":"regen_health;boost_mana","ItemQuality":"common","ItemAliases":"soul ring","ItemDeclarations":"DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"6"},"02":{"var_type":"FIELD_FLOAT","bonus_armor":"2"},"03":{"var_type":"FIELD_INTEGER","health_sacrifice":"170"},"04":{"var_type":"FIELD_INTEGER","mana_gain":"150"},"05":{"var_type":"FIELD_INTEGER","duration":"10"}}} ;

@registerAbility()
export class item_soul_ring_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_soul_ring";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_soul_ring_custom = Data_item_soul_ring_custom ;
};

    