
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_vitality_booster_custom = {"ID":"61","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1000","ItemShopTags":"health_pool","ItemQuality":"secret_shop","ItemAliases":"vitality booster","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"250"}}} ;

@registerAbility()
export class item_vitality_booster_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_vitality_booster";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_vitality_booster_custom = Data_item_vitality_booster_custom ;
};

    