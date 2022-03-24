
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_null_talisman_custom = {"ID":"77","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"505","ItemShopTags":"damage;int;agi;str","ItemQuality":"common","ItemAliases":"null talisman","ShouldBeInitiallySuggested":"1","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"5"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"2"},"03":{"var_type":"FIELD_INTEGER","bonus_agility":"2"},"04":{"var_type":"FIELD_INTEGER","bonus_spell_amp":"3"},"05":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"0.6"}}} ;

@registerAbility()
export class item_null_talisman_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_null_talisman";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_null_talisman_custom = Data_item_null_talisman_custom ;
};

    