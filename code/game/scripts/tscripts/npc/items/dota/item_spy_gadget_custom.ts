
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_spy_gadget_custom = {"ID":"336","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","scan_cooldown_reduction":"50"},"02":{"var_type":"FIELD_INTEGER","attack_range":"125"},"03":{"var_type":"FIELD_INTEGER","cast_range":"125"},"04":{"var_type":"FIELD_INTEGER","aura_range":"1200"}}} ;

@registerAbility()
export class item_spy_gadget_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_spy_gadget";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_spy_gadget_custom = Data_item_spy_gadget_custom ;
};

    