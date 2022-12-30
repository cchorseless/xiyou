
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_boots_of_elves_custom = {"ID":"18","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"450","ItemShopTags":"agi","ItemQuality":"component","ItemAliases":"band of elvenskin","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"6"}}} ;

@registerAbility()
export class item_boots_of_elves_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_boots_of_elves";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_boots_of_elves_custom = Data_item_boots_of_elves_custom ;
};

    