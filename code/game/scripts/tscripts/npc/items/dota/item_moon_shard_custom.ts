
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_moon_shard_custom = {"ID":"247","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CUSTOM","ItemCost":"4000","ItemShopTags":"attack_speed","ItemQuality":"consumable","ItemAliases":"moon shard","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"140"},"02":{"var_type":"FIELD_INTEGER","bonus_night_vision":"400"},"03":{"var_type":"FIELD_INTEGER","consumed_bonus":"60"},"04":{"var_type":"FIELD_INTEGER","consumed_bonus_night_vision":"200"}}} ;

@registerAbility()
export class item_moon_shard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_moon_shard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_moon_shard_custom = Data_item_moon_shard_custom ;
};

    