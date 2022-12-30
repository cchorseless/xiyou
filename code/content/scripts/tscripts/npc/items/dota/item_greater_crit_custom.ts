
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_greater_crit_custom = {"ID":"141","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"5150","ItemShopTags":"damage;crit","ItemQuality":"epic","ItemAliases":"daedalus","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"88"},"02":{"var_type":"FIELD_INTEGER","crit_chance":"30"},"03":{"var_type":"FIELD_INTEGER","crit_multiplier":"225"}}} ;

@registerAbility()
export class item_greater_crit_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_greater_crit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_greater_crit_custom = Data_item_greater_crit_custom ;
};

    