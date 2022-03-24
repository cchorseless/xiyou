
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_phoenix_ash_custom = {"ID":"293","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","ItemInitialCharges":"1","ItemPermanent":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health_pct":"50"}}} ;

@registerAbility()
export class item_phoenix_ash_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_phoenix_ash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_phoenix_ash_custom = Data_item_phoenix_ash_custom ;
};

    