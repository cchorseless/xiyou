
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_kunkka_return = {"ID":"5034","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Ability.XMarksTheSpot.Return","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCastPoint":"0.4 0.4 0.4 0.4","AbilityCooldown":"1.0","AbilityManaCost":"0"} ;

@registerAbility()
export class ability7_kunkka_return extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_return";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_return = Data_kunkka_return ;
}
    