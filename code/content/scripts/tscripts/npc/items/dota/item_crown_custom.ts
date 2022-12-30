
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_crown_custom = {"ID":"261","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"450","ItemShopTags":"agi;int;str","ItemQuality":"component","ItemAliases":"crown","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"4"}}} ;

@registerAbility()
export class item_crown_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_crown";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_crown_custom = Data_item_crown_custom ;
};

    