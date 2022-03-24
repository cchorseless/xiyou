
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_skadi_custom = {"ID":"160","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"5300","ItemShopTags":"agi;str;int;hard_to_tag;mana_pool;health_pool;unique","ItemQuality":"artifact","ItemAliases":"eos;eye of skadi","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"25"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"200"},"03":{"var_type":"FIELD_INTEGER","bonus_mana":"200"},"04":{"var_type":"FIELD_INTEGER","cold_slow_melee":"-25"},"05":{"var_type":"FIELD_INTEGER","cold_slow_ranged":"-50"},"06":{"var_type":"FIELD_FLOAT","cold_duration":"3.0"},"07":{"var_type":"FIELD_INTEGER","heal_reduction":"40"}}} ;

@registerAbility()
export class item_skadi_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_skadi";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_skadi_custom = Data_item_skadi_custom ;
};

    