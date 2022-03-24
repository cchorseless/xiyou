
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_gloves_of_travel_custom = {"ID":"570","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_speed":"20"},"02":{"var_type":"FIELD_INTEGER","tp_cooldown_reduction":"20"}}} ;

@registerAbility()
export class item_gloves_of_travel_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_gloves_of_travel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_gloves_of_travel_custom = Data_item_gloves_of_travel_custom ;
};

    