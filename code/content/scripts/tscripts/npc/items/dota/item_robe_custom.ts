
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_robe_custom = {"ID":"19","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"450","ItemShopTags":"int","ItemQuality":"component","ItemAliases":"robe of the magi","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"6"}}} ;

@registerAbility()
export class item_robe_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_robe";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_robe_custom = Data_item_robe_custom ;
};

    