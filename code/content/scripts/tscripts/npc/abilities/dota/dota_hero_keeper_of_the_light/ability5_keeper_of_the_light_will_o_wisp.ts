
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_keeper_of_the_light_will_o_wisp = {"ID":"7316","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_KeeperOfTheLight.ManaLeak.Cast","MaxLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastPoint":"0.1","AbilityCooldown":"60","AbilityManaCost":"250","AbilityCastRange":"800","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","on_count":"5"},"02":{"var_type":"FIELD_INTEGER","radius":"725"},"03":{"var_type":"FIELD_INTEGER","hit_count":"6"},"04":{"var_type":"FIELD_FLOAT","off_duration":"1.85"},"05":{"var_type":"FIELD_FLOAT","on_duration":"1.3"},"06":{"var_type":"FIELD_FLOAT","off_duration_initial":"1.0"},"07":{"var_type":"FIELD_INTEGER","fixed_movement_speed":"60"},"08":{"var_type":"FIELD_INTEGER","bounty":"100"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability5_keeper_of_the_light_will_o_wisp extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_will_o_wisp";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_will_o_wisp = Data_keeper_of_the_light_will_o_wisp ;
}
    