
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_hyperstone_custom = {"ID":"55","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2000","ItemShopTags":"attack_speed","ItemQuality":"secret_shop","ItemAliases":"hyperstone","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"60"}}} ;

@registerAbility()
export class item_hyperstone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_hyperstone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_hyperstone_custom = Data_item_hyperstone_custom ;
};

    