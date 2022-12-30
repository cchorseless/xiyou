
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_demon_edge_custom = {"ID":"51","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2200","ItemShopTags":"damage","ItemQuality":"secret_shop","ItemAliases":"demon edge","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"40"}}} ;

@registerAbility()
export class item_demon_edge_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_demon_edge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_demon_edge_custom = Data_item_demon_edge_custom ;
};

    