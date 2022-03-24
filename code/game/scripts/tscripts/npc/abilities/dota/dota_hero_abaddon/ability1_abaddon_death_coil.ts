
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_abaddon_death_coil = {"ID":"5585","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Abaddon.DeathCoil.Cast","AbilityCastRange":"575","AbilityCastPoint":"0.25","AbilityCooldown":"5.5","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","self_damage":"50"},"02":{"var_type":"FIELD_FLOAT","target_damage":"110 160 210 260","LinkedSpecialBonus":"special_bonus_unique_abaddon_2"},"03":{"var_type":"FIELD_INTEGER","heal_amount":"110 160 210 260","LinkedSpecialBonus":"special_bonus_unique_abaddon_2"},"04":{"var_type":"FIELD_INTEGER","missile_speed":"1300"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_abaddon_death_coil extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abaddon_death_coil";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abaddon_death_coil = Data_abaddon_death_coil ;
}
    