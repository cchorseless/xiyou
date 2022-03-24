
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mango_tree_custom = {"ID":"328","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","AbilityCastRange":"200","ItemIsNeutralDrop":"1","ItemQuality":"consumable","ItemPurchasable":"0","ItemInitialCharges":"1","ItemPermanent":"0","IsTempestDoubleClonable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","seconds":"60"}}} ;

@registerAbility()
export class item_mango_tree_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mango_tree";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mango_tree_custom = Data_item_mango_tree_custom ;
};

    