
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_blade_of_alacrity_custom = {"ID":"22","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1000","ItemShopTags":"agi","ItemQuality":"component","ItemAliases":"blade of alacrity","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"10"}}} ;

@registerAbility()
export class item_blade_of_alacrity_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_blade_of_alacrity";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_blade_of_alacrity_custom = Data_item_blade_of_alacrity_custom ;
};

    