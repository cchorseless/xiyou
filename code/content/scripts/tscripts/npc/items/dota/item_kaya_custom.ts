
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_kaya_custom = {"ID":"259","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2050","ItemShopTags":"int;mana","ItemQuality":"epic","ItemAliases":"ky;kaya","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS | DECLARE_PURCHASES_IN_SPEECH","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"16"},"02":{"var_type":"FIELD_INTEGER","spell_amp":"8"},"03":{"var_type":"FIELD_INTEGER","mana_regen_multiplier":"50"},"04":{"var_type":"FIELD_INTEGER","spell_lifesteal_amp":"24"}}} ;

@registerAbility()
export class item_kaya_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_kaya";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_kaya_custom = Data_item_kaya_custom ;
};

    