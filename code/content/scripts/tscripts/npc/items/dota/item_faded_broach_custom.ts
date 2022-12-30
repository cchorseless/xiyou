
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_faded_broach_custom = {"ID":"375","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_mana":"200"},"02":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"20"}}} ;

@registerAbility()
export class item_faded_broach_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_faded_broach";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_faded_broach_custom = Data_item_faded_broach_custom ;
};

    