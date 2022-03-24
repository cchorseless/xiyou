
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_staff_of_wizardry_custom = {"ID":"23","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1000","ItemShopTags":"int","ItemQuality":"component","ItemAliases":"staff of wizardry","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"10"}}} ;

@registerAbility()
export class item_staff_of_wizardry_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_staff_of_wizardry";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_staff_of_wizardry_custom = Data_item_staff_of_wizardry_custom ;
};

    