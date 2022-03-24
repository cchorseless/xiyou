
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_witch_blade_custom = {"ID":"534","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCooldown":"9.0","ItemCost":"2600","ItemShopTags":"damage;int;attack_speed;regen_mana","ItemQuality":"common","ItemAliases":"witch blade;wb","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"35"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"12"},"03":{"var_type":"FIELD_INTEGER","bonus_armor":"6"},"04":{"var_type":"FIELD_FLOAT","int_damage_multiplier":"1"},"05":{"var_type":"FIELD_INTEGER","slow":"25"},"06":{"var_type":"FIELD_FLOAT","slow_duration":"3"},"07":{"var_type":"FIELD_INTEGER","projectile_speed":"300"}}} ;

@registerAbility()
export class item_witch_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_witch_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_witch_blade_custom = Data_item_witch_blade_custom ;
};

    