
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_bullwhip_custom = {"ID":"680","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityCastRange":"850","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCooldown":"11.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","bonus_health_regen":"3"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2.5"},"03":{"var_type":"FIELD_FLOAT","duration":"4"},"04":{"var_type":"FIELD_INTEGER","speed":"18"},"05":{"var_type":"FIELD_FLOAT","bullwhip_delay_time":"0.3"}}} ;

@registerAbility()
export class item_bullwhip_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_bullwhip";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_bullwhip_custom = Data_item_bullwhip_custom ;
};

    