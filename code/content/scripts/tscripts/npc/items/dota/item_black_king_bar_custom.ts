
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_black_king_bar_custom = {"ID":"116","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"2","AbilityCooldown":"75","ItemCost":"4050","ItemShopTags":"str;damage;hard_to_tag","ItemQuality":"epic","ItemAliases":"bkb;black king bar","ItemSellable":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"24"},"03":{"var_type":"FIELD_FLOAT","duration":"9.0 8.0 7.0 6.0"},"04":{"var_type":"FIELD_INTEGER","max_level":"4"},"05":{"var_type":"FIELD_INTEGER","model_scale":"30"}}} ;

@registerAbility()
export class item_black_king_bar_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_black_king_bar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_black_king_bar_custom = Data_item_black_king_bar_custom ;
};

    