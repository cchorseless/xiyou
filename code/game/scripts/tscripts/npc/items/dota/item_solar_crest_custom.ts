
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_solar_crest_custom = {"ID":"229","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"1000","AbilityCooldown":"12.0","AbilitySharedCooldown":"medallion","ItemCost":"2625","ItemShopTags":"armor;regen_mana;hard_to_tag","ItemQuality":"rare","ItemAliases":"solar crest","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"6"},"02":{"var_type":"FIELD_INTEGER","bonus_all_stats":"5"},"03":{"var_type":"FIELD_INTEGER","self_movement_speed":"20"},"04":{"var_type":"FIELD_FLOAT","bonus_mana_regen_pct":"1.75"},"05":{"var_type":"FIELD_INTEGER","target_movement_speed":"10"},"06":{"var_type":"FIELD_INTEGER","target_attack_speed":"50"},"07":{"var_type":"FIELD_INTEGER","duration":"12"}}} ;

@registerAbility()
export class item_solar_crest_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_solar_crest";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_solar_crest_custom = Data_item_solar_crest_custom ;
};

    