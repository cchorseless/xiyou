
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_sange_custom = {"ID":"162","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2050","ItemShopTags":"damage;str;unique","ItemQuality":"artifact","ItemAliases":"sange","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"16"},"02":{"var_type":"FIELD_INTEGER","status_resistance":"16"},"03":{"var_type":"FIELD_INTEGER","hp_regen_amp":"20"}}} ;

@registerAbility()
export class item_sange_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_sange";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_sange_custom = Data_item_sange_custom ;
};

    