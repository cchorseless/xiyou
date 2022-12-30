
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_bfury_custom = {"ID":"145","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE | DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityCastRange":"350","AbilityCastPoint":"0.0","AbilityCooldown":"4.0","ItemCost":"4130","ItemShopTags":"damage;health_regen;mana_regen;hard_to_tag","ItemQuality":"epic","ItemAliases":"bf;battle fury","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","cleave_distance":"650"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"55"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"7.5"},"03":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2.75"},"04":{"var_type":"FIELD_INTEGER","cleave_damage_percent":"70"},"05":{"var_type":"FIELD_INTEGER","cleave_damage_percent_creep":"40"},"06":{"var_type":"FIELD_INTEGER","quelling_bonus":"18"},"07":{"var_type":"FIELD_INTEGER","quelling_bonus_ranged":"6"},"08":{"var_type":"FIELD_INTEGER","cleave_starting_width":"150"},"09":{"var_type":"FIELD_INTEGER","cleave_ending_width":"360"}}} ;

@registerAbility()
export class item_bfury_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_bfury";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_bfury_custom = Data_item_bfury_custom ;
};

    