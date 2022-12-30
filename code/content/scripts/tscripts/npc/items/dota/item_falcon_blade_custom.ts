
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_falcon_blade_custom = {"ID":"596","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1100","ItemShopTags":"hard_to_tag","ItemQuality":"rare","ItemAliases":"fb;falcon blade","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"175"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"1.8"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"10"}}} ;

@registerAbility()
export class item_falcon_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_falcon_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_falcon_blade_custom = Data_item_falcon_blade_custom ;
};

    