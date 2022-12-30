
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_eagle_custom = {"ID":"52","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2800","ItemShopTags":"agi","ItemQuality":"secret_shop","ItemAliases":"eaglesong","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"25"}}} ;

@registerAbility()
export class item_eagle_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_eagle";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_eagle_custom = Data_item_eagle_custom ;
};

    