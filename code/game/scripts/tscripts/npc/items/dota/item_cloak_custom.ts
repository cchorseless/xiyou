
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_cloak_custom = {"ID":"31","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"500","ItemShopTags":"magic_resist","ItemQuality":"component","ItemAliases":"cloak","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_magical_armor":"15"},"02":{"var_type":"FIELD_INTEGER","tooltip_resist":"15"}}} ;

@registerAbility()
export class item_cloak_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_cloak";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_cloak_custom = Data_item_cloak_custom ;
};

    