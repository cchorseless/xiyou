
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_penta_edged_sword_custom = {"ID":"638","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"45"},"02":{"var_type":"FIELD_INTEGER","melee_attack_range":"100"},"03":{"var_type":"FIELD_INTEGER","maim_chance":"25"},"04":{"var_type":"FIELD_INTEGER","maim_slow_movement":"20"},"05":{"var_type":"FIELD_INTEGER","maim_slow_attack":"60"},"06":{"var_type":"FIELD_FLOAT","maim_duration":"3"}}} ;

@registerAbility()
export class item_penta_edged_sword_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_penta_edged_sword";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_penta_edged_sword_custom = Data_item_penta_edged_sword_custom ;
};

    