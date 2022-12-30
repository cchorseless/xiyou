
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_pocket_tower_custom = {"ID":"1030","AbilityName":"item_pocket_tower","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","ItemPurchasable":"0","IsTempestDoubleClonable":"0","AbilityCastRange":"600","AbilityCastPoint":"0.0","AbilityCooldown":"15.0","AbilityManaCost":"0"} ;

@registerAbility()
export class item_pocket_tower_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_pocket_tower";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_pocket_tower_custom = Data_item_pocket_tower_custom ;
};

    