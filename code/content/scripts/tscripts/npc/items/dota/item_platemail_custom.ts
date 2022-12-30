
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_platemail_custom = {"ID":"9","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1400","ItemShopTags":"armor","ItemQuality":"secret_shop","ItemAliases":"platemail","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"10"}}} ;

@registerAbility()
export class item_platemail_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_platemail";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_platemail_custom = Data_item_platemail_custom ;
};

    