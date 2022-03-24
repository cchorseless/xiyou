
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_phase_boots_custom = {"ID":"50","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","AbilityCooldown":"8.0","ItemCost":"1500","ItemShopTags":"damage;move_speed;hard_to_tag","ItemQuality":"common","ItemAliases":"phase boots","ItemDeclarations":"DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"0"},"11":{"var_type":"FIELD_INTEGER","bonus_armor":"4"},"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"45"},"02":{"var_type":"FIELD_INTEGER","bonus_damage_melee":"18"},"03":{"var_type":"FIELD_INTEGER","bonus_damage_range":"12"},"04":{"var_type":"FIELD_INTEGER","damage_block_melee":"0"},"05":{"var_type":"FIELD_INTEGER","damage_block_ranged":"0"},"06":{"var_type":"FIELD_INTEGER","block_chance":"0"},"07":{"var_type":"FIELD_INTEGER","phase_movement_speed":"20"},"08":{"var_type":"FIELD_INTEGER","phase_movement_speed_range":"10"},"09":{"var_type":"FIELD_FLOAT","phase_duration":"3.0"}}} ;

@registerAbility()
export class item_phase_boots_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_phase_boots";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_phase_boots_custom = Data_item_phase_boots_custom ;
};

    