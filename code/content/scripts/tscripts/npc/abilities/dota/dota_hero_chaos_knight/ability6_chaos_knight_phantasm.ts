
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chaos_knight_phantasm = {"ID":"5429","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"2","HasScepterUpgrade":"1","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","AbilityCastRange":"1200","AbilitySound":"Hero_ChaosKnight.Phantasm","AbilityCastPoint":"0.4 0.4 0.4","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"75","AbilityManaCost":"75 125 175","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","images_count":"1 2 3"},"02":{"var_type":"FIELD_FLOAT","illusion_duration":"30","LinkedSpecialBonus":"special_bonus_unique_chaos_knight_4"},"03":{"var_type":"FIELD_INTEGER","outgoing_damage":"0"},"04":{"var_type":"FIELD_INTEGER","outgoing_damage_tooltip":"100"},"05":{"var_type":"FIELD_INTEGER","incoming_damage":"225"},"06":{"var_type":"FIELD_INTEGER","incoming_damage_tooltip":"325"},"07":{"var_type":"FIELD_FLOAT","invuln_duration":"0.5"},"08":{"var_type":"FIELD_INTEGER","vision_radius":"400"},"09":{"var_type":"FIELD_INTEGER","magic_resistance":"0"}}} ;

@registerAbility()
export class ability6_chaos_knight_phantasm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chaos_knight_phantasm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chaos_knight_phantasm = Data_chaos_knight_phantasm ;
}
    