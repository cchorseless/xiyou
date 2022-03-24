
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_fluffy_hat_custom = {"ID":"593","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"250","ItemShopTags":"health_pool","ItemQuality":"secret_shop","ItemAliases":"flf;fluffy hat;hat;fh","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"125"}}} ;

@registerAbility()
export class item_fluffy_hat_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_fluffy_hat";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_fluffy_hat_custom = Data_item_fluffy_hat_custom ;
};

    