
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mjollnir_custom = {"ID":"158","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"800","AbilityCastPoint":"0.0","AbilityCooldown":"35.0","AbilityManaCost":"50","ItemCost":"5600","ItemShopTags":"damage;attack_speed;unique","ItemQuality":"artifact","ItemAliases":"mjollnir","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","static_cooldown":"1.0"},"11":{"var_type":"FIELD_INTEGER","chain_chance":"30"},"12":{"var_type":"FIELD_INTEGER","chain_damage":"180"},"13":{"var_type":"FIELD_INTEGER","chain_strikes":"12"},"14":{"var_type":"FIELD_INTEGER","chain_radius":"650"},"15":{"var_type":"FIELD_FLOAT","chain_delay":"0.25"},"16":{"var_type":"FIELD_FLOAT","chain_cooldown":"0.2"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"24"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"65"},"03":{"var_type":"FIELD_FLOAT","static_duration":"15.0"},"04":{"var_type":"FIELD_INTEGER","static_chance":"20"},"05":{"var_type":"FIELD_INTEGER","static_strikes":"4"},"06":{"var_type":"FIELD_INTEGER","static_damage":"225"},"07":{"var_type":"FIELD_INTEGER","static_primary_radius":"600"},"08":{"var_type":"FIELD_INTEGER","static_seconary_radius":"900"},"09":{"var_type":"FIELD_INTEGER","static_radius":"900"}}} ;

@registerAbility()
export class item_mjollnir_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mjollnir";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mjollnir_custom = Data_item_mjollnir_custom ;
};

    