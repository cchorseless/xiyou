
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ultimate_orb_custom = {"ID":"24","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2050","ItemShopTags":"agi;int;str","ItemQuality":"secret_shop","ItemAliases":"ultimate orb","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"10"}}} ;

@registerAbility()
export class item_ultimate_orb_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ultimate_orb";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ultimate_orb_custom = Data_item_ultimate_orb_custom ;
};

    