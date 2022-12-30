
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_treant_living_armor = {"ID":"5436","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Treant.LivingArmor.Cast","AbilityCastPoint":"0.3","FightRecapLevel":"1","AbilityCooldown":"26 22 18 14","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","total_heal":"60 100 140 180","LinkedSpecialBonus":"special_bonus_unique_treant_8"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"5 6 7 8","LinkedSpecialBonus":"special_bonus_unique_treant_13"},"03":{"var_type":"FIELD_FLOAT","duration":"12.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_treant_living_armor extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "treant_living_armor";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_treant_living_armor = Data_treant_living_armor ;
}
    