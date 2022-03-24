
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_iron_talon_custom = {"ID":"239","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE | DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES","AbilityCastRange":"350","AbilityCastPoint":"0.0","AbilityCooldown":"25.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilityManaCost":"0","ItemCost":"301","ItemShopTags":"damage","ItemQuality":"common","ItemAliases":"quelling blade","ItemPurchasable":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"15"},"02":{"var_type":"FIELD_INTEGER","quelling_range_tooltip":"350"},"03":{"var_type":"FIELD_INTEGER","cast_range_ward":"450"},"04":{"var_type":"FIELD_INTEGER","creep_damage_pct":"40"},"05":{"var_type":"FIELD_FLOAT","bonus_armor":"2"},"06":{"var_type":"FIELD_INTEGER","alternative_cooldown":"4"}}} ;

@registerAbility()
export class item_iron_talon_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_iron_talon";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_iron_talon_custom = Data_item_iron_talon_custom ;
};

    