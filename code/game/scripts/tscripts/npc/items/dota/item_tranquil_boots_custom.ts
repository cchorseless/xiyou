
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_tranquil_boots_custom = {"ID":"214","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCooldown":"13.0","AbilityManaCost":"0","ItemCost":"925","ItemShopTags":"move_speed;regen_health;armor","ItemQuality":"rare","ItemAliases":"tranquil boots","ItemHideCharges":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","broken_movement_speed":"40"},"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"65"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"0"},"03":{"var_type":"FIELD_INTEGER","bonus_health_regen":"14"},"04":{"var_type":"FIELD_FLOAT","heal_duration":"20.0"},"05":{"var_type":"FIELD_INTEGER","heal_amount":"250"},"06":{"var_type":"FIELD_FLOAT","heal_interval":"0.334"},"07":{"var_type":"FIELD_INTEGER","break_time":"13"},"08":{"var_type":"FIELD_INTEGER","break_count":"1"},"09":{"var_type":"FIELD_INTEGER","break_threshold":"20"}}} ;

@registerAbility()
export class item_tranquil_boots_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_tranquil_boots";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_tranquil_boots_custom = Data_item_tranquil_boots_custom ;
};

    