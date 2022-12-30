
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_pocket_roshan_custom = {"ID":"1032","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCastPoint":"0.0","AbilityCooldown":"60.0","AbilityManaCost":"0","ItemCost":"1000","ItemQuality":"rare","ItemPurchasable":"0","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","summon_duration":"60"}}} ;

@registerAbility()
export class item_pocket_roshan_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_pocket_roshan";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_pocket_roshan_custom = Data_item_pocket_roshan_custom ;
};

    