
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_hurricane_pike_custom = {"ID":"263","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH | DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_CUSTOM","FightRecapLevel":"1","AbilityCastRange":"550","AbilityCastPoint":"0.0","AbilityCooldown":"23.0","AbilitySharedCooldown":"force","AbilityManaCost":"100","ItemCost":"4550","ItemShopTags":"int;damage;attack_speed;hard_to_tag","ItemQuality":"epic","ItemAliases":"fs;force staff","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","max_attacks":"4"},"11":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"100"},"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"15"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"200"},"03":{"var_type":"FIELD_INTEGER","bonus_agility":"20"},"04":{"var_type":"FIELD_INTEGER","bonus_strength":"15"},"05":{"var_type":"FIELD_INTEGER","base_attack_range":"140"},"06":{"var_type":"FIELD_INTEGER","push_length":"600"},"07":{"var_type":"FIELD_INTEGER","enemy_length":"450"},"08":{"var_type":"FIELD_FLOAT","range_duration":"5"},"09":{"var_type":"FIELD_INTEGER","cast_range_enemy":"400"}}} ;

@registerAbility()
export class item_hurricane_pike_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_hurricane_pike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_hurricane_pike_custom = Data_item_hurricane_pike_custom ;
};

    