
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_wraith_band_custom = {"ID":"75","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"505","ItemShopTags":"damage;int;agi;str","ItemQuality":"common","ItemAliases":"wraith band","ShouldBeInitiallySuggested":"1","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"5"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"2"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"2"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"5"},"05":{"var_type":"FIELD_FLOAT","bonus_armor":"1.5"}}} ;

@registerAbility()
export class item_wraith_band_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_wraith_band";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_wraith_band_custom = Data_item_wraith_band_custom ;
};

    