
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_oracle_fates_edict = {"ID":"5638","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY | DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Oracle.FatesEdict.Cast","HasScepterUpgrade":"1","AbilityCastRange":"500 600 700 800","AbilityCastPoint":"0.3","AbilityCooldown":"16 13 10 7","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3.0 3.5 4.0 4.5"},"02":{"var_type":"FIELD_INTEGER","magic_damage_resistance_pct_tooltip":"100"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_oracle_fates_edict extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "oracle_fates_edict";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_oracle_fates_edict = Data_oracle_fates_edict ;
}
    