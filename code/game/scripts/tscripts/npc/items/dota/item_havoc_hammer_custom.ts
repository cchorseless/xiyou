
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_havoc_hammer_custom = {"ID":"364","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"10.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","nuke_str_dmg":"1"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"12"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"12"},"03":{"var_type":"FIELD_INTEGER","range":"400"},"04":{"var_type":"FIELD_INTEGER","slow":"50"},"05":{"var_type":"FIELD_FLOAT","slow_duration":"3"},"06":{"var_type":"FIELD_INTEGER","angle":"360"},"07":{"var_type":"FIELD_FLOAT","knockback_duration":"0.3"},"08":{"var_type":"FIELD_FLOAT","knockback_distance":"250"},"09":{"var_type":"FIELD_INTEGER","nuke_base_dmg":"175"}}} ;

@registerAbility()
export class item_havoc_hammer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_havoc_hammer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_havoc_hammer_custom = Data_item_havoc_hammer_custom ;
};

    