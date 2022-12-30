
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_woodland_striders_custom = {"ID":"368","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"20.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"140"},"02":{"var_type":"FIELD_INTEGER","bonus_hp_regen":"60"},"03":{"var_type":"FIELD_FLOAT","active_duration":"3"},"04":{"var_type":"FIELD_FLOAT","tree_duration":"15"}}} ;

@registerAbility()
export class item_woodland_striders_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_woodland_striders";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_woodland_striders_custom = Data_item_woodland_striders_custom ;
};

    