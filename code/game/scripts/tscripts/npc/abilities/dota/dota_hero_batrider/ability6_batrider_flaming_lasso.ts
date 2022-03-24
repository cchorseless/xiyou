
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_batrider_flaming_lasso = {"ID":"5323","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"2","AbilitySound":"Hero_Batrider.FlamingLasso.Cast","HasScepterUpgrade":"1","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastRange":"175","AbilityCooldown":"120 115 110","AbilityManaCost":"225","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3.0 3.5 4.0"},"02":{"var_type":"FIELD_INTEGER","drag_distance":"300 300 300"},"03":{"var_type":"FIELD_INTEGER","break_distance":"425"},"04":{"var_type":"FIELD_INTEGER","grab_radius":"400"},"05":{"var_type":"FIELD_INTEGER","grab_radius_scepter":"600","RequiresScepter":"1"},"06":{"var_type":"FIELD_FLOAT","damage":"35 55 75"},"07":{"var_type":"FIELD_FLOAT","allied_cooldown":"20"}}} ;

@registerAbility()
export class ability6_batrider_flaming_lasso extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "batrider_flaming_lasso";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_batrider_flaming_lasso = Data_batrider_flaming_lasso ;
}
    