
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_seer_normal_punch = {"ID":"687","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","MaxLevel":"1","IsShardUpgrade":"1","IsGrantedByShard":"1","AbilityCooldown":"14","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","max_stun":"2.25"},"02":{"var_type":"FIELD_FLOAT","recent_duration":"3.0"},"03":{"var_type":"FIELD_INTEGER","max_distance":"900"},"04":{"var_type":"FIELD_INTEGER","knockback_distance":"350"},"05":{"var_type":"FIELD_FLOAT","illusion_duration":"5.0"},"06":{"var_type":"FIELD_INTEGER","max_damage":"250"},"07":{"var_type":"FIELD_FLOAT","normal_punch_illusion_delay":"0.7"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability4_dark_seer_normal_punch extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_seer_normal_punch";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_seer_normal_punch = Data_dark_seer_normal_punch ;
}
    