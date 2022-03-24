
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_yasha_custom = {"ID":"170","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2050","ItemShopTags":"agi;attack_speed;move_speed","ItemQuality":"artifact","ItemAliases":"yasha","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"16"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"12"},"03":{"var_type":"FIELD_INTEGER","movement_speed_percent_bonus":"8"}}} ;

@registerAbility()
export class item_yasha_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_yasha";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_yasha_custom = Data_item_yasha_custom ;
};

    