
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_titan_sliver_custom = {"ID":"381","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","base_attack_damage":"20"},"02":{"var_type":"FIELD_INTEGER","magic_resistance":"16"},"03":{"var_type":"FIELD_INTEGER","status_resistance":"12"}}} ;

@registerAbility()
export class item_titan_sliver_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_titan_sliver";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_titan_sliver_custom = Data_item_titan_sliver_custom ;
};

    