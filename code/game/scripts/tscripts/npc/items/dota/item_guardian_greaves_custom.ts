
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_guardian_greaves_custom = {"ID":"231","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"1","AbilityCooldown":"40","AbilityCastRange":"1200","AbilityManaCost":"0","ItemCost":"5200","ItemShopTags":"int;armor;regen_health;hard_to_tag","ItemQuality":"rare","ItemAliases":"guardian greaves","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ItemAlertable":"1","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","replenish_health":"300"},"11":{"var_type":"FIELD_INTEGER","replenish_mana":"200"},"12":{"var_type":"FIELD_INTEGER","replenish_radius":"1200"},"01":{"var_type":"FIELD_INTEGER","bonus_movement":"50"},"02":{"var_type":"FIELD_INTEGER","bonus_mana":"250"},"03":{"var_type":"FIELD_INTEGER","bonus_armor":"4"},"04":{"var_type":"FIELD_FLOAT","aura_health_regen":"2.5"},"05":{"var_type":"FIELD_FLOAT","aura_armor":"3"},"06":{"var_type":"FIELD_INTEGER","aura_health_regen_bonus":"16"},"07":{"var_type":"FIELD_INTEGER","aura_armor_bonus":"10"},"08":{"var_type":"FIELD_INTEGER","aura_bonus_threshold":"20"},"09":{"var_type":"FIELD_INTEGER","aura_radius":"1200"}}} ;

@registerAbility()
export class item_guardian_greaves_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_guardian_greaves";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_guardian_greaves_custom = Data_item_guardian_greaves_custom ;
};

    