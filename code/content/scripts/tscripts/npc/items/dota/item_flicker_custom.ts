
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_flicker_custom = {"ID":"335","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityCooldown":"4.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","max_range":"600"},"02":{"var_type":"FIELD_INTEGER","min_range":"200"},"03":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"35"}}} ;

@registerAbility()
export class item_flicker_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_flicker";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_flicker_custom = Data_item_flicker_custom ;
};

    