
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_gungir_custom = {"ID":"1466","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySharedCooldown":"atos","AbilityCooldown":"18","AbilityCastRange":"1100","AbilityCastPoint":"0.0","AbilityManaCost":"200","ItemCost":"6150","ItemShopTags":"damage;attack_speed;unique","ItemQuality":"artifact","ItemAliases":"gleipnir;gliepnir;glaypnir","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","bonus_agility":"12"},"11":{"var_type":"FIELD_FLOAT","duration":"2.0"},"12":{"var_type":"FIELD_INTEGER","radius":"450"},"13":{"var_type":"FIELD_INTEGER","active_damage":"220"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"30"},"02":{"var_type":"FIELD_INTEGER","chain_chance":"30"},"03":{"var_type":"FIELD_INTEGER","chain_damage":"160"},"04":{"var_type":"FIELD_INTEGER","chain_strikes":"4"},"05":{"var_type":"FIELD_INTEGER","chain_radius":"650"},"06":{"var_type":"FIELD_FLOAT","chain_delay":"0.25"},"07":{"var_type":"FIELD_FLOAT","chain_cooldown":"0.2"},"08":{"var_type":"FIELD_INTEGER","bonus_intellect":"20"},"09":{"var_type":"FIELD_INTEGER","bonus_strength":"12"}}} ;

@registerAbility()
export class item_gungir_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_gungir";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_gungir_custom = Data_item_gungir_custom ;
};

    