
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_faerie_fire_custom = {"ID":"237","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityCastPoint":"0.0","AbilityCooldown":"5.0","ItemCost":"70","ItemShopTags":"damage","ItemQuality":"consumable","ItemAliases":"faerie fire","ItemStackable":"0","ItemPermanent":"0","ItemInitialCharges":"1","ItemHideCharges":"1","IsTempestDoubleClonable":"0","ShouldBeInitiallySuggested":"1","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"2"},"02":{"var_type":"FIELD_INTEGER","hp_restore":"85"}}} ;

@registerAbility()
export class item_faerie_fire_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_faerie_fire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_faerie_fire_custom = Data_item_faerie_fire_custom ;
};

    