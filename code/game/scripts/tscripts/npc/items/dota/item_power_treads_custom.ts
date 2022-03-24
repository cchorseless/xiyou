
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_power_treads_custom = {"ID":"63","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemCost":"1400","ItemShopTags":"attack_speed;move_speed;int;agi;str","ItemQuality":"common","ItemAliases":"power treads","ItemDeclarations":"DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"45"},"02":{"var_type":"FIELD_INTEGER","bonus_stat":"10"},"03":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"25"},"04":{"var_type":"FIELD_INTEGER","bonus_damage":"0"}}} ;

@registerAbility()
export class item_power_treads_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_power_treads";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_power_treads_custom = Data_item_power_treads_custom ;
};

    