
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_weaver_time_lapse = {"ID":"5292","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","AbilityCastRange":"600","AbilitySound":"Hero_Weaver.TimeLapse","FightRecapLevel":"2","HasScepterUpgrade":"1","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"70 55 40","AbilityManaCost":"150 75 0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","cooldown_scepter":"20","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","cast_range_tooltip_scepter":"600","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_weaver_time_lapse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "weaver_time_lapse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_weaver_time_lapse = Data_weaver_time_lapse ;
}
    