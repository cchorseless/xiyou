
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_silver_edge_custom = {"ID":"249","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","FightRecapLevel":"1","AbilityCooldown":"18.0","AbilitySharedCooldown":"shadow_blade","AbilityManaCost":"75","ItemCost":"5600","ItemShopTags":"damage;attack_speed;movespeed;hard_to_tag","ItemQuality":"epic","ItemAliases":"sb;invis;shadow blade","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","backstab_duration":"4"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"40"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"45"},"03":{"var_type":"FIELD_INTEGER","bonus_strength":"0"},"04":{"var_type":"FIELD_INTEGER","bonus_intellect":"15"},"05":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"4.0"},"06":{"var_type":"FIELD_FLOAT","windwalk_duration":"14.0"},"07":{"var_type":"FIELD_INTEGER","windwalk_movement_speed":"25"},"08":{"var_type":"FIELD_FLOAT","windwalk_fade_time":"0.3"},"09":{"var_type":"FIELD_INTEGER","windwalk_bonus_damage":"175"}}} ;

@registerAbility()
export class item_silver_edge_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_silver_edge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_silver_edge_custom = Data_item_silver_edge_custom ;
};

    