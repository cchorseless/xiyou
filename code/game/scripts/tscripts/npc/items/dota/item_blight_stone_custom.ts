
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_blight_stone_custom = {"ID":"240","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellDispellableType":"SPELL_DISPELLABLE_YES","ItemCost":"300","ItemShopTags":"hard_to_tag","ItemQuality":"component","ItemAliases":"blight stone","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","corruption_armor":"-2"},"02":{"var_type":"FIELD_FLOAT","corruption_duration":"8.0"}}} ;

@registerAbility()
export class item_blight_stone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_blight_stone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_blight_stone_custom = Data_item_blight_stone_custom ;
};

    