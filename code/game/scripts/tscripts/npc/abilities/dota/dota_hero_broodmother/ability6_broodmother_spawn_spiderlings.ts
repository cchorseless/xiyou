
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_broodmother_spawn_spiderlings = {"ID":"5279","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"1","AbilitySound":"Hero_Broodmother.SpawnSpiderlingsImpact","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"900","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"9 8 7","AbilityManaCost":"100","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","buff_duration":"20"},"02":{"var_type":"FIELD_FLOAT","spiderling_duration":"60.0 60.0 60.0 60.0"},"03":{"var_type":"FIELD_INTEGER","damage":"300 370 440","LinkedSpecialBonus":"special_bonus_unique_broodmother_3"},"04":{"var_type":"FIELD_INTEGER","count":"4 5 6"},"05":{"var_type":"FIELD_INTEGER","projectile_speed":"1200"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability6_broodmother_spawn_spiderlings extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "broodmother_spawn_spiderlings";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_broodmother_spawn_spiderlings = Data_broodmother_spawn_spiderlings ;
}
    