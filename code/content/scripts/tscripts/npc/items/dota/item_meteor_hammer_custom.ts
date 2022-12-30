
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_meteor_hammer_custom = {"ID":"223","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_CHANNELLED","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilityChannelTime":"2.5","AbilityCastRange":"600","AbilityCooldown":"24","AbilityManaCost":"125","ItemCost":"2350","ItemQuality":"epic","ItemAliases":"mh;meteor hammer","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","impact_radius":"315"},"11":{"var_type":"FIELD_FLOAT","max_duration":"2.5"},"12":{"var_type":"FIELD_INTEGER","impact_damage_buildings":"75"},"13":{"var_type":"FIELD_INTEGER","impact_damage_units":"150"},"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"8"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"6.5"},"03":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2.5"},"04":{"var_type":"FIELD_INTEGER","burn_dps_buildings":"60"},"05":{"var_type":"FIELD_INTEGER","burn_dps_units":"90"},"06":{"var_type":"FIELD_INTEGER","burn_duration":"6"},"07":{"var_type":"FIELD_FLOAT","stun_duration":"1.5"},"08":{"var_type":"FIELD_FLOAT","burn_interval":"1.0"},"09":{"var_type":"FIELD_FLOAT","land_time":".5"}}} ;

@registerAbility()
export class item_meteor_hammer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_meteor_hammer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_meteor_hammer_custom = Data_item_meteor_hammer_custom ;
};

    