
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ward_sentry_custom = {"ID":"43","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","Model":"models/props_gameplay/sentry_ward_bundle.vmdl","AbilityCastRange":"500","AbilityCastPoint":"0.0","AbilityCooldown":"1.0","ItemCost":"50","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"sentry ward","ItemStackable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemStockMax":"10","ItemStockInitial":"3","ItemStockTime":"75","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES","ItemSupport":"1","IsTempestDoubleClonable":"0","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","lifetime":"480"},"02":{"var_type":"FIELD_INTEGER","vision_range":"0"},"03":{"var_type":"FIELD_INTEGER","true_sight_range":"900"},"04":{"var_type":"FIELD_INTEGER","health":"200"},"05":{"var_type":"FIELD_INTEGER","duration_minutes_tooltip":"8"}}} ;

@registerAbility()
export class item_ward_sentry_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ward_sentry";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ward_sentry_custom = Data_item_ward_sentry_custom ;
};

    