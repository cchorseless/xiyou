
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_veil_of_discord_custom = {"ID":"190","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_MOVEMENT","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCooldown":"22","AbilityCastRange":"1200","AbilityCastPoint":"0.0","AbilityManaCost":"50","ItemCost":"1525","ItemShopTags":"int;armor;regen_health;hard_to_tag","ItemQuality":"rare","ItemAliases":"vod;veil of discord","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"4"},"02":{"var_type":"FIELD_FLOAT","aura_mana_regen":"1.75"},"03":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"04":{"var_type":"FIELD_INTEGER","spell_amp":"18"},"05":{"var_type":"FIELD_INTEGER","debuff_radius":"600"},"06":{"var_type":"FIELD_FLOAT","resist_debuff_duration":"16.0"}}} ;

@registerAbility()
export class item_veil_of_discord_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_veil_of_discord";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_veil_of_discord_custom = Data_item_veil_of_discord_custom ;
};

    