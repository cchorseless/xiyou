
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bane_enfeeble = {"ID":"5012","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_Bane.Enfeeble","AbilityCastPoint":"0.2","AbilityCastRange":"800 900 1000 1000","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilityCooldown":"28 21 14 7","AbilityManaCost":"40 50 60 70","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_reduction":"45 50 55 60"},"02":{"var_type":"FIELD_INTEGER","heal_reduction":"45 50 55 60"},"03":{"var_type":"FIELD_INTEGER","cast_reduction":"30"},"04":{"var_type":"FIELD_FLOAT","duration":"8 9 10 11"}}} ;

@registerAbility()
export class ability1_bane_enfeeble extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bane_enfeeble";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bane_enfeeble = Data_bane_enfeeble ;
}
    