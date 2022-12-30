
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_orb_of_destruction_custom = {"ID":"378","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","armor_reduction":"4"},"02":{"var_type":"FIELD_INTEGER","slow_melee":"25"},"03":{"var_type":"FIELD_INTEGER","slow_range":"15"},"04":{"var_type":"FIELD_FLOAT","duration":"4"}}} ;

@registerAbility()
export class item_orb_of_destruction_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_orb_of_destruction";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_orb_of_destruction_custom = Data_item_orb_of_destruction_custom ;
};

    