
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_aether_lens_custom = {"ID":"232","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"2275","ItemShopTags":"int;regen_mana;move_speed;hard_to_tag","ItemQuality":"rare","ItemAliases":"aether lens","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_mana":"300"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"3.0"},"03":{"var_type":"FIELD_INTEGER","cast_range_bonus":"225"}}} ;

@registerAbility()
export class item_aether_lens_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_aether_lens";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_aether_lens_custom = Data_item_aether_lens_custom ;
};

    