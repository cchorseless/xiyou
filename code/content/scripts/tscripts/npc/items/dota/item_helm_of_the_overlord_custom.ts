
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_helm_of_the_overlord_custom = {"ID":"635","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","AbilityCastRange":"700","AbilityCastPoint":"0.0","AbilityCooldown":"45.0","AbilityManaCost":"0","ItemCost":"6000","ItemShopTags":"damage;armor;unique;hard_to_tag","ItemQuality":"artifact","ItemAliases":"hotd;helm of the dominator","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","creep_bonus_armor":"4"},"11":{"var_type":"FIELD_INTEGER","model_scale":"20"},"12":{"var_type":"FIELD_INTEGER","count_limit":"2"},"01":{"var_type":"FIELD_INTEGER","bonus_stats":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"8"},"03":{"var_type":"FIELD_FLOAT","bonus_regen":"8"},"04":{"var_type":"FIELD_INTEGER","health_min":"1800"},"05":{"var_type":"FIELD_INTEGER","speed_base":"380"},"06":{"var_type":"FIELD_INTEGER","bounty_gold":"150"},"07":{"var_type":"FIELD_INTEGER","creep_bonus_damage":"25"},"08":{"var_type":"FIELD_INTEGER","creep_bonus_hp_regen":"12"},"09":{"var_type":"FIELD_INTEGER","creep_bonus_mp_regen":"4"}}} ;

@registerAbility()
export class item_helm_of_the_overlord_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_helm_of_the_overlord";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_helm_of_the_overlord_custom = Data_item_helm_of_the_overlord_custom ;
};

    