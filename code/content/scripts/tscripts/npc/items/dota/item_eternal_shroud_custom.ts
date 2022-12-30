
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_eternal_shroud_custom = {"ID":"692","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"60.0","AbilityManaCost":"50","ItemCost":"3300","ItemShopTags":"regen_health;magic_resist","ItemQuality":"epic","ItemAliases":"eternal shroud;es","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_spell_resist":"20"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"8.5"},"03":{"var_type":"FIELD_INTEGER","barrier_block":"400"},"04":{"var_type":"FIELD_INTEGER","barrier_duration":"12.0"},"05":{"var_type":"FIELD_FLOAT","hero_lifesteal":"20"},"06":{"var_type":"FIELD_FLOAT","creep_lifesteal":"4"}}} ;

@registerAbility()
export class item_eternal_shroud_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_eternal_shroud";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_eternal_shroud_custom = Data_item_eternal_shroud_custom ;
};

    