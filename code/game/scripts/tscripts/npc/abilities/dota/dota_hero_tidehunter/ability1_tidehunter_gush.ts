
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tidehunter_gush = {"ID":"5118","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","HasScepterUpgrade":"1","AbilitySound":"Ability.GushCast","AbilityCastRange":"700","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"12","AbilityDuration":"4.0","AbilityManaCost":"100 105 110 115","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","gush_damage":"110 160 210 260","LinkedSpecialBonus":"special_bonus_unique_tidehunter_2"},"02":{"var_type":"FIELD_INTEGER","projectile_speed":"2500"},"03":{"var_type":"FIELD_INTEGER","movement_speed":"-40 -40 -40 -40"},"04":{"var_type":"FIELD_FLOAT","negative_armor":"4 5 6 7","LinkedSpecialBonus":"special_bonus_unique_tidehunter"},"05":{"var_type":"FIELD_INTEGER","speed_scepter":"1500","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","aoe_scepter":"260","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","cooldown_scepter":"7","RequiresScepter":"1"},"08":{"var_type":"FIELD_INTEGER","cast_range_scepter":"2200","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_tidehunter_gush extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tidehunter_gush";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tidehunter_gush = Data_tidehunter_gush ;
}
    