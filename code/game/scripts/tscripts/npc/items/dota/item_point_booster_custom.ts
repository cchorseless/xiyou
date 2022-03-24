
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_point_booster_custom = {"ID":"60","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1200","ItemShopTags":"mana_pool;health_pool","ItemQuality":"secret_shop","ItemAliases":"point booster","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_mana":"175"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"175"}}} ;

@registerAbility()
export class item_point_booster_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_point_booster";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_point_booster_custom = Data_item_point_booster_custom ;
};

    