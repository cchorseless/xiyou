
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_treant_leech_seed = {"ID":"5435","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Treant.LeechSeed.Cast","AbilityCastPoint":"0.4","AbilityCastRange":"400","FightRecapLevel":"1","AbilityCooldown":"18 16 14 12","AbilityManaCost":"80 90 100 110","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","damage_interval":"1"},"02":{"var_type":"FIELD_INTEGER","leech_damage":"16 32 48 64","LinkedSpecialBonus":"special_bonus_unique_treant_2"},"03":{"var_type":"FIELD_INTEGER","movement_slow":"-8 -14 -20 -26"},"05":{"var_type":"FIELD_INTEGER","radius":"650"},"06":{"var_type":"FIELD_FLOAT","duration":"5.0"},"07":{"var_type":"FIELD_INTEGER","projectile_speed":"450"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_treant_leech_seed extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "treant_leech_seed";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_treant_leech_seed = Data_treant_leech_seed ;
}
    