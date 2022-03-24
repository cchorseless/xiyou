
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_oracle_purifying_flames = {"ID":"5639","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY | DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Oracle.PurifyingFlames.Damage","AbilityCastRange":"850","AbilityCastPoint":"0.15","AbilityCooldown":"2.25","AbilityManaCost":"80 85 90 95","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"90 180 270 360"},"02":{"var_type":"FIELD_FLOAT","heal_per_second":"11.0 22.0 33.0 44.0"},"03":{"var_type":"FIELD_INTEGER","total_heal_tooltip":"99 198 297 396"},"04":{"var_type":"FIELD_FLOAT","duration":"9.0"},"05":{"var_type":"FIELD_FLOAT","tick_rate":"1.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_oracle_purifying_flames extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "oracle_purifying_flames";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_oracle_purifying_flames = Data_oracle_purifying_flames ;
}
    