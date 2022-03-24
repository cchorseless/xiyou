
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chen_hand_of_god = {"ID":"5331","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","FightRecapLevel":"2","AbilitySound":"Hero_Chen.HandOfGodHealHero","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"160 140 120","AbilityManaCost":"250 350 450","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","heal_amount":"275 450 625","LinkedSpecialBonus":"special_bonus_unique_chen_2"},"02":{"var_type":"FIELD_INTEGER","ancient_creeps_scepter":"1 2 3","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_chen_hand_of_god extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chen_hand_of_god";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chen_hand_of_god = Data_chen_hand_of_god ;
}
    