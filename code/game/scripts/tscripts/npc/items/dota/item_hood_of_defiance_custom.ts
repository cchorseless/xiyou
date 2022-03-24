
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_hood_of_defiance_custom = {"ID":"131","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"60.0","AbilityManaCost":"75","ItemCost":"1500","ItemShopTags":"regen_health;magic_resist","ItemQuality":"epic","ItemAliases":"hood of defiance","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_spell_resist":"20"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"8.5"},"03":{"var_type":"FIELD_INTEGER","tooltip_resist":"20"},"04":{"var_type":"FIELD_INTEGER","barrier_block":"325"},"05":{"var_type":"FIELD_INTEGER","barrier_duration":"12.0"}}} ;

@registerAbility()
export class item_hood_of_defiance_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_hood_of_defiance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_hood_of_defiance_custom = Data_item_hood_of_defiance_custom ;
};

    