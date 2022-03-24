
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_greater_mango_custom = {"ID":"295","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","Model":"models/props_gameplay/neutral_box.vmdl","AbilityCastPoint":"0.0","ItemCost":"0","ItemStackable":"0","ItemPermanent":"0","IsTempestDoubleClonable":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0"} ;

@registerAbility()
export class item_greater_mango_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_greater_mango";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_greater_mango_custom = Data_item_greater_mango_custom ;
};

    