
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_broodmother_silken_bola = {"ID":"639","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilityCastRange":"750","AbilityCastPoint":"0.1","HasShardUpgrade":"1","AbilityCooldown":"24 20 16 12","AbilityManaCost":"70 75 80 85","AbilityModifierSupportValue":"0.3","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","movement_speed":"25 35 45 55"},"02":{"var_type":"FIELD_FLOAT","duration":"6"},"03":{"var_type":"FIELD_INTEGER","projectile_speed":"1200"},"04":{"var_type":"FIELD_INTEGER","impact_damage":"100 120 140 160"},"05":{"var_type":"FIELD_INTEGER","attack_damage":"5 6 7 8"},"06":{"var_type":"FIELD_INTEGER","miss_chance":"40"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability3_broodmother_silken_bola extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "broodmother_silken_bola";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_broodmother_silken_bola = Data_broodmother_silken_bola ;
}
    