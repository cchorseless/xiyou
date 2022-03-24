
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_arcane_blink_custom = {"ID":"604","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityCastRange":"0","AbilityCastPoint":"0.0","AbilityCooldown":"15.0","AbilityManaCost":"0","AbilitySharedCooldown":"blink","ItemCost":"6800","ItemShopTags":"teleport","ItemQuality":"component","ItemAliases":"blink dagger","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","blink_range":"1200"},"02":{"var_type":"FIELD_FLOAT","blink_damage_cooldown":"3.0"},"03":{"var_type":"FIELD_INTEGER","blink_range_clamp":"960"},"04":{"var_type":"FIELD_INTEGER","bonus_intellect":"25"},"05":{"var_type":"FIELD_INTEGER","base_cooldown":"25"},"06":{"var_type":"FIELD_INTEGER","ultimate_cooldown":"25"},"07":{"var_type":"FIELD_FLOAT","duration":"6"},"08":{"var_type":"FIELD_INTEGER","cast_pct_improvement":"50"}}} ;

@registerAbility()
export class item_arcane_blink_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_arcane_blink";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_arcane_blink_custom = Data_item_arcane_blink_custom ;
};

    