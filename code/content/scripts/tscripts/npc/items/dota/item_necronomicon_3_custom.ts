
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_necronomicon_3_custom = {"ID":"194","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCastPoint":"0.0","AbilityCooldown":"80.0","AbilityManaCost":"150","AbilitySharedCooldown":"necronomicon","FightRecapLevel":"1","ShouldBeSuggested":"1","ItemPurchasable":"0","IsObsolete":"1","ItemCost":"4550","ItemShopTags":"int;str;hard_to_tag;see_invis","ItemQuality":"rare","ItemAliases":"necronomicon 3","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","MaxUpgradeLevel":"3","ItemBaseLevel":"3","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","warrior_truesight":"400 800 1200"},"11":{"var_type":"FIELD_INTEGER","archer_health_tooltip":"800 1200 1600"},"12":{"var_type":"FIELD_INTEGER","archer_damage_tooltip":"37 57 75"},"13":{"var_type":"FIELD_INTEGER","archer_mana_burn":"125 175 225"},"14":{"var_type":"FIELD_INTEGER","archer_aura_radius_tooltip":"1200"},"15":{"var_type":"FIELD_INTEGER","archer_move_speed":"5 7 9"},"01":{"var_type":"FIELD_INTEGER","bonus_strength":"6 12 18"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2 3 4"},"04":{"var_type":"FIELD_INTEGER","summon_duration":"60"},"05":{"var_type":"FIELD_INTEGER","warrior_health_tooltip":"800 1200 1600"},"06":{"var_type":"FIELD_INTEGER","warrior_damage_tooltip":"25 45 65"},"07":{"var_type":"FIELD_INTEGER","warrior_mana_feedback":"30 40 50"},"08":{"var_type":"FIELD_INTEGER","warrior_mana_break_tooltip":"30 40 50"},"09":{"var_type":"FIELD_INTEGER","explosion":"600 700 800"}}} ;

@registerAbility()
export class item_necronomicon_3_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_necronomicon_3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_necronomicon_3_custom = Data_item_necronomicon_3_custom ;
};

    