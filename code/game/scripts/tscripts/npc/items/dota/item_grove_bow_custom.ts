
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_grove_bow_custom = {"ID":"288","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","Model":"models/props_gameplay/neutral_box.vmdl","ItemCost":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","ItemPurchasable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_range_bonus":"100"},"02":{"var_type":"FIELD_INTEGER","attack_speed_bonus":"15"},"03":{"var_type":"FIELD_INTEGER","magic_resistance_reduction":"15"},"04":{"var_type":"FIELD_INTEGER","debuff_duration":"6"}}} ;

@registerAbility()
export class item_grove_bow_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_grove_bow";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_grove_bow_custom = Data_item_grove_bow_custom ;
};

    