
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_willow_terrorize = {"ID":"8340","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","LinkedAbility":"dark_willow_bedlam","AbilityDraftPreAbility":"dark_willow_bedlam","AbilityCastRange":"1200","AbilityCastPoint":"1.0","AbilityCooldown":"100 90 80","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","destination_travel_speed":"2000"},"02":{"var_type":"FIELD_INTEGER","destination_radius":"400"},"03":{"var_type":"FIELD_FLOAT","destination_status_duration":"3.5 3.75 4","LinkedSpecialBonus":"special_bonus_unique_dark_willow_2"},"04":{"var_type":"FIELD_INTEGER","return_travel_speed":"600"},"05":{"var_type":"FIELD_FLOAT","starting_height":"300"}}} ;

@registerAbility()
export class ability6_dark_willow_terrorize extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_willow_terrorize";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_willow_terrorize = Data_dark_willow_terrorize ;
}
    