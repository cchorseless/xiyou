
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_circlet_custom = {"ID":"20","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"155","ItemShopTags":"agi;int;str","ItemQuality":"component","ItemAliases":"circlet","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"2"}}} ;

@registerAbility()
export class item_circlet_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_circlet";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_circlet_custom = Data_item_circlet_custom ;
};

    