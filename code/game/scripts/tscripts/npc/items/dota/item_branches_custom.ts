
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_branches_custom = {"ID":"16","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","Model":"models/props_gameplay/branch.vmdl","AbilityCastRange":"400","AbilityCastPoint":"0.0","AbilityCooldown":"0.0","ItemCost":"50","ItemShopTags":"agi;int;str","ItemQuality":"consumable","ItemAliases":"gg branch;iron branch","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"1"},"02":{"var_type":"FIELD_INTEGER","tree_duration":"20"}}} ;

@registerAbility()
export class item_branches_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_branches";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_branches_custom = Data_item_branches_custom ;
};

    