
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_manta_custom = {"ID":"147","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityCooldown":"30.0","AbilityCastPoint":"0.0","AbilityManaCost":"125","ItemCost":"4600","ItemShopTags":"agi;str;int;attack_speed;move_speed;hard_to_tag","ItemQuality":"epic","ItemAliases":"manta style","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","images_take_damage_percent":"200"},"11":{"var_type":"FIELD_INTEGER","tooltip_damage_incoming_total_pct":"300"},"12":{"var_type":"FIELD_INTEGER","images_do_damage_percent_ranged":"-72"},"13":{"var_type":"FIELD_INTEGER","tooltip_damage_outgoing_ranged":"28"},"14":{"var_type":"FIELD_FLOAT","invuln_duration":"0.1"},"15":{"var_type":"FIELD_INTEGER","vision_radius":"1000"},"01":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_agility":"26"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"10"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"12"},"05":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"8"},"06":{"var_type":"FIELD_INTEGER","images_count":"2"},"07":{"var_type":"FIELD_INTEGER","tooltip_illusion_duration":"20"},"08":{"var_type":"FIELD_INTEGER","images_do_damage_percent_melee":"-67"},"09":{"var_type":"FIELD_INTEGER","tooltip_damage_outgoing_melee":"33"}}} ;

@registerAbility()
export class item_manta_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_manta";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_manta_custom = Data_item_manta_custom ;
};

    