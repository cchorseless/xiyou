
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_desolator_custom = {"ID":"168","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"3500","ItemShopTags":"damage;unique","ItemQuality":"artifact","ItemAliases":"desolator","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","SpellDispellableType":"SPELL_DISPELLABLE_YES","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"55"},"02":{"var_type":"FIELD_INTEGER","corruption_armor":"-6"},"03":{"var_type":"FIELD_FLOAT","corruption_duration":"7.0"}}} ;

@registerAbility()
export class item_desolator_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_desolator";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_desolator_custom = Data_item_desolator_custom ;
};

    