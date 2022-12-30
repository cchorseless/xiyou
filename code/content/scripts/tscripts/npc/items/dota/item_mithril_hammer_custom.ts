
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mithril_hammer_custom = {"ID":"8","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1600","ItemShopTags":"damage","ItemQuality":"component","ItemAliases":"mithril hammer","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"24"}}} ;

@registerAbility()
export class item_mithril_hammer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mithril_hammer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mithril_hammer_custom = Data_item_mithril_hammer_custom ;
};

    