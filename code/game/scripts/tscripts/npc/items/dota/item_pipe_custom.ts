
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_pipe_custom = {"ID":"90","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"2","AbilityCooldown":"60.0","AbilityManaCost":"100","AbilityCastRange":"1200","ItemCost":"3475","ItemShopTags":"regen_health;boost_magic_resist","ItemQuality":"rare","ItemAliases":"pipe of insight","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemAlertable":"1","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","barrier_radius":"1200"},"11":{"var_type":"FIELD_INTEGER","bonus_all_stats":"0"},"12":{"var_type":"FIELD_INTEGER","barrier_block_creep":"400"},"01":{"var_type":"FIELD_FLOAT","health_regen":"8.5"},"02":{"var_type":"FIELD_INTEGER","magic_resistance":"30"},"03":{"var_type":"FIELD_FLOAT","barrier_debuff_duration":"50.0"},"04":{"var_type":"FIELD_INTEGER","tooltip_resist":"30"},"05":{"var_type":"FIELD_FLOAT","aura_health_regen":"2.5"},"06":{"var_type":"FIELD_INTEGER","magic_resistance_aura":"10"},"07":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"08":{"var_type":"FIELD_INTEGER","barrier_block":"400"},"09":{"var_type":"FIELD_INTEGER","barrier_duration":"12.0"}}} ;

@registerAbility()
export class item_pipe_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_pipe";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_pipe_custom = Data_item_pipe_custom ;
};

    