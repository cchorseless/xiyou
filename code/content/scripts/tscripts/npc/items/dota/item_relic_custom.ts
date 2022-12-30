
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_relic_custom = {"ID":"54","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"3800","ItemShopTags":"damage","ItemQuality":"secret_shop","ItemAliases":"sacred relic","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"60"}}} ;

@registerAbility()
export class item_relic_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_relic";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_relic_custom = Data_item_relic_custom ;
};

    