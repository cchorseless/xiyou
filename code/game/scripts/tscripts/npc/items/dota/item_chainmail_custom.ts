
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_chainmail_custom = {"ID":"4","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"550","ItemShopTags":"armor","ItemQuality":"component","ItemAliases":"chainmail","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"4"}}} ;

@registerAbility()
export class item_chainmail_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_chainmail";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_chainmail_custom = Data_item_chainmail_custom ;
};

    