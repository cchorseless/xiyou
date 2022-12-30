
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tinker_defense_matrix = {"ID":"650","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"400","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"30","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_absorb":"350"},"02":{"var_type":"FIELD_INTEGER","status_resistance":"50"},"03":{"var_type":"FIELD_FLOAT","barrier_duration":"15"}}} ;

@registerAbility()
export class ability4_tinker_defense_matrix extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tinker_defense_matrix";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tinker_defense_matrix = Data_tinker_defense_matrix ;
}
    