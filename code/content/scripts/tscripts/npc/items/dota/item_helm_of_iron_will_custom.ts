
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_helm_of_iron_will_custom = {"ID":"6","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"925","ItemShopTags":"armor;regen_health","ItemQuality":"component","ItemAliases":"helm of iron will","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"6"},"02":{"var_type":"FIELD_FLOAT","bonus_regen":"5"}}} ;

@registerAbility()
export class item_helm_of_iron_will_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_helm_of_iron_will";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_helm_of_iron_will_custom = Data_item_helm_of_iron_will_custom ;
};

    