
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_travel_boots_2_custom = {"ID":"220","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_INVULNERABLE","ItemCost":"4500","ItemShopTags":"teleport;move_speed","ItemQuality":"common","ItemAliases":"bot;boots of travel;tp","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","MaxUpgradeLevel":"2","ItemBaseLevel":"2","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"120"},"02":{"var_type":"FIELD_INTEGER","maximum_distance":"800"},"03":{"var_type":"FIELD_INTEGER","vision_radius":"200"},"04":{"var_type":"FIELD_INTEGER","tp_cooldown":"30"}}} ;

@registerAbility()
export class item_travel_boots_2_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_travel_boots_2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_travel_boots_2_custom = Data_item_travel_boots_2_custom ;
};

    