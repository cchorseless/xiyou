
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_helm_of_the_dominator_custom = {"ID":"164","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS | DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","AbilityCastRange":"700","AbilityCastPoint":"0.0","AbilityCooldown":"45.0","MaxUpgradeLevel":"2","ItemBaseLevel":"1","AbilityManaCost":"0","ItemCost":"2350","ItemShopTags":"damage;armor;unique;hard_to_tag","ItemQuality":"artifact","ItemAliases":"hotd;helm of the dominator","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","creep_bonus_armor":"4"},"11":{"var_type":"FIELD_INTEGER","model_scale":"0"},"12":{"var_type":"FIELD_INTEGER","count_limit":"1"},"01":{"var_type":"FIELD_INTEGER","bonus_stats":"6"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"6"},"03":{"var_type":"FIELD_FLOAT","bonus_regen":"6"},"04":{"var_type":"FIELD_INTEGER","health_min":"1000"},"05":{"var_type":"FIELD_INTEGER","speed_base":"380"},"06":{"var_type":"FIELD_INTEGER","bounty_gold":"100"},"07":{"var_type":"FIELD_INTEGER","creep_bonus_damage":"25"},"08":{"var_type":"FIELD_INTEGER","creep_bonus_hp_regen":"12"},"09":{"var_type":"FIELD_INTEGER","creep_bonus_mp_regen":"4"}}} ;

@registerAbility()
export class item_helm_of_the_dominator_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_helm_of_the_dominator";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_helm_of_the_dominator_custom = Data_item_helm_of_the_dominator_custom ;
};

    