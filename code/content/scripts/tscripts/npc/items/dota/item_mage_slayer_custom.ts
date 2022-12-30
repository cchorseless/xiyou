
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mage_slayer_custom = {"ID":"598","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellDispellableType":"SPELL_DISPELLABLE_YES","ItemCost":"3250","ItemShopTags":"hard_to_tag","ItemQuality":"rare","ItemAliases":"mage slayer;ms","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_magical_armor":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_magical_armor_illusion":"20"},"03":{"var_type":"FIELD_INTEGER","bonus_agility":"20"},"04":{"var_type":"FIELD_INTEGER","bonus_damage":"20"},"05":{"var_type":"FIELD_INTEGER","spell_amp_debuff":"35"},"06":{"var_type":"FIELD_FLOAT","duration":"4"}}} ;

@registerAbility()
export class item_mage_slayer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mage_slayer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mage_slayer_custom = Data_item_mage_slayer_custom ;
};

    