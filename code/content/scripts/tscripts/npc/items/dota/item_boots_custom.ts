
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_boots_custom = {"ID":"29","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","Model":"models/props_gameplay/boots_of_speed.vmdl","ItemCost":"500","ItemShopTags":"move_speed","ItemQuality":"component","ItemAliases":"boots of speed","ShouldBeSuggested":"1","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"45"}}} ;

@registerAbility()
export class item_boots_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_boots";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_boots_custom = Data_item_boots_custom ;
};

    