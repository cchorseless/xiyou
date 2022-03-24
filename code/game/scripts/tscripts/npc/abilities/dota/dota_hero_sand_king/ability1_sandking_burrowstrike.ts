
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sandking_burrowstrike = {"ID":"5102","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","HasScepterUpgrade":"1","AbilitySound":"Ability.SandKing_BurrowStrike","AbilityCastRange":"400 500 600 700","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCooldown":"14 13 12 11","AbilityManaCost":"110 120 130 140","AbilityDamage":"100 160 220 280","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","burrow_width":"150"},"02":{"var_type":"FIELD_FLOAT","burrow_duration":"1.6 1.8 2.0 2.2"},"03":{"var_type":"FIELD_INTEGER","burrow_speed":"2000"},"04":{"var_type":"FIELD_FLOAT","burrow_anim_time":"0.52"},"05":{"var_type":"FIELD_INTEGER","cast_range_scepter":"1300","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","burrow_speed_scepter":"3000","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_sandking_burrowstrike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sandking_burrowstrike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sandking_burrowstrike = Data_sandking_burrowstrike ;
}
    