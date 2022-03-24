
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_willow_bramble_maze = {"ID":"6339","AbilityType":"DOTA_ABILITY_TYPE_BASIC","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilityCastRange":"1000 1100 1200 1300","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"20","AbilityManaCost":"100 120 140 160","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","placement_range":"500"},"02":{"var_type":"FIELD_INTEGER","placement_count":"8"},"03":{"var_type":"FIELD_INTEGER","placement_duration":"15"},"04":{"var_type":"FIELD_FLOAT","latch_duration":"1.0 1.5 2.0 2.5"},"05":{"var_type":"FIELD_INTEGER","latch_range":"90"},"06":{"var_type":"FIELD_INTEGER","latch_damage":"120 160 200 240"},"07":{"var_type":"FIELD_FLOAT","latch_creation_interval":"0.075"},"08":{"var_type":"FIELD_FLOAT","latch_creation_delay":"0.1"},"09":{"var_type":"FIELD_FLOAT","initial_creation_delay":"0.5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_dark_willow_bramble_maze extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_willow_bramble_maze";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_willow_bramble_maze = Data_dark_willow_bramble_maze ;
}
    