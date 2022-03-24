
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_alacrity = {"ID":"5384","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","MaxLevel":"1","HotKeyOverride":"Z","AbilitySound":"Hero_Invoker.Alacrity","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"650","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"17","AbilityManaCost":"60","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"10 25 40 55 70 85 100 115","levelkey":"wexlevel","LinkedSpecialBonus":"special_bonus_unique_invoker_5"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"10 25 40 55 70 85 100 115","levelkey":"exortlevel","LinkedSpecialBonus":"special_bonus_unique_invoker_5"},"03":{"var_type":"FIELD_FLOAT","duration":"9"}}} ;

@registerAbility()
export class ability11_invoker_alacrity extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_alacrity";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_alacrity = Data_invoker_alacrity ;
}
    