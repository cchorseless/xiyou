
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_abaddon_aphotic_shield = {"ID":"5586","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Abaddon.AphoticShield.Cast","AbilityCastRange":"500","AbilityCastPoint":"0.3","AbilityCooldown":"12.0 10.0 8.0 6.0","AbilityManaCost":"100 110 120 130","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"15.0"},"02":{"var_type":"FIELD_FLOAT","damage_absorb":"110 140 170 200","LinkedSpecialBonus":"special_bonus_unique_abaddon"},"03":{"var_type":"FIELD_INTEGER","radius":"675"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_abaddon_aphotic_shield extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abaddon_aphotic_shield";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abaddon_aphotic_shield = Data_abaddon_aphotic_shield ;
}
    