
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_warlock_fatal_bonds = {"ID":"5162","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Warlock.FatalBonds","AbilityCastAnimation":"ACT_DOTA_FATAL_BONDS","AbilityCastRange":"1000","AbilityCastGestureSlot":"DEFAULT","AbilityCastPoint":"0.2","AbilityCooldown":"36 30 24 18","AbilityDamage":"0 0 0 0","AbilityManaCost":"140","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","count":"6","LinkedSpecialBonus":"special_bonus_unique_warlock_9"},"02":{"var_type":"FIELD_INTEGER","damage_share_percentage":"12 16 20 24","LinkedSpecialBonus":"special_bonus_unique_warlock_5"},"03":{"var_type":"FIELD_FLOAT","duration":"25.0"},"04":{"var_type":"FIELD_FLOAT","search_aoe":"700"}}} ;

@registerAbility()
export class ability1_warlock_fatal_bonds extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "warlock_fatal_bonds";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_warlock_fatal_bonds = Data_warlock_fatal_bonds ;
}
    