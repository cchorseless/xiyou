
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_buckler_custom = {"ID":"86","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCastRange":"1200","ItemCost":"425","ItemShopTags":"armor;boost_armor","ItemQuality":"rare","ItemAliases":"buckler","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","armor":"1"},"02":{"var_type":"FIELD_FLOAT","bonus_aoe_armor":"2"},"03":{"var_type":"FIELD_INTEGER","bonus_aoe_radius":"1200"}}} ;

@registerAbility()
export class item_buckler_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_buckler";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_buckler_custom = Data_item_buckler_custom ;
};

    