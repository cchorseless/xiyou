
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_snapfire_gobble_up = {"ID":"6484","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Hero_Snapfire.GobbleUp.Cast","AbilityCastPoint":"0.3","AbilityManaCost":"150","AbilityCastRange":"150","AbilityCooldown":"40","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","max_time_in_belly":"3.0","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability4_snapfire_gobble_up extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "snapfire_gobble_up";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_snapfire_gobble_up = Data_snapfire_gobble_up ;
}
    