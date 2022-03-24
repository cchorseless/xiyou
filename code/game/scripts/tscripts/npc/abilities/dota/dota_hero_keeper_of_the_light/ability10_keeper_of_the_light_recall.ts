
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_keeper_of_the_light_recall = {"ID":"5475","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_INVULNERABLE","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","AbilitySound":"Hero_KeeperOfTheLight.Recall.Cast","IsShardUpgrade":"1","IsGrantedByShard":"1","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastRange":"0","AbilityCooldown":"15","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","teleport_delay":"3"}}} ;

@registerAbility()
export class ability10_keeper_of_the_light_recall extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_recall";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_recall = Data_keeper_of_the_light_recall ;
}
    