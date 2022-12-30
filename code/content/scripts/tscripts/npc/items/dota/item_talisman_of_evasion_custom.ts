
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_talisman_of_evasion_custom = {"ID":"32","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1300","ItemShopTags":"evasion","ItemQuality":"secret_shop","ItemAliases":"talisman of evasion","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_evasion":"15"}}} ;

@registerAbility()
export class item_talisman_of_evasion_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_talisman_of_evasion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_talisman_of_evasion_custom = Data_item_talisman_of_evasion_custom ;
};

    