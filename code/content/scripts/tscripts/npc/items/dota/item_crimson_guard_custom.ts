
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_crimson_guard_custom = {"ID":"242","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCooldown":"40.0","AbilityCastRange":"1200","ItemCost":"3700","ItemShopTags":"armor;boost_armor;regen_health;block;health_pool","ItemQuality":"epic","ItemAlertable":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","block_damage_ranged_active":"70"},"11":{"var_type":"FIELD_INTEGER","block_chance_active":"100"},"12":{"var_type":"FIELD_FLOAT","tooltip_reapply_time":"40"},"01":{"var_type":"FIELD_INTEGER","bonus_health":"250"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"12"},"03":{"var_type":"FIELD_FLOAT","bonus_armor":"6"},"04":{"var_type":"FIELD_INTEGER","block_damage_melee":"70"},"05":{"var_type":"FIELD_INTEGER","block_damage_ranged":"35"},"06":{"var_type":"FIELD_INTEGER","block_chance":"60"},"07":{"var_type":"FIELD_INTEGER","duration":"12"},"08":{"var_type":"FIELD_INTEGER","bonus_aoe_radius":"1200"},"09":{"var_type":"FIELD_INTEGER","block_damage_melee_active":"70"}}} ;

@registerAbility()
export class item_crimson_guard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_crimson_guard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_crimson_guard_custom = Data_item_crimson_guard_custom ;
};

    