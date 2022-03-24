
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_ghost_walk = {"ID":"5381","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","HotKeyOverride":"V","AbilitySound":"Hero_Invoker.GhostWalk","AbilityCooldown":"45","AbilityManaCost":"200","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"100.0"},"02":{"var_type":"FIELD_INTEGER","area_of_effect":"400"},"03":{"var_type":"FIELD_INTEGER","enemy_slow":"-20 -25 -30 -35 -40 -45 -50 -55","levelkey":"quaslevel"},"04":{"var_type":"FIELD_INTEGER","self_slow":"-30 -20 -10 0 10 20 30 40","levelkey":"wexlevel"},"05":{"var_type":"FIELD_FLOAT","aura_fade_time":"2.0"}}} ;

@registerAbility()
export class ability8_invoker_ghost_walk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_ghost_walk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_ghost_walk = Data_invoker_ghost_walk ;
}
    