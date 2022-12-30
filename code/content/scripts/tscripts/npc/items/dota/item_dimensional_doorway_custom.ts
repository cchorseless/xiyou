
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_dimensional_doorway_custom = {"ID":"373","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityCooldown":"90.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","ItemInitialCharges":"3","ItemPermanent":"0","Model":"models/props_gameplay/neutral_box.vmdl"} ;

@registerAbility()
export class item_dimensional_doorway_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_dimensional_doorway";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_dimensional_doorway_custom = Data_item_dimensional_doorway_custom ;
};

    