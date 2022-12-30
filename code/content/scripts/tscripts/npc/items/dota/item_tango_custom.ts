
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_tango_custom = {"ID":"44","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","Model":"models/props_gameplay/tango.vmdl","Effect":"particles/generic_gameplay/dropped_tango.vpcf","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE | DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityCastRange":"165","AbilityCastPoint":"0.0","ItemCost":"90","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"tango","ItemStackable":"1","ItemPermanent":"0","ItemInitialCharges":"3","IsTempestDoubleClonable":"0","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","health_regen":"7.0"},"02":{"var_type":"FIELD_FLOAT","buff_duration":"16.0"},"03":{"var_type":"FIELD_INTEGER","tooltip_charges":"3"}}} ;

@registerAbility()
export class item_tango_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_tango";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_tango_custom = Data_item_tango_custom ;
};

    