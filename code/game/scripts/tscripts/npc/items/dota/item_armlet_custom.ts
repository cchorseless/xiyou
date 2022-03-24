
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_armlet_custom = {"ID":"151","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","AbilityCooldown":"0.0","ItemCost":"2475","ItemShopTags":"damage;attack_speed;armor;regen_health;hard_to_tag","ItemQuality":"epic","ItemAliases":"armlet of mordiggian","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","toggle_cooldown":"0.036f"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"15"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"25"},"03":{"var_type":"FIELD_INTEGER","bonus_armor":"6"},"04":{"var_type":"FIELD_INTEGER","bonus_health_regen":"5"},"05":{"var_type":"FIELD_INTEGER","unholy_bonus_damage":"35"},"06":{"var_type":"FIELD_INTEGER","unholy_bonus_attack_speed":"0"},"07":{"var_type":"FIELD_INTEGER","unholy_bonus_strength":"25"},"08":{"var_type":"FIELD_INTEGER","unholy_bonus_armor":"4"},"09":{"var_type":"FIELD_INTEGER","unholy_health_drain_per_second":"40"}}} ;

@registerAbility()
export class item_armlet_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_armlet";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_armlet_custom = Data_item_armlet_custom ;
};

    