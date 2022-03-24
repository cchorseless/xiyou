
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ward_dispenser_custom = {"ID":"218","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","ItemCost":"50","ItemQuality":"common","ItemAliases":"ward","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPurchasable":"0","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_NEVER","IsTempestDoubleClonable":"0","AbilityCastRange":"500","AbilityCooldown":"0","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","sentry_duration_minutes_tooltip":"8"},"01":{"var_type":"FIELD_INTEGER","bonus_health":"100"},"02":{"var_type":"FIELD_INTEGER","observer_cost":"75"},"03":{"var_type":"FIELD_INTEGER","sentry_cost":"100"},"04":{"var_type":"FIELD_INTEGER","lifetime_observer":"360"},"05":{"var_type":"FIELD_INTEGER","lifetime_sentry":"480"},"06":{"var_type":"FIELD_FLOAT","creation_delay":"0"},"07":{"var_type":"FIELD_INTEGER","observer_vision_range_tooltip":"1600"},"08":{"var_type":"FIELD_INTEGER","observer_duration_minutes_tooltip":"6"},"09":{"var_type":"FIELD_INTEGER","true_sight_range":"900"}}} ;

@registerAbility()
export class item_ward_dispenser_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ward_dispenser";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ward_dispenser_custom = Data_item_ward_dispenser_custom ;
};

    