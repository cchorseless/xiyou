
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dazzle_shallow_grave = {"ID":"5234","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Dazzle.Shallow_Grave","AbilityCastAnimation":"ACT_DOTA_SHALLOW_GRAVE","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"700 800 900 1000","AbilityCastPoint":"0.3","AbilityCooldown":"36 30 24 18","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"4 4.5 5.0 5.5"},"02":{"var_type":"FIELD_FLOAT","fx_halo_height":"190 240 300 350"}}} ;

@registerAbility()
export class ability2_dazzle_shallow_grave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dazzle_shallow_grave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dazzle_shallow_grave = Data_dazzle_shallow_grave ;
}
    