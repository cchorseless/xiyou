
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_tpscroll_custom = {"ID":"46","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_NOASSIST | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_BUILDING","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_INVULNERABLE","Model":"models/props_gameplay/tpscroll01.vmdl","AbilityCastRange":"0","AbilityCooldown":"80.0","AbilitySharedCooldown":"teleport","AbilityChannelTime":"3.0","AbilityCastPoint":"0.0","AbilityManaCost":"75","ItemCost":"100","ItemShopTags":"consumable;tutorial","ItemQuality":"consumable","ItemAliases":"tp;town portal scroll;teleport","ItemStackable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemPurchasable":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","minimun_distance":"70"},"02":{"var_type":"FIELD_INTEGER","maximum_distance":"800"},"03":{"var_type":"FIELD_INTEGER","vision_radius":"200"},"04":{"var_type":"FIELD_FLOAT","tooltip_channel_time":"3.0"}}} ;

@registerAbility()
export class item_tpscroll_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_tpscroll";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_tpscroll_custom = Data_item_tpscroll_custom ;
};

    