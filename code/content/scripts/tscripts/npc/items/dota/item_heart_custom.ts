
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_heart_custom = {"ID":"114","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"5100","ItemShopTags":"str;regen_health;health_pool","ItemQuality":"epic","ItemAliases":"hot;heart of tarrasque","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"45"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"250"},"03":{"var_type":"FIELD_FLOAT","health_regen_pct":"1.6"}}} ;

@registerAbility()
export class item_heart_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_heart";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_heart_custom = Data_item_heart_custom ;
};

    