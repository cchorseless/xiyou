
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_glimmer_cape_custom = {"ID":"254","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"550","AbilityCooldown":"14.0","AbilityManaCost":"90","ItemCost":"1950","ItemShopTags":"","ItemQuality":"rare","ItemAliases":"glimmer cape","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_magical_armor":"15"},"02":{"var_type":"FIELD_FLOAT","fade_delay":"0.6"},"03":{"var_type":"FIELD_INTEGER","active_magical_armor":"45"},"04":{"var_type":"FIELD_FLOAT","duration":"5"},"05":{"var_type":"FIELD_FLOAT","building_duration_limit":"180"}}} ;

@registerAbility()
export class item_glimmer_cape_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_glimmer_cape";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_glimmer_cape_custom = Data_item_glimmer_cape_custom ;
};

    