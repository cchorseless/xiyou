
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mystic_staff_custom = {"ID":"58","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2800","ItemShopTags":"int","ItemQuality":"secret_shop","ItemAliases":"mystic staff","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"25"}}} ;

@registerAbility()
export class item_mystic_staff_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mystic_staff";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mystic_staff_custom = Data_item_mystic_staff_custom ;
};

    